import type { CategoryId } from './types';

export interface Category {
  id: CategoryId;
  label: string;
  /** Sigla curta exibida nos cartões, para não depender só da cor. */
  code: string;
  color: string;
  description: string;
}

/**
 * Categorias químicas. A IUPAC não define oficialmente todas essas famílias
 * (por exemplo, "metais pós-transição" e "semimetais" variam entre tabelas);
 * aqui seguimos a convenção mais usada em materiais didáticos.
 */
export const CATEGORIES: Category[] = [
  {
    id: 'alkali-metal',
    label: 'Metais alcalinos',
    code: 'MA',
    color: '#ff6b6b',
    description: 'Grupo 1 (exceto o hidrogênio). Metais macios e muito reativos, com um elétron de valência; reagem com a água formando bases fortes.',
  },
  {
    id: 'alkaline-earth-metal',
    label: 'Metais alcalino-terrosos',
    code: 'AT',
    color: '#ffa94d',
    description: 'Grupo 2. Metais reativos com dois elétrons de valência, comuns em minerais e na crosta terrestre.',
  },
  {
    id: 'transition-metal',
    label: 'Metais de transição',
    code: 'MT',
    color: '#fcc419',
    description: 'Grupos 3 a 12 (bloco d). Em geral duros, bons condutores e com vários estados de oxidação. O grupo 12 às vezes é excluído desta categoria pela definição da IUPAC.',
  },
  {
    id: 'post-transition-metal',
    label: 'Metais pós-transição',
    code: 'PT',
    color: '#69db7c',
    description: 'Metais do bloco p, mais macios e com pontos de fusão menores que os de transição (alumínio, estanho, chumbo...).',
  },
  {
    id: 'metalloid',
    label: 'Semimetais',
    code: 'SM',
    color: '#3bc9db',
    description: 'Também chamados metaloides: propriedades intermediárias entre metais e não metais. Muitos são semicondutores.',
  },
  {
    id: 'reactive-nonmetal',
    label: 'Não metais',
    code: 'NM',
    color: '#4dabf7',
    description: 'Não metais reativos (exceto halogênios): maus condutores, formam ligações covalentes e são essenciais à vida.',
  },
  {
    id: 'halogen',
    label: 'Halogênios',
    code: 'HA',
    color: '#748ffc',
    description: 'Grupo 17. Não metais muito reativos com sete elétrons de valência; formam sais com metais.',
  },
  {
    id: 'noble-gas',
    label: 'Gases nobres',
    code: 'GN',
    color: '#b197fc',
    description: 'Grupo 18. Camada de valência completa, o que os torna muito pouco reativos.',
  },
  {
    id: 'lanthanide',
    label: 'Lantanídeos',
    code: 'LA',
    color: '#e599f7',
    description: 'Do lantânio ao lutécio (Z = 57–71): preenchimento dos orbitais 4f. Junto com escândio e ítrio, formam as "terras-raras".',
  },
  {
    id: 'actinide',
    label: 'Actinídeos',
    code: 'AC',
    color: '#f783ac',
    description: 'Do actínio ao laurêncio (Z = 89–103): preenchimento dos orbitais 5f. Todos são radioativos.',
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<CategoryId, Category>;
