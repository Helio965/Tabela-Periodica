import { CATEGORY_BY_ID } from './categories';
import { ELEMENTS } from './elements';
import { expandConfiguration } from './elements/shells';
import { SOURCE_BY_ID } from './sources';
import type { ChemicalElement, ElementContent } from './types';

export interface ValidationIssue {
  z?: number;
  message: string;
}

/** Pontos de referência conhecidos da tabela, para conferir as posições. */
const KNOWN_POSITIONS: Array<[number, number | null, number]> = [
  // [Z, grupo, período]
  [1, 1, 1], [2, 18, 1], [5, 13, 2], [10, 18, 2], [11, 1, 3], [18, 18, 3], [21, 3, 4], [26, 8, 4],
  [30, 12, 4], [36, 18, 4], [39, 3, 5], [47, 11, 5], [54, 18, 5], [55, 1, 6], [56, 2, 6], [57, null, 6],
  [71, null, 6], [72, 4, 6], [79, 11, 6], [82, 14, 6], [86, 18, 6], [87, 1, 7], [89, null, 7],
  [103, null, 7], [104, 4, 7], [112, 12, 7], [117, 17, 7], [118, 18, 7],
];

export function validateElements(elements: ChemicalElement[] = ELEMENTS): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const push = (message: string, z?: number) => issues.push({ z, message });

  if (elements.length !== 118) push(`Esperados 118 elementos, encontrados ${elements.length}`);

  const seen = { z: new Set<number>(), symbol: new Set<string>(), name: new Set<string>(), slug: new Set<string>(), cell: new Set<string>() };
  for (const el of elements) {
    if (!Number.isInteger(el.z) || el.z < 1 || el.z > 118) push(`Número atômico fora do intervalo: ${el.z}`, el.z);
    if (seen.z.has(el.z)) push(`Número atômico duplicado: ${el.z}`, el.z);
    seen.z.add(el.z);

    for (const [key, value] of [['symbol', el.symbol], ['name', el.name], ['slug', el.slug]] as const) {
      const set = seen[key];
      if (!value) push(`Campo obrigatório vazio: ${key}`, el.z);
      else if (set.has(value.toLowerCase())) push(`Valor duplicado em ${key}: ${value}`, el.z);
      set.add(value.toLowerCase());
    }
    if (!/^[A-Z][a-z]?$/.test(el.symbol)) push(`Símbolo com formato inválido: ${el.symbol}`, el.z);

    const cell = `${el.gridRow}-${el.gridColumn}`;
    if (seen.cell.has(cell)) push(`Duas células na mesma posição da grade (${cell})`, el.z);
    seen.cell.add(cell);

    if (!CATEGORY_BY_ID[el.category]) push(`Categoria não cadastrada: ${el.category}`, el.z);
    if (!(el.atomicMass > el.z && el.atomicMass < el.z * 3)) push(`Massa atômica implausível: ${el.atomicMass}`, el.z);
    if (!el.atomicMassDisplay) push('Massa atômica sem texto de exibição', el.z);
    if (!el.highlight) push('Curiosidade de destaque ausente', el.z);
    if (!el.discovery || el.discovery.discoverers.length === 0) push('Descobridores ausentes', el.z);
    if (el.discovery.year !== null && (el.discovery.year < 1000 || el.discovery.year > new Date().getFullYear())) {
      push(`Ano de descoberta implausível: ${el.discovery.year}`, el.z);
    }
    if (el.discovery.year === null && !el.discovery.yearLabel) push('Elemento antigo sem rótulo de época', el.z);

    if (el.props.electronConfiguration) {
      const total = expandConfiguration(el.props.electronConfiguration).reduce((s, x) => s + x.electrons, 0);
      if (total !== el.z) push(`Configuração eletrônica soma ${total} elétrons`, el.z);
      const shellTotal = el.shells.reduce((s, x) => s + x, 0);
      if (shellTotal !== el.z) push(`Camadas somam ${shellTotal} elétrons`, el.z);
    } else {
      push('Configuração eletrônica ausente', el.z);
    }

    // Coerência entre categoria e posição
    if (el.category === 'lanthanide' && !(el.z >= 57 && el.z <= 71)) push('Lantanídeo fora de 57–71', el.z);
    if (el.category === 'actinide' && !(el.z >= 89 && el.z <= 103)) push('Actinídeo fora de 89–103', el.z);
    if (el.category === 'noble-gas' && el.group !== 18) push('Gás nobre fora do grupo 18', el.z);
    if (el.category === 'halogen' && el.group !== 17) push('Halogênio fora do grupo 17', el.z);
    if (el.category === 'alkali-metal' && el.group !== 1) push('Metal alcalino fora do grupo 1', el.z);
    if (el.category === 'alkaline-earth-metal' && el.group !== 2) push('Alcalino-terroso fora do grupo 2', el.z);

    // Radioatividade coerente com isótopos e ocorrência
    const hasStable = el.isotopes.some((i) => i.stable);
    if (hasStable && el.radioactive) push('Marcado como radioativo, mas possui isótopo estável', el.z);
    if (el.occurrence === 'synthetic' && el.z < 95) push('Elemento natural marcado como sintético', el.z);
    if (el.isotopes.length === 0) push('Nenhum isótopo listado', el.z);
  }

  for (const [z, group, period] of KNOWN_POSITIONS) {
    const el = elements.find((e) => e.z === z);
    if (el && (el.group !== group || el.period !== period)) {
      push(`Posição incorreta: esperado grupo ${group}, período ${period}; obtido ${el.group}, ${el.period}`, z);
    }
  }
  return issues;
}

export function validateContent(content: ElementContent[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const push = (message: string, z?: number) => issues.push({ z, message });
  if (content.length !== 118) push(`Esperados 118 conteúdos, encontrados ${content.length}`);
  const seen = new Set<number>();
  const stories = new Set<string>();
  for (const c of content) {
    if (seen.has(c.z)) push('Conteúdo duplicado', c.z);
    seen.add(c.z);
    if (c.discoveryStory.length < 2) push('"Como foi descoberto" precisa de pelo menos 2 parágrafos', c.z);
    const story = c.discoveryStory.join(' ');
    if (stories.has(story)) push('Texto de descoberta repetido de outro elemento', c.z);
    stories.add(story);
    if (!c.nameOrigin || !c.symbolOrigin) push('Origem do nome/símbolo ausente', c.z);
    if (!c.nature.text) push('Seção "Na natureza" vazia', c.z);
    if (c.uses.length === 0) push('Sem usos cadastrados', c.z);
    if (c.curiosities.length < 2 || c.curiosities.length > 5) push(`Curiosidades: ${c.curiosities.length} (esperado 2–5)`, c.z);
    if (!c.hazards.text) push('Seção de segurança vazia', c.z);
    for (const id of c.extraSources ?? []) if (!SOURCE_BY_ID[id]) push(`Fonte não cadastrada: ${id}`, c.z);
  }
  for (let z = 1; z <= 118; z++) if (!seen.has(z)) push('Conteúdo ausente', z);
  return issues;
}
