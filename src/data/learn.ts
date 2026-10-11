/**
 * Perguntas e respostas do modo "Aprender".
 *
 * Os números citados nos textos (massas, abundâncias, meias-vidas,
 * eletronegatividades, contagens) são lidos da camada de dados — nunca
 * digitados à mão —, para que os textos acompanhem qualquer atualização das
 * fontes primárias (CIAAW, NUBASE2020, NIST, PubChem).
 */
import type { Action, AppState, PanelMode } from '../state/types';
import type { FilterId } from '../lib/filters';
import type { TrendId } from '../lib/trends';
import { formatHalfLife, formatMass, formatNumber } from '../lib/format';
import { ELEMENTS, getElement } from './elements';
import type { CategoryId } from './types';

// ---------------------------------------------------------------------------
// Destaques na tabela ("Ver na tabela")
// ---------------------------------------------------------------------------

/** O que um botão "Ver na tabela" destaca (ou para onde leva). */
export type TableFocus =
  | { kind: 'group'; group: number }
  | { kind: 'period'; period: number }
  | { kind: 'category'; category: CategoryId }
  | { kind: 'filter'; filter: FilterId }
  | { kind: 'trend'; trend: TrendId }
  | { kind: 'panel'; panel: PanelMode };

/** Ações que aplicam o destaque: sempre partem de uma seleção limpa. */
export function focusActions(focus: TableFocus): Action[] {
  switch (focus.kind) {
    case 'group':
      return [{ type: 'clearFocus' }, { type: 'toggleGroup', group: focus.group }];
    case 'period':
      return [{ type: 'clearFocus' }, { type: 'togglePeriod', period: focus.period }];
    case 'category':
      return [{ type: 'clearFocus' }, { type: 'toggleCategoryFocus', category: focus.category }];
    case 'filter':
      return [{ type: 'clearFocus' }, { type: 'setFilters', filters: [focus.filter] }];
    case 'trend':
      return [{ type: 'setTrend', trend: focus.trend }, { type: 'setPanel', panel: 'trends' }];
    case 'panel':
      return [{ type: 'setPanel', panel: focus.panel }];
  }
}

/** O destaque já está aplicado? (Tendências e painéis levam a outro modo, então nunca ficam "ativos" aqui.) */
export function isFocusActive(focus: TableFocus, state: AppState): boolean {
  switch (focus.kind) {
    case 'group':
      return state.groupFocus === focus.group;
    case 'period':
      return state.periodFocus === focus.period;
    case 'category':
      return state.categoryFocus === focus.category;
    case 'filter':
      return state.filters.length === 1 && state.filters[0] === focus.filter;
    default:
      return false;
  }
}

// ---------------------------------------------------------------------------
// Valores lidos dos dados
// ---------------------------------------------------------------------------

const TOTAL = ELEMENTS.length;
const NATURAL = ELEMENTS.filter((el) => el.natural).length;
const WITH_STABLE = ELEMENTS.filter((el) => el.props.stableIsotopeCount > 0).length;
const STABLE_RECORD = ELEMENTS.reduce((best, el) => (el.props.stableIsotopeCount > best.props.stableIsotopeCount ? el : best));
const PERIOD_SIZES = [1, 2, 3, 4, 5, 6, 7].map((p) => ELEMENTS.filter((el) => el.period === p).length);
/** Elementos cujo número de camadas ocupadas difere do período (só o paládio, nos dados atuais). */
const PERIOD_EXCEPTIONS = ELEMENTS.filter((el) => el.shells.length > 0 && el.shells.length !== el.period);

const name = (z: number) => getElement(z).name.toLowerCase();
const mass = (z: number) => formatMass(getElement(z).atomicMassDisplay);
const shells = (z: number) => getElement(z).shells.join('-');
const electronegativity = (z: number) => formatNumber(getElement(z).props.electronegativity, 2);

/** Lista em português: "a, b e c". */
export function joinPt(items: string[]): string {
  return items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
}

function isotope(z: number, massNumber: number) {
  return getElement(z).isotopes.find((i) => i.massNumber === massNumber && !i.isomer);
}

