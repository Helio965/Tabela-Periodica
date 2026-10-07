#!/usr/bin/env node
/**
 * Gera os dados numéricos dos elementos a partir das fontes primárias baixadas
 * por `scripts/fetch-sources.mjs`.
 *
 * Saídas (versionadas no repositório):
 *  - src/data/generated/properties.json  → propriedades físico-químicas
 *  - src/data/generated/isotopes.json    → isótopos principais por elemento
 *
 * Saída auxiliar (não versionada):
 *  - .cache/texts/<Z>.txt → textos originais (LANL, Jefferson Lab, CIAAW,
 *    IUPAC/IPTEI) usados como base para redigir o conteúdo educacional.
 *
 * Nenhum valor é inventado: quando a fonte não traz um dado confiável, o campo
 * fica `null` e a interface mostra "não disponível".
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, '.cache', 'sources');
const OUT = join(ROOT, 'src', 'data', 'generated');
const TEXTS = join(ROOT, '.cache', 'texts');

const KEV_PER_U = 931494.10242; // AME2020: 1 u = 931 494.102 42 keV

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------
const decodeEntities = (s) =>
  s
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&[a-z]+;/g, ' ');

const stripTags = (s) => decodeEntities(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

function htmlRows(html) {
  const rows = [];
  for (const m of html.matchAll(/<tr[\s\S]*?<\/tr>/g)) {
    const cells = [...m[0].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((c) => stripTags(c[1]));
    rows.push(cells);
  }
  return rows;
}

const num = (v) => {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// ---------------------------------------------------------------------------
// CIAAW — pesos atômicos padrão
// ---------------------------------------------------------------------------
async function parseCiaaw() {
  const abridged = htmlRows(await readFile(join(SRC, 'ciaaw-abridged.htm'), 'utf8'));
  const standard = htmlRows(await readFile(join(SRC, 'ciaaw-standard.htm'), 'utf8'));
  const result = new Map();
  for (const row of abridged) {
    const z = Number(row[0]);
    if (!Number.isInteger(z) || z < 1) continue;
    const raw = row[3];
    if (!raw || raw === '—') continue;
    const [value, uncertainty] = raw.split('±').map((s) => s.trim());
    result.set(z, { abridged: value, abridgedUncertainty: uncertainty ?? null });
  }
  for (const row of standard) {
    const z = Number(row[0]);
    if (!Number.isInteger(z) || z < 1) continue;
    const raw = row[3];
    if (!raw || raw === '—') continue;
    const entry = result.get(z) ?? {};
    entry.standard = raw.replace(/\s+/g, ' ');
    entry.notes = row[4] || null;
    result.set(z, entry);
  }
  return result;
}

/**
 * CIAAW — "Most stable known isotopes of radioactive elements" (compilação da
 * NUBASE2020). Algumas linhas trazem mais de um candidato quando as meias-vidas
 * se sobrepõem dentro das incertezas.
 */
async function parseCiaawRadioactive() {
  const rows = htmlRows(await readFile(join(SRC, 'ciaaw-radioactive.htm'), 'utf8'));
  const map = new Map();
  let current = null;
  for (const row of rows) {
    if (row.length >= 5 && Number.isInteger(Number(row[0])) && Number(row[0]) > 0) {
      current = Number(row[0]);
      map.set(current, [{ massNumber: Number(row[3]), halfLife: row[4] }]);
    } else if (row.length === 2 && current && Number.isInteger(Number(row[0]))) {
      map.get(current).push({ massNumber: Number(row[0]), halfLife: row[1] });
    }
  }
  return map;
}

// ---------------------------------------------------------------------------
// NUBASE2020 — propriedades nucleares
// ---------------------------------------------------------------------------
const HALF_LIFE_UNITS = {
  ys: 1e-24, zs: 1e-21, as: 1e-18, fs: 1e-15, ps: 1e-12, ns: 1e-9, us: 1e-6, ms: 1e-3,
  s: 1, m: 60, h: 3600, d: 86400,
  y: 31556926, ky: 31556926e3, My: 31556926e6, Gy: 31556926e9, Ty: 31556926e12,
  Py: 31556926e15, Ey: 31556926e18, Zy: 31556926e21, Yy: 31556926e24,
};

