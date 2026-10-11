import type { CategoryId, ChemicalElement } from '../data/types';
import { STATE_REFERENCE } from '../data/elements';

export type FilterId =
  | 'radioativos'
  | 'nao-radioativos'
  | 'naturais'
  | 'sinteticos'
  | 'solidos'
  | 'liquidos'
  | 'gasosos'
  | 'metais'
  | 'nao-metais'
  | 'semimetais'
  | 'lantanideos'
  | 'actinideos'
  | 'gases-nobres'
  | 'halogenios'
  | 'alcalinos'
  | 'alcalino-terrosos'
  | 'transicao';

export interface FilterDef {
  id: FilterId;
  label: string;
  icon?: string;
  /** Agrupamento visual no painel. */
  section: 'Radioatividade' | 'Origem' | 'Estado físico' | 'Tipo' | 'Famílias';
  test: (el: ChemicalElement) => boolean;
  /** Explicação curta mostrada quando o filtro está ativo. */
  info: string;
}

const METAL_CATEGORIES: CategoryId[] = [
  'alkali-metal',
  'alkaline-earth-metal',
  'transition-metal',
  'post-transition-metal',
  'lanthanide',
  'actinide',
];
const NONMETAL_CATEGORIES: CategoryId[] = ['reactive-nonmetal', 'halogen', 'noble-gas'];

const REF = `${STATE_REFERENCE.celsius} °C e ${STATE_REFERENCE.pressure}`;

export const FILTERS: FilterDef[] = [
  {
    id: 'radioativos',
    label: 'Radioativos',
    icon: '☢',
    section: 'Radioatividade',
    test: (el) => el.radioactive,
    info: 'Radioatividade é a emissão espontânea de radiação por núcleos atômicos instáveis, que se transformam em outros núcleos. Aqui aparecem os elementos sem nenhum isótopo estável. O bismuto é tecnicamente radioativo, mas tão pouco que é considerado estável na prática.',
  },
  {
    id: 'nao-radioativos',
    label: 'Não radioativos',
    section: 'Radioatividade',
    test: (el) => !el.radioactive,
    info: 'Elementos que possuem pelo menos um isótopo estável. Alguns deles (como potássio e carbono) também têm isótopos radioativos naturais, mas em pequena proporção.',
  },
  {
    id: 'naturais',
    label: 'Naturais',
    section: 'Origem',
    test: (el) => el.natural,
    info: 'Elementos encontrados na natureza (Z = 1 a 94). Alguns existem apenas em quantidades ínfimas: tecnécio, promécio, neptúnio e plutônio aparecem em traços em minérios de urânio, e polônio, astato, radônio, frâncio, rádio, actínio e protactínio só existem por serem produzidos continuamente no decaimento do urânio e do tório.',
  },
  {
    id: 'sinteticos',
    label: 'Sintéticos',
    section: 'Origem',
    test: (el) => el.occurrence === 'synthetic' || Boolean(el.firstSynthesized),
    info: 'Elementos obtidos primeiro em laboratório, em reatores ou aceleradores de partículas. Do amerício (95) em diante, só existem por síntese. Tecnécio, promécio, astato, neptúnio e plutônio foram sintetizados antes de serem detectados em traços na natureza — por isso aparecem também em "Naturais".',
  },
  {
    id: 'solidos',
    label: 'Sólidos',
    section: 'Estado físico',
    test: (el) => el.state === 'solid',
    info: `Estado físico a ${REF}. Elementos superpesados e alguns muito raros nunca foram obtidos em quantidade suficiente para medir seu estado.`,
  },
  {
    id: 'liquidos',
    label: 'Líquidos',
    section: 'Estado físico',
    test: (el) => el.state === 'liquid',
    info: `A ${REF}, apenas mercúrio e bromo são líquidos. Gálio, césio e rubídio derretem pouco acima dessa temperatura.`,
  },
  {
    id: 'gasosos',
    label: 'Gasosos',
    section: 'Estado físico',
    test: (el) => el.state === 'gas',
    info: `Elementos gasosos a ${REF}: hidrogênio, nitrogênio, oxigênio, flúor, cloro e os gases nobres.`,
  },
  {
    id: 'metais',
    label: 'Metais',
    section: 'Tipo',
    test: (el) => METAL_CATEGORIES.includes(el.category),
    info: 'Metais conduzem bem calor e eletricidade, têm brilho metálico e tendem a perder elétrons. São a grande maioria dos elementos.',
  },
  {
    id: 'nao-metais',
    label: 'Não metais',
    section: 'Tipo',
    test: (el) => NONMETAL_CATEGORIES.includes(el.category),
    info: 'Não metais (incluindo halogênios e gases nobres) são maus condutores e tendem a ganhar ou compartilhar elétrons.',
  },
  {
    id: 'semimetais',
    label: 'Semimetais',
    section: 'Tipo',
    test: (el) => el.category === 'metalloid',
    info: 'Semimetais (metaloides) têm propriedades intermediárias; vários são semicondutores, base da eletrônica.',
  },
  { id: 'lantanideos', label: 'Lantanídeos', section: 'Famílias', test: (el) => el.category === 'lanthanide', info: 'Série do lantânio ao lutécio (Z = 57–71), em que se preenchem os orbitais 4f.' },
  { id: 'actinideos', label: 'Actinídeos', section: 'Famílias', test: (el) => el.category === 'actinide', info: 'Série do actínio ao laurêncio (Z = 89–103), em que se preenchem os orbitais 5f. Todos são radioativos.' },
  { id: 'gases-nobres', label: 'Gases nobres', section: 'Famílias', test: (el) => el.category === 'noble-gas', info: 'Grupo 18: camada de valência completa e baixíssima reatividade.' },
  { id: 'halogenios', label: 'Halogênios', section: 'Famílias', test: (el) => el.category === 'halogen', info: 'Grupo 17: sete elétrons de valência; muito reativos.' },
  { id: 'alcalinos', label: 'Metais alcalinos', section: 'Famílias', test: (el) => el.category === 'alkali-metal', info: 'Grupo 1 (sem o hidrogênio): um elétron de valência, reagem vigorosamente com a água.' },
  { id: 'alcalino-terrosos', label: 'Metais alcalino-terrosos', section: 'Famílias', test: (el) => el.category === 'alkaline-earth-metal', info: 'Grupo 2: dois elétrons de valência.' },
  { id: 'transicao', label: 'Metais de transição', section: 'Famílias', test: (el) => el.category === 'transition-metal', info: 'Grupos 3 a 12, o bloco d da tabela.' },
];

export const FILTER_BY_ID = Object.fromEntries(FILTERS.map((f) => [f.id, f])) as Record<FilterId, FilterDef>;

/** Filtros combinados: o elemento precisa atender a todos os filtros ativos. */
export function matchesFilters(el: ChemicalElement, active: FilterId[]): boolean {
  return active.every((id) => FILTER_BY_ID[id].test(el));
}

export function applyFilters(elements: ChemicalElement[], active: FilterId[]): ChemicalElement[] {
  return elements.filter((el) => matchesFilters(el, active));
}