/** Meia-vida de um isótopo (NUBASE2020) ou "não disponível". */
function halfLife(z: number, massNumber: number): string {
  const iso = isotope(z, massNumber);
  return iso?.halfLife ? formatHalfLife(iso.halfLife) : 'não disponível';
}

/** Abundância natural (%) de um isótopo (NIST) ou "não disponível". */
function abundance(z: number, massNumber: number): string {
  return formatNumber(isotope(z, massNumber)?.abundance ?? null, 2);
}

const periodException =
  PERIOD_EXCEPTIONS.length === 1
    ? ` A única exceção é o ${name(PERIOD_EXCEPTIONS[0].z)}, do período ${PERIOD_EXCEPTIONS[0].period}, que no estado fundamental tem elétrons em apenas ${PERIOD_EXCEPTIONS[0].shells.length} camadas.`
    : '';

// ---------------------------------------------------------------------------
// Tópicos
// ---------------------------------------------------------------------------

export interface LearnTopic {
  id: string;
  question: string;
  /** 1 a 3 parágrafos curtos. */
  answer: string[];
  example?: string;
  /** Números atômicos relacionados (mostrados como atalhos para as fichas). */
  related?: number[];
  /** O que o botão "Ver na tabela" destaca. */
  focus?: TableFocus;
}