const DECAY_LABELS = new Set(['A', 'B-', 'B+', 'EC', 'e+', 'IT', 'SF', 'p', 'n', '2B-', '2B+', 'B-n', 'B+p', 'B-2n', 'B+A', 'B-A', '2p', '2n', '14C', 'B+SF', 'B-SF', '24Ne', '28Mg', '34Si']);

function parseNubase(text) {
  const nuclides = [];
  for (const line of text.split('\n')) {
    if (!line || line.startsWith('#')) continue;
    const A = Number(line.slice(0, 3));
    const Z = Number(line.slice(4, 7));
    const iso = line[7];
    const name = line.slice(11, 16).trim();
    const isomerFlag = line[16]?.trim() || '';
    const massExcessRaw = line.slice(18, 31).trim();
    const halfRaw = line.slice(69, 78).trim();
    const unit = line.slice(78, 80).trim();
    const discovery = num(line.slice(114, 118).trim());
    const br = line.slice(119).trim();
    if (!Number.isInteger(Z) || Z < 1 || Z > 118) continue;

    const estimatedMass = massExcessRaw.includes('#');
    const massExcess = num(massExcessRaw.replace('#', ''));
    const mass = massExcess === null ? null : A + massExcess / KEV_PER_U;

    let halfLife = null;
    let stable = false;
    if (halfRaw === 'stbl') stable = true;
    else if (halfRaw && halfRaw !== 'p-unst' && !halfRaw.includes('#') && HALF_LIFE_UNITS[unit]) {
      const cleaned = halfRaw.replace(/[<>~]/g, '');
      const v = num(cleaned);
      if (v !== null) {
        halfLife = {
          value: v,
          unit,
          seconds: v * HALF_LIFE_UNITS[unit],
          approximate: /[<>~]/.test(halfRaw),
        };
      }
    }

    let abundance = null;
    const decays = [];
    for (const tokRaw of br.split(';')) {
      const tok = tokRaw.trim();
      if (!tok) continue;
      const m = tok.match(/^([A-Za-z0-9+\-]+)\s*([=~<>?]*)\s*([0-9.eE+\-]*)/);
      if (!m) continue;
      const [, mode, op, val] = m;
      if (mode === 'IS') {
        abundance = num(val);
        continue;
      }
      if (DECAY_LABELS.has(mode)) {
        decays.push({ mode, intensity: op === '=' ? num(val) : null, approx: op !== '=' });
      }
    }

    nuclides.push({
      A, Z, name,
      isomer: iso !== '0' ? isomerFlag || 'm' : null,
      stable, halfLife, abundance, decays,
      mass: mass === null ? null : Number(mass.toFixed(estimatedMass ? 3 : 6)),
      estimatedMass,
      discoveryYear: discovery,
    });
  }
  return nuclides;
}

// ---------------------------------------------------------------------------
// NIST — composição isotópica representativa
// ---------------------------------------------------------------------------
function parseNist(html) {
  const pre = html.slice(html.indexOf('<pre>'), html.indexOf('</pre>'));
  const blocks = pre.split(/\n\s*\n/);
  const map = new Map(); // `${Z}-${A}` → { mass, composition }
  for (const block of blocks) {
    const get = (k) => {
      const m = block.match(new RegExp(`${k} = (.*)`));
      return m ? m[1].trim() : '';
    };
    const Z = Number(get('Atomic Number'));
    const A = Number(get('Mass Number'));
    if (!Z || !A) continue;
    const massStr = get('Relative Atomic Mass');
    const compStr = get('Isotopic Composition');
    map.set(`${Z}-${A}`, {
      massText: massStr,
      mass: num(massStr.replace(/\(.*\)/, '').replace('#', '')),
      composition: compStr ? num(compStr.replace(/\(.*\)/, '')) : null,
    });
  }
  return map;
}

