#!/usr/bin/env node
/**
 * Baixa as fontes científicas primárias usadas para gerar os dados numéricos
 * do projeto. Os arquivos ficam em `.cache/sources/` (ignorado pelo git).
 *
 * Fontes:
 *  - CIAAW/IUPAC: pesos atômicos padrão (completo e abreviado) e isótopos
 *    mais estáveis dos elementos radioativos.
 *  - NUBASE2020 (Atomic Mass Data Center / IAEA): meias-vidas, modos de
 *    decaimento, excesso de massa e abundâncias isotópicas.
 *  - NIST PML: composições isotópicas e massas atômicas relativas.
 *  - PubChem (NIH): tabela periódica consolidada e registros PUG-View por
 *    elemento, que agregam dados de LANL, Jefferson Lab, NIST, CIAAW e IUPAC.
 *
 * Uso: npm run data:fetch  (depois: npm run data:build)
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = join(process.cwd(), '.cache', 'sources');

export const SOURCES = {
  ciaawStandard: 'https://www.ciaaw.org/atomic-weights.htm',
  ciaawAbridged: 'https://www.ciaaw.org/abridged-atomic-weights.htm',
  ciaawRadioactive: 'https://www.ciaaw.org/radioactive-elements.htm',
  nubase: 'https://www-nds.iaea.org/amdc/ame2020/nubase_4.mas20.txt',
  nist: 'https://physics.nist.gov/cgi-bin/Compositions/stand_alone.pl?ele=&all=all&ascii=ascii2&isotype=some',
  pubchemTable: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON',
  pubchemElement: (z) => `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/element/${z}/JSON`,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function download(url, file, { force = false } = {}) {
  const path = join(OUT, file);
  if (!force && (await exists(path))) return 'cached';
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'tabela-periodica-data-builder' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await writeFile(path, Buffer.from(await res.arrayBuffer()));
      return 'downloaded';
    } catch (err) {
      if (attempt === 4) throw new Error(`${url}: ${err.message}`);
      await sleep(2000 * 2 ** (attempt - 1));
    }
  }
}

async function main() {
  const force = process.argv.includes('--force');
  await mkdir(join(OUT, 'pubchem'), { recursive: true });
  const plain = [
    [SOURCES.ciaawStandard, 'ciaaw-standard.htm'],
    [SOURCES.ciaawAbridged, 'ciaaw-abridged.htm'],
    [SOURCES.ciaawRadioactive, 'ciaaw-radioactive.htm'],
    [SOURCES.nubase, 'nubase2020.txt'],
    [SOURCES.nist, 'nist-compositions.htm'],
    [SOURCES.pubchemTable, 'pubchem-periodictable.json'],
  ];
  for (const [url, file] of plain) {
    console.log(`${await download(url, file, { force })}: ${file}`);
  }
  for (let z = 1; z <= 118; z++) {
    const status = await download(SOURCES.pubchemElement(z), join('pubchem', `${z}.json`), { force });
    if (status === 'downloaded') await sleep(250); // respeita o limite de requisições do PubChem
  }
  console.log('PubChem PUG-View: 118 registros prontos.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