export const LEARN_TOPICS: LearnTopic[] = [
  {
    id: 'elemento',
    question: 'O que é um elemento químico?',
    answer: [
      'Elemento químico é o conjunto de todos os átomos que têm o mesmo número de prótons no núcleo. Esse número, o número atômico, é a "identidade" do elemento: todo átomo com 6 prótons é carbono, esteja ele num diamante, no grafite de um lápis ou no gás carbônico que expiramos.',
      `Hoje são conhecidos ${TOTAL} elementos. ${NATURAL} deles ocorrem na natureza (alguns apenas em traços ínfimos); os demais só foram obtidos em laboratório, em reatores nucleares ou aceleradores de partículas. Cada elemento é representado por um símbolo de uma ou duas letras, como H, O, Fe e Au.`,
      'Elemento não é o mesmo que substância: o gás oxigênio (O₂) que respiramos e o ozônio (O₃) são substâncias diferentes, formadas pelo mesmo elemento, o oxigênio.',
    ],
    example: 'Diamante e grafite são feitos apenas de átomos de carbono. São o mesmo elemento, mas formam substâncias com propriedades muito diferentes: um é o material natural mais duro, o outro é macio e risca o papel.',
    related: [6, 8, 79],
  },
  {
    id: 'numero-atomico',
    question: 'O que é número atômico?',
    answer: [
      'O número atômico (Z) é a quantidade de prótons no núcleo de um átomo. É ele que define qual é o elemento: um núcleo com 8 prótons é de oxigênio; com 7, já seria de nitrogênio.',
      'Num átomo eletricamente neutro, o número de elétrons é igual a Z. A tabela periódica moderna é organizada em ordem crescente de número atômico, que aparece no canto de cada cartão. Em 1913, Henry Moseley demonstrou, com espectros de raios X, que esse número corresponde à carga do núcleo.',
    ],
    example: 'Ferro (Fe): Z = 26, ou seja, 26 prótons e, no átomo neutro, 26 elétrons. O íon Fe³⁺ continua sendo ferro (26 prótons), mas tem apenas 23 elétrons.',
    related: [26, 8, 7],
  },
  {
    id: 'massa-atomica',
    question: 'O que é massa atômica?',
    answer: [
      'A massa atômica mostrada na tabela (o "peso atômico padrão") é a massa média dos átomos de um elemento, levando em conta seus isótopos e a abundância de cada um na natureza. Ela é expressa em unidades de massa atômica (u, também chamada dalton, Da): 1 u corresponde a 1/12 da massa de um átomo de carbono-12.',
      `Por ser uma média ponderada, raramente é um número inteiro. O cloro natural tem cerca de ${abundance(17, 35)}% de cloro-35 e ${abundance(17, 37)}% de cloro-37, e a média fica em ${mass(17)} u. Os valores são revisados pela comissão CIAAW, da IUPAC; quando a composição isotópica varia conforme a origem da amostra, a IUPAC publica um intervalo, e a tabela mostra um valor abreviado.`,
      `Valores entre colchetes, como ${mass(43)} no tecnécio ou ${mass(94)} no plutônio, aparecem nos elementos sem isótopos estáveis e sem composição isotópica característica na natureza. Sem uma "média natural", mostra-se o número de massa (prótons + nêutrons) do isótopo de vida mais longa. Tório, protactínio e urânio são radioativos, mas têm composição característica na Terra, por isso suas massas não têm colchetes.`,
    ],
    example: `Carbono: ${mass(6)} u. Não é exatamente 12 porque cerca de ${abundance(6, 13)}% dos átomos de carbono são de carbono-13, um pouco mais pesado.`,
    related: [17, 6, 43, 94],
  },
  {
    id: 'grupo',
    question: 'O que é grupo?',
    answer: [
      'Grupo é cada uma das 18 colunas da tabela, numeradas de 1 a 18 da esquerda para a direita (numeração recomendada pela IUPAC desde 1988). Elementos do mesmo grupo têm, em geral, o mesmo número de elétrons na camada mais externa e, por isso, comportamento químico parecido.',
      'Muitos livros brasileiros ainda usam a numeração antiga, com letras: os grupos 1 e 2 correspondem a 1A e 2A; os grupos 13 a 18, a 3A até 8A (ou 0); e os grupos 3 a 12, dos metais de transição, formam as "famílias B".',
    ],
    example: 'Grupo 17 (halogênios, antigo 7A): flúor, cloro, bromo e iodo têm 7 elétrons de valência e reagem facilmente com metais, formando sais como o cloreto de sódio (NaCl).',
    related: [9, 17, 35, 53],
    focus: { kind: 'group', group: 17 },
  },
  {
    id: 'periodo',
    question: 'O que é período?',
    answer: [
      `Período é cada uma das 7 linhas horizontais da tabela. O número do período indica quantas camadas eletrônicas (níveis de energia) estão ocupadas no átomo: os elementos do período 3, por exemplo, têm elétrons em 3 camadas (K, L e M).${periodException}`,
      `Ao percorrer um período da esquerda para a direita, o número atômico aumenta de 1 em 1 e as propriedades mudam gradualmente: de metais muito reativos, no início, até um gás nobre, no final. Os períodos têm ${joinPt(PERIOD_SIZES.map(String))} elementos, porque a cada período entram em jogo novos subníveis (veja "Por que a tabela periódica tem esse formato?").`,
    ],
    example: `Período 3: do sódio (Na) ao argônio (Ar). Distribuição dos elétrons por camada: sódio ${shells(11)}, cloro ${shells(17)}, argônio ${shells(18)}. Sempre 3 camadas.`,
    related: [11, 17, 18],
    focus: { kind: 'period', period: 3 },
  },
  {
    id: 'familia',
    question: 'O que é uma família química?',
    answer: [
      '"Família" é o nome tradicional de um grupo da tabela cujos elementos têm propriedades muito parecidas. Várias famílias têm nome próprio: metais alcalinos (grupo 1, exceto o hidrogênio), metais alcalino-terrosos (grupo 2), calcogênios (grupo 16), halogênios (grupo 17) e gases nobres (grupo 18). Os grupos 13, 14 e 15 são chamados de famílias do boro, do carbono e do nitrogênio (este último também é chamado de pnictogênios).',
      'Também se fala em conjuntos que não correspondem a uma só coluna, como os metais de transição (grupos 3 a 12), os lantanídeos e os actinídeos. Nesta tabela, a cor de cada cartão indica a categoria, sempre acompanhada de uma sigla, para não depender só da cor.',
    ],
    example: 'Metais alcalinos (lítio, sódio, potássio...): têm 1 elétron de valência, são macios a ponto de serem cortados com faca e reagem vigorosamente com a água, liberando gás hidrogênio.',
    related: [3, 11, 19],
    focus: { kind: 'category', category: 'alkali-metal' },
  },
  {
    id: 'eletronegatividade',
    question: 'O que é eletronegatividade?',
    answer: [
      `Eletronegatividade é a tendência de um átomo de atrair para si os elétrons de uma ligação química. Não é medida diretamente: é uma escala comparativa. A mais usada é a de Linus Pauling, sem unidade, na qual o flúor é o elemento mais eletronegativo (${electronegativity(9)}).`,
      'Na tabela, a eletronegatividade tende a aumentar da esquerda para a direita ao longo de um período e a diminuir de cima para baixo em um grupo. Hélio, neônio e argônio não têm valor nessa escala, porque praticamente não formam ligações químicas.',
    ],
    example: `Na água (H₂O), o oxigênio (${electronegativity(8)}) atrai os elétrons das ligações com mais força que o hidrogênio (${electronegativity(1)}). Por isso o oxigênio fica com carga parcial negativa, os hidrogênios com carga parcial positiva, e a molécula é polar.`,
    related: [9, 8, 1],
    focus: { kind: 'trend', trend: 'electronegativity' },
  },
  {
    id: 'valencia',
    question: 'O que são elétrons de valência?',
    answer: [
      'Elétrons de valência são os elétrons da camada mais externa do átomo, a camada de valência. São eles que participam das ligações químicas e, por isso, determinam boa parte do comportamento químico de um elemento.',
      'Nos grupos 1, 2 e 13 a 18 (os elementos representativos), dá para descobrir o número de elétrons de valência pela posição: grupo 1 → 1; grupo 2 → 2; grupo 13 → 3; grupo 14 → 4; e assim por diante, até o grupo 18 → 8 (o hélio, com apenas 2, é a exceção). Nos metais de transição a situação é mais complexa, porque elétrons de subníveis d internos também podem participar das ligações.',
    ],
    example: `O sódio (camadas ${shells(11)}) tende a perder seu único elétron de valência; o cloro (${shells(17)}) tende a ganhar um. Assim se forma o cloreto de sódio (Na⁺Cl⁻), o sal de cozinha.`,
    related: [11, 17],
  },
  {
    id: 'isotopos',
    question: 'O que são isótopos?',
    answer: [
      'Isótopos são átomos de um mesmo elemento (mesmo número de prótons) com números diferentes de nêutrons e, portanto, números de massa diferentes (número de massa = prótons + nêutrons). Quimicamente se comportam de forma quase idêntica, mas diferem na massa e na estabilidade do núcleo.',
      `Um isótopo é indicado pelo nome do elemento seguido do número de massa: carbono-12 (¹²C), carbono-13 (¹³C) e carbono-14 (¹⁴C) têm 6 prótons e, respectivamente, 6, 7 e 8 nêutrons. Os dois primeiros são estáveis; o carbono-14 é radioativo, com meia-vida de ${halfLife(6, 14)}, e é usado para datar materiais de origem orgânica.`,
      `Dos ${TOTAL} elementos, ${WITH_STABLE} têm pelo menos um isótopo estável. O recordista é o ${name(STABLE_RECORD.z)}, com ${STABLE_RECORD.props.stableIsotopeCount} isótopos estáveis.`,
    ],
    example: 'Hidrogênio: prótio (¹H, sem nêutrons), deutério (²H, 1 nêutron) e trítio (³H, 2 nêutrons, radioativo). A "água pesada" é feita com deutério.',
    related: [1, 6, STABLE_RECORD.z],
  },
  {
    id: 'radioatividade',
    question: 'O que é radioatividade?',
    answer: [
      'Radioatividade é a emissão espontânea de radiação por núcleos atômicos instáveis, que assim se transformam em núcleos mais estáveis, muitas vezes de outro elemento. Foi descoberta por Henri Becquerel em 1896, com sais de urânio; em 1898, Marie e Pierre Curie descobriram o polônio e o rádio.',
      'Os tipos mais comuns são três. Alfa (α): o núcleo emite 2 prótons e 2 nêutrons (um núcleo de hélio-4); o número atômico cai 2 e o de massa cai 4. É pouco penetrante: uma folha de papel a detém. Beta (β⁻): um nêutron vira próton e um elétron é emitido; o número atômico sobe 1. É barrada por alguns milímetros de alumínio. Gama (γ): radiação eletromagnética de alta energia que não muda o elemento; só é bem atenuada por camadas espessas de chumbo ou concreto.',
      `Meia-vida é o tempo para que metade dos núcleos de uma amostra se desintegre. Ela varia enormemente: ${halfLife(118, 294)} no oganessônio-294, ${halfLife(6, 14)} no carbono-14 e ${halfLife(92, 238)} no urânio-238 (dados da NUBASE2020).`,
    ],
    example: 'Depois de uma meia-vida, resta metade dos núcleos radioativos; depois de duas, um quarto; depois de três, um oitavo, e assim por diante.',
    related: [92, 84, 88],
    focus: { kind: 'filter', filter: 'radioativos' },
  },
  {
    id: 'formato',
    question: 'Por que a tabela periódica tem esse formato?',
    answer: [
      'A tabela segue a ordem crescente de número atômico, e o formato reflete como os elétrons ocupam os subníveis s, p, d e f. Um subnível s comporta 2 elétrons; p, 6; d, 10; e f, 14. Por isso há um bloco s com 2 colunas (grupos 1 e 2), um bloco p com 6 (grupos 13 a 18), um bloco d com 10 (grupos 3 a 12) e um bloco f com 14 colunas.',
      `Cada período começa quando os elétrons passam a ocupar uma nova camada e termina num gás nobre; como a cada período entram novos subníveis, eles têm ${joinPt(PERIOD_SIZES.map(String))} elementos. O hélio fica no grupo 18, embora seus elétrons estejam num subnível s, porque, como os outros gases nobres, tem a camada completa e quase não reage.`,
      'Os períodos 6 e 7 têm 32 elementos, e uma tabela com 32 colunas ficaria larga demais. Por convenção, as séries dos lantanídeos (Z = 57 a 71) e dos actinídeos (Z = 89 a 103) aparecem em duas linhas separadas, abaixo da tabela principal, mas pertencem aos períodos 6 e 7: é só uma questão de espaço. (Ainda há debate entre químicos sobre quais elementos devem ficar no grupo 3, abaixo do escândio e do ítrio.)',
    ],
    example: 'No bloco f, os elétrons preenchem o subnível 4f nos lantanídeos (período 6) e o subnível 5f nos actinídeos (período 7).',
    related: [2, 57, 89],
    focus: { kind: 'category', category: 'lanthanide' },
  },
  {
    id: 'quem-criou',
    question: 'Quem criou a tabela periódica?',
    answer: [
      'O químico russo Dmitri Mendeleev é considerado o principal criador da tabela periódica. Em 1869, ele organizou os cerca de 63 elementos então conhecidos em ordem de massa atômica, alinhando os que tinham propriedades semelhantes. Seu grande trunfo foi deixar lacunas para elementos desconhecidos e prever suas propriedades, confirmadas com a descoberta do gálio (1875), do escândio (1879) e do germânio (1886).',
      'O alemão Lothar Meyer chegou de forma independente a uma classificação muito parecida, publicada em 1870; em 1882, os dois dividiram a Medalha Davy, da Royal Society. Antes deles houve tentativas importantes: as tríades de Döbereiner (1829), o "parafuso telúrico" de Chancourtois (1862) e a "lei das oitavas" de Newlands (1864–1865).',
      'A tabela atual, porém, é ordenada pelo número atômico, conceito estabelecido por Henry Moseley em 1913, e continua sendo atualizada: os nomes mais recentes, dos elementos 113, 115, 117 e 118, foram aprovados pela IUPAC em 2016.',
    ],
    related: [31, 21, 32],
    focus: { kind: 'panel', panel: 'history' },
  },
];