// ---------------------------------------------------------------------------
// PubChem — tabela consolidada e PUG-View
// ---------------------------------------------------------------------------
async function parsePubchemTable() {
  const json = JSON.parse(await readFile(join(SRC, 'pubchem-periodictable.json'), 'utf8'));
  const cols = json.Table.Columns.Column;
  return json.Table.Row.map((r) => Object.fromEntries(cols.map((c, i) => [c, r.Cell[i]])));
}

function walkSections(record, fn, path = []) {
  for (const s of record.Section ?? []) {
    const p = [...path, s.TOCHeading];
    fn(s, p);
    walkSections(s, fn, p);
  }
}

const infoText = (inf) => {
  const v = inf.Value ?? {};
  if (v.StringWithMarkup) return v.StringWithMarkup.map((x) => x.String).join('\n\n');
  if (v.Number) return `${v.Number.join(' ')} ${v.Unit ?? ''}`.trim();
  return '';
};

/** "1.40×103 milligrams per kilogram" → 1400 (os sobrescritos chegam achatados). */
function parseAbundance(text) {
  if (!text || /not applicable/i.test(text)) return null;
  const m = text.match(/([0-9.]+)\s*×\s*10(−|-)?(\d+)/);
  if (m) return Number((Number(m[1]) * 10 ** ((m[2] ? -1 : 1) * Number(m[3]))).toPrecision(4));
  const plain = text.match(/^([0-9.]+)/);
  return plain ? Number(plain[1]) : null;
}

async function parsePugView(z) {
  const json = JSON.parse(await readFile(join(SRC, 'pubchem', `${z}.json`), 'utf8'));
  const record = json.Record;
  const refs = new Map((record.Reference ?? []).map((r) => [r.ReferenceNumber, r]));
  const out = {
    radii: {},
    crustal: null,
    oceanic: null,
    stableIsotopeCount: null,
    links: {},
    texts: [],
    classification: null,
  };
  for (const r of refs.values()) {
    if (!r.URL) continue;
    if (r.SourceName.startsWith('Los Alamos')) out.links.lanl = r.URL;
    else if (r.SourceName.startsWith('Jefferson Lab')) out.links.jlab = r.URL;
    else if (r.SourceName.startsWith('IUPAC Commission')) out.links.ciaaw = r.URL;
    else if (r.SourceName.startsWith('NIST')) out.links.nist = r.URL;
  }
  out.links.pubchem = `https://pubchem.ncbi.nlm.nih.gov/element/${z}`;

  walkSections(record, (sec, path) => {
    const head = sec.TOCHeading;
    for (const inf of sec.Information ?? []) {
      const ref = refs.get(inf.ReferenceNumber);
      const src = ref?.SourceName ?? '';
      const text = infoText(inf);
      if (head === 'Atomic Radius') {
        const m = text.match(/^(?:empirical:\s*)?([0-9.]+)/);
        if (m && !/predicted/i.test(text)) {
          if (inf.Name?.startsWith('Empirical')) out.radii.empirical = Number(m[1]);
          if (inf.Name?.startsWith('Covalent')) out.radii.covalent = Number(m[1]);
          if (inf.Name?.startsWith('Van der Waals')) out.radii.vanDerWaals = Number(m[1]);
        }
      }
      if (head === 'Estimated Crustal Abundance') out.crustal = parseAbundance(text);
      if (head === 'Estimated Oceanic Abundance') out.oceanic = parseAbundance(text);
      if (head === 'Element Classification') out.classification = text;
      if (path[0] === 'Isotopes' && inf.Name === 'Stable Isotope Count') out.stableIsotopeCount = num(text);
      const wanted = ['History', 'Description', 'Uses', 'Sources', 'Handling and Storage', 'Production'];
      if (wanted.includes(head) || (path[0] === 'Isotopes' && head !== 'Atomic Mass, Half Life, and Decay' && head !== 'Isotope Mass and Abundance')) {
        out.texts.push({ section: path.join(' / '), source: src, name: inf.Name ?? '', text });
      }
    }
  });
  return out;
}

