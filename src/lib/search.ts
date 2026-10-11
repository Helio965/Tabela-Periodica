import type { ChemicalElement } from '../data/types';
import { ELEMENTS } from '../data/elements';
import { normalize } from './text';

export interface SearchResult {
  element: ChemicalElement;
  score: number;
  /** Por que o elemento apareceu (ex.: "descobridor: Marie Curie"). */
  reason?: string;
}

/**
 * Pessoas homenageadas no nome do elemento (conforme a origem do nome descrita
 * em `elements/content`). Permite que "curie" encontre também o cúrio, que não
 * foi descoberto pelos Curie, mas leva o nome deles.
 */
const EPONYMS: Record<number, { person: string; mineral?: string }> = {
  62: { person: 'Vasili Samarsky-Bykhovets', mineral: 'samarskita' },
  64: { person: 'Johan Gadolin', mineral: 'gadolinita' },
  96: { person: 'Marie e Pierre Curie' },
  99: { person: 'Albert Einstein' },
  100: { person: 'Enrico Fermi' },
  101: { person: 'Dmitri Mendeleev' },
  102: { person: 'Alfred Nobel' },
  103: { person: 'Ernest O. Lawrence' },
  104: { person: 'Ernest Rutherford' },
  106: { person: 'Glenn T. Seaborg' },
  107: { person: 'Niels Bohr' },
  109: { person: 'Lise Meitner' },
  111: { person: 'Wilhelm Conrad Röntgen' },
  112: { person: 'Nicolau Copérnico' },
  114: { person: 'Georgy Flerov' },
  118: { person: 'Yuri Oganessian' },
};

/**
 * Busca tolerante a acentos e maiúsculas por nome, símbolo, número atômico,
 * nomes alternativos, nome em inglês, pessoa homenageada e descobridor.
 */
export function searchElements(query: string, elements: ChemicalElement[] = ELEMENTS, limit = 8): SearchResult[] {
  const raw = query.trim();
  if (!raw) return [];
  const q = normalize(raw);
  const results: SearchResult[] = [];

  for (const el of elements) {
    const name = normalize(el.name);
    const symbol = el.symbol.toLowerCase();
    const aliases = (el.aliases ?? []).map(normalize);
    const en = normalize(el.nameEn);
    const eponym = EPONYMS[el.z];
    let score = 0;
    let reason: string | undefined;

    if (/^\d+$/.test(q) && Number(q) === el.z) score = 1000;
    else if (symbol === q) score = 900;
    else if (name === q) score = 850;
    else if (aliases.includes(q)) { score = 800; reason = `também chamado ${el.aliases!.find((a) => normalize(a) === q)}`; }
    else if (name.startsWith(q)) score = 700 - name.length;
    else if (aliases.some((a) => a.startsWith(q))) { score = 600; reason = `também chamado ${el.aliases!.find((a) => normalize(a).startsWith(q))}`; }
    else if (en === q || en.startsWith(q)) { score = 550; reason = `em inglês: ${el.nameEn}`; }
    else if (q.length >= 2 && name.includes(q)) score = 500 - name.indexOf(q);
    else if (q.length >= 3 && eponym && normalize(eponym.person).includes(q)) {
      score = 400;
      reason = `nome em homenagem a ${eponym.person}${eponym.mineral ? ` (pelo mineral ${eponym.mineral})` : ''}`;
    }
    else if (q.length >= 3) {
      const discoverer = el.discovery.discoverers.find((d) => normalize(d).includes(q));
      if (discoverer) { score = 300; reason = `descoberto por ${discoverer}`; }
    }
    if (score > 0) results.push({ element: el, score, reason });
  }

  return results.sort((a, b) => b.score - a.score || a.element.z - b.element.z).slice(0, limit);
}