// ---------------------------------------------------------------------------
// Seleção dos isótopos exibidos
// ---------------------------------------------------------------------------
/** Isótopos com relevância didática, médica, energética ou geológica. */
const NOTABLE = {
  1: [3], 6: [11, 14], 7: [13], 8: [15], 9: [18], 11: [22, 24], 15: [32], 16: [35], 19: [40], 20: [41],
  24: [51], 26: [55, 59, 60], 27: [57, 60], 31: [67, 68], 36: [81, 85], 37: [82, 87], 38: [89, 90],
  39: [90], 42: [99], 43: [97, 98, 99, '99m'], 49: [111], 53: [123, 125, 129, 131], 54: [133], 55: [134, 137],
  61: [145, 147], 62: [153], 71: [177], 77: [192], 79: [198], 81: [201], 82: [210], 84: [208, 209, 210], 86: [222],
  88: [223, 224, 226, 228], 89: [225, 227], 90: [229, 230, 232], 92: [233, 234, 235, 238], 93: [237, 239],
  94: [238, 239, 240, 244], 95: [241, 243], 96: [244, 247], 98: [251, 252],
};

function selectIsotopes(z, nuclides, nist) {
  const own = nuclides.filter((n) => n.Z === z);
  const ground = own.filter((n) => !n.isomer || n.stable);
  const pick = new Map();
  const add = (n, reason) => {
    const key = `${n.A}${n.isomer ? 'm' : ''}`;
    if (!pick.has(key)) pick.set(key, { n, reason });
  };

  // 1) Estáveis e naturalmente presentes (com abundância isotópica).
  ground.filter((n) => n.stable || n.abundance !== null).forEach((n) => add(n, 'natural'));
  // 2) Isótopos notáveis.
  for (const a of NOTABLE[z] ?? []) {
    const isomer = typeof a === 'string';
    const A = isomer ? Number(a.replace('m', '')) : a;
    const n = own.find((x) => x.A === A && (isomer ? x.isomer : !x.isomer));
    if (n && (n.stable || n.halfLife)) add(n, 'notable');
  }
  // 3) Radioisótopos de vida mais longa (estado fundamental, meia-vida medida).
  const longest = ground
    .filter((n) => !n.stable && n.halfLife)
    .sort((a, b) => b.halfLife.seconds - a.halfLife.seconds);
  const radioactiveShown = () => [...pick.values()].filter((p) => !p.n.stable).length;
  for (const n of longest) {
    if (radioactiveShown() >= (pick.size >= 6 ? 1 : 3)) break;
    add(n, 'longest');
  }

  return [...pick.values()]
    .map(({ n, reason }) => {
      const nistEntry = nist.get(`${z}-${n.A}`);
      const abundance = n.isomer ? n.abundance : nistEntry?.composition !== null && nistEntry?.composition !== undefined
        ? Number((nistEntry.composition * 100).toPrecision(6))
        : n.abundance;
      return {
        massNumber: n.A,
        isomer: Boolean(n.isomer) && !n.stable ? true : Boolean(n.isomer),
        mass: !n.isomer && nistEntry?.mass ? nistEntry.mass : n.mass,
        massEstimated: n.estimatedMass,
        abundance: abundance ?? null,
        stable: n.stable,
        halfLife: n.halfLife,
        decayModes: n.decays.filter((d) => d.mode !== 'IS'),
        discoveryYear: n.discoveryYear,
        reason,
      };
    })
    .sort((a, b) => a.massNumber - b.massNumber || Number(a.isomer) - Number(b.isomer));
}

// ---------------------------------------------------------------------------
// Principal
// ---------------------------------------------------------------------------
async function main() {
  const ciaaw = await parseCiaaw();
  const ciaawRadioactive = await parseCiaawRadioactive();
  const nuclides = parseNubase(await readFile(join(SRC, 'nubase2020.txt'), 'latin1'));
  const nist = parseNist(await readFile(join(SRC, 'nist-compositions.htm'), 'utf8'));
  const table = await parsePubchemTable();

  await mkdir(OUT, { recursive: true });
  await mkdir(TEXTS, { recursive: true });

  const properties = [];
  const isotopes = {};

  for (let z = 1; z <= 118; z++) {
    const row = table.find((r) => Number(r.AtomicNumber) === z);
    if (!row) throw new Error(`PubChem: elemento ${z} ausente`);
    const pv = await parsePugView(z);
    const own = nuclides.filter((n) => n.Z === z);
    const ground = own.filter((n) => !n.isomer);
    const stableCount = own.filter((n) => n.stable && !n.isomer).length;

    // Peso atômico: CIAAW quando há valor padrão; caso contrário, número de
    // massa do isótopo de meia-vida mais longa (convenção da IUPAC) entre colchetes.
    const w = ciaaw.get(z);
    let atomicWeight;
    if (w?.abridged) {
      atomicWeight = {
        kind: 'standard',
        value: Number(w.abridged),
        display: w.abridged,
        uncertainty: w.abridgedUncertainty,
        standard: w.standard ?? null,
        source: 'ciaaw-abridged-2024',
      };
    } else {
      // Entre os candidatos listados pelo CIAAW, adota-se o de maior meia-vida
      // (valor central da NUBASE2020); os demais ficam registrados.
      const candidates = (ciaawRadioactive.get(z) ?? []).map((c) => {
        const n = ground.find((g) => g.A === c.massNumber);
        return { massNumber: c.massNumber, halfLifeText: c.halfLife, halfLife: n?.halfLife ?? null };
      });
      if (candidates.length === 0) throw new Error(`CIAAW: sem isótopo de referência para Z=${z}`);
      const best = [...candidates].sort((a, b) => (b.halfLife?.seconds ?? 0) - (a.halfLife?.seconds ?? 0))[0];
      atomicWeight = {
        kind: 'mass-number',
        value: best.massNumber,
        display: `[${best.massNumber}]`,
        uncertainty: null,
        standard: null,
        source: 'ciaaw-radioactive-nubase2020',
        referenceIsotope: best,
        alternatives: candidates.filter((c) => c.massNumber !== best.massNumber),
      };
    }

    const state = (row.StandardState || '').toLowerCase();
    properties.push({
      atomicNumber: z,
      symbol: row.Symbol,
      nameEn: row.Name,
      atomicWeight,
      electronConfiguration: row.ElectronConfiguration.replace(/\s*\(predicted\)/, '') || null,
      electronConfigurationPredicted: /predicted/i.test(row.ElectronConfiguration),
      electronegativity: num(row.Electronegativity),
      radii: {
        covalent: pv.radii.covalent ?? null,
        empirical: pv.radii.empirical ?? null,
        vanDerWaals: pv.radii.vanDerWaals ?? num(row.AtomicRadius),
      },
      ionizationEnergy: num(row.IonizationEnergy),
      electronAffinity: num(row.ElectronAffinity),
      oxidationStates: row.OxidationStates ? row.OxidationStates.split(',').map((s) => s.trim()).filter(Boolean) : [],
      standardState: state.includes('gas') ? 'gas' : state.includes('liquid') ? 'liquid' : state.includes('solid') ? 'solid' : 'unknown',
      standardStatePredicted: state.startsWith('expected'),
      meltingPoint: num(row.MeltingPoint),
      boilingPoint: num(row.BoilingPoint),
      density: num(row.Density),
      crustalAbundance: pv.crustal,
      oceanicAbundance: pv.oceanic,
      stableIsotopeCount: stableCount,
      pubchemYearDiscovered: row.YearDiscovered || null,
      links: pv.links,
    });

    isotopes[z] = selectIsotopes(z, nuclides, nist);

    const lines = [`# ${z} ${row.Name} (${row.Symbol})`, ''];
    for (const t of pv.texts) {
      lines.push(`## ${t.section} — ${t.source}${t.name ? ` — ${t.name}` : ''}`, t.text, '');
    }
    await writeFile(join(TEXTS, `${String(z).padStart(3, '0')}.txt`), lines.join('\n'));
  }

  await writeFile(join(OUT, 'properties.json'), `${JSON.stringify(properties, null, 1)}\n`);
  await writeFile(join(OUT, 'isotopes.json'), `${JSON.stringify(isotopes, null, 1)}\n`);
  console.log(`properties.json: ${properties.length} elementos`);
  console.log(`isotopes.json: ${Object.values(isotopes).reduce((s, l) => s + l.length, 0)} isótopos`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
