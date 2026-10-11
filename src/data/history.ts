/**
 * História da Tabela Periódica: linha do tempo, previsões de Mendeleev e
 * fontes consultadas.
 *
 * Todos os links e DOIs abaixo foram conferidos (Crossref e acesso direto em
 * outubro de 2026); `npm run check:links` também lê este arquivo. Massas,
 * densidades e temperaturas "observadas" vêm da camada de dados (CIAAW 2024 e
 * PubChem), não de valores digitados à mão.
 */
import { formatDensity, formatMass, formatNumber, formatTemperature } from '../lib/format';
import { ELEMENTS, getElement } from './elements';
import { joinPt, type TableFocus } from './learn';

const name = (z: number) => getElement(z).name.toLowerCase();
const names = (zs: number[]) => joinPt(zs.map(name));
const mass = (z: number) => formatMass(getElement(z).atomicMassDisplay);
const withSymbols = (zs: number[]) => joinPt(zs.map((z) => `${name(z)} (${getElement(z).symbol})`));

/** Média das massas atômicas atuais de dois elementos (ex.: tríades de Döbereiner). */
const average = (a: number, b: number) => formatNumber((getElement(a).atomicMass + getElement(b).atomicMass) / 2, 2);

// ---------------------------------------------------------------------------
// Fontes da seção de história
// ---------------------------------------------------------------------------

export interface HistorySource {
  id: string;
  title: string;
  /** Periódico, editora ou instituição. */
  publisher: string;
  /** Ausente para livros e artigos sem versão on-line verificável. */
  url?: string;
  citation?: string;
  usedFor: string;
}

export const HISTORY_SOURCES: HistorySource[] = [
  {
    id: 'shi-lavoisier',
    title: 'Antoine-Laurent Lavoisier',
    publisher: 'Science History Institute (biografias científicas)',
    url: 'https://www.sciencehistory.org/education/scientific-biographies/antoine-laurent-lavoisier/',
    usedFor: 'Lista de 33 "substâncias simples" do Tratado Elementar de Química (1789).',
  },
  {
    id: 'shi-dalton',
    title: 'John Dalton & The Theory of Atomism',
    publisher: 'Science History Institute (biografias científicas)',
    url: 'https://www.sciencehistory.org/education/scientific-biographies/john-dalton/',
    usedFor: 'Massas atômicas de Dalton e o livro A New System of Chemical Philosophy (1808).',
  },
  {
    id: 'dobereiner-1829',
    title: 'Versuch zu einer Gruppirung der elementaren Stoffe nach ihrer Analogie',
    publisher: 'Annalen der Physik 91(2), 301–307 (1829)',
    url: 'https://doi.org/10.1002/andp.18290910217',
    citation: 'Döbereiner, J. W. Ann. Phys. 91, 301–307 (1829).',
    usedFor: 'Artigo original das tríades.',
  },
  {
    id: 'mendeleev-1871',
    title: 'O sistema natural dos elementos e sua aplicação à indicação das propriedades de elementos não descobertos (em russo)',
    publisher: 'Journal of the Russian Chemical Society 3(7), 25–56 (1871)',
    citation: 'Mendeleev, D. I. Zh. Russ. Khim. Obshch. 3, 25–56 (1871).',
    usedFor: 'Artigo em que Mendeleev detalhou as previsões do eka-boro, eka-alumínio e eka-silício.',
  },
  {
    id: 'greenwood-earnshaw',
    title: 'Chemistry of the Elements (2ª edição)',
    publisher: 'Butterworth-Heinemann/Elsevier, 1997 — ISBN 978-0-7506-3365-9',
    citation: 'Greenwood, N. N.; Earnshaw, A. Chemistry of the Elements, 2. ed. (1997).',
    usedFor: 'Resumo das previsões de Mendeleev para o eka-alumínio comparadas ao gálio.',
  },
  {
    id: 'weeks-1932',
    title: 'The discovery of the elements. XV. Some elements predicted by Mendeleeff',
    publisher: 'Journal of Chemical Education 9(9), 1605 (1932)',
    url: 'https://doi.org/10.1021/ed009p1605',
    citation: 'Weeks, M. E. J. Chem. Educ. 9, 1605 (1932).',
    usedFor: 'Histórico das descobertas do gálio, do escândio e do germânio.',
  },
  {
    id: 'stewart-2019',
    title: 'Mendeleev’s predictions: success and failure',
    publisher: 'Foundations of Chemistry 21, 3–9 (2019)',
    url: 'https://doi.org/10.1007/s10698-018-9312-0',
    citation: 'Stewart, P. J. Found. Chem. 21, 3–9 (2019).',
    usedFor: 'Balanço das previsões de Mendeleev que se confirmaram e das que falharam.',
  },
  {
    id: 'ramsay-1904',
    title: 'The Rare Gases of the Atmosphere (Nobel Lecture, 1904)',
    publisher: 'NobelPrize.org — Nobel Prize Outreach',
    url: 'https://www.nobelprize.org/prizes/chemistry/1904/ramsay/lecture/',
    usedFor: `Descoberta dos gases nobres: ${names([18, 2, 10, 36, 54])}.`,
  },
  {
    id: 'moseley-1913',
    title: 'The high-frequency spectra of the elements',
    publisher: 'Philosophical Magazine 26(156), 1024–1034 (1913)',
    url: 'https://doi.org/10.1080/14786441308635052',
    citation: 'Moseley, H. G. J. Phil. Mag. 26, 1024–1034 (1913).',
    usedFor: 'Número atômico determinado por espectros de raios X.',
  },
  {
    id: 'bohr-1922',
    title: 'The Structure of the Atom (Nobel Lecture, 1922)',
    publisher: 'NobelPrize.org — Nobel Prize Outreach',
    url: 'https://www.nobelprize.org/prizes/physics/1922/bohr/lecture/',
    usedFor: 'Explicação da periodicidade pelas camadas eletrônicas e previsão do elemento 72 (háfnio).',
  },
  {
    id: 'seaborg-1945',
    title: 'The Chemical and Radioactive Properties of the Heavy Elements',
    publisher: 'Chemical & Engineering News 23(23), 2190–2193 (1945)',
    url: 'https://doi.org/10.1021/cen-v023n023.p2190',
    citation: 'Seaborg, G. T. Chem. Eng. News 23, 2190–2193 (1945).',
    usedFor: 'Publicação do conceito dos actinídeos.',
  },
  {
    id: 'seaborg-1951',
    title: 'The Transuranium Elements: Present Status (Nobel Lecture, 1951)',
    publisher: 'NobelPrize.org — Nobel Prize Outreach',
    url: 'https://www.nobelprize.org/prizes/chemistry/1951/seaborg/lecture/',
    usedFor: 'Relato de Seaborg sobre a série dos actinídeos e a descoberta do amerício e do cúrio.',
  },
  {
    id: 'fluck-1988',
    title: 'New notations in the periodic table',
    publisher: 'Pure and Applied Chemistry 60(3), 431–436 (1988)',
    url: 'https://doi.org/10.1351/pac198860030431',
    citation: 'Fluck, E. Pure Appl. Chem. 60, 431–436 (1988).',
    usedFor: 'Recomendação da IUPAC de numerar os grupos de 1 a 18.',
  },
  {
    id: 'iupac-1997',
    title: 'Names and symbols of transfermium elements (IUPAC Recommendations 1997)',
    publisher: 'Pure and Applied Chemistry 69(12), 2471–2474 (1997)',
    url: 'https://doi.org/10.1351/pac199769122471',
    usedFor: 'Nomes definitivos dos elementos 104 a 109.',
  },
  {
    id: 'iupac-2016',
    title: 'Names and symbols of the elements with atomic numbers 113, 115, 117 and 118 (IUPAC Recommendations 2016)',
    publisher: 'Pure and Applied Chemistry 88(12), 1225–1229 (2016)',
    url: 'https://doi.org/10.1515/pac-2016-0501',
    citation: 'Öhrström, L.; Reedijk, J. Pure Appl. Chem. 88, 1225–1229 (2016).',
    usedFor: `Nomes oficiais: ${names([113, 115, 117, 118])}.`,
  },
  {
    id: 'iupac-2016-news',
    title: 'IUPAC Announces the Names of the Elements 113, 115, 117, and 118',
    publisher: 'IUPAC (30 de novembro de 2016)',
    url: 'https://iupac.org/iupac-announces-the-names-of-the-elements-113-115-117-and-118/',
    usedFor: 'Data da aprovação dos nomes (28 de novembro de 2016) e conclusão do 7º período.',
  },
  {
    id: 'iypt2019',
    title: 'International Year of the Periodic Table of Chemical Elements (IYPT2019)',
    publisher: 'IYPT2019 — proclamado pela Assembleia Geral da ONU e pela UNESCO',
    url: 'https://iypt2019.org/',
    usedFor: 'Ano Internacional da Tabela Periódica (150 anos da tabela de Mendeleev).',
  },
];

const SOURCE_URL = Object.fromEntries(HISTORY_SOURCES.filter((s) => s.url).map((s) => [s.id, s.url as string]));

// ---------------------------------------------------------------------------
// Linha do tempo
// ---------------------------------------------------------------------------

export interface HistoryEvent {
  year: number;
  /** Rótulo exibido quando o evento abrange mais de um ano (ex.: "1894–1898"). */
  yearLabel?: string;
  title: string;
  text: string;
  people?: string[];
  related?: number[];
  sourceUrl?: string;
  /** Destaque opcional na tabela (grupo, período, categoria...). */
  focus?: TableFocus;
}

const TRIADS = [
  [3, 11, 19],
  [20, 38, 56],
  [17, 35, 53],
  [16, 34, 52],
];

export const HISTORY_EVENTS: HistoryEvent[] = [
  {
    year: 1789,
    title: 'Lavoisier lista as "substâncias simples"',
    text: 'No Tratado Elementar de Química, Antoine Lavoisier definiu elemento como uma substância que não pode ser decomposta em outras mais simples e listou 33 "substâncias simples", entre elas oxigênio, hidrogênio, nitrogênio, enxofre, fósforo, mercúrio e zinco. A lista também incluía a luz e o calórico (que não são substâncias) e algumas "terras", como a cal, que depois se revelaram compostos.',
    people: ['Antoine Lavoisier', 'Marie-Anne Paulze Lavoisier'],
    related: [8, 1, 7, 16],
    sourceUrl: SOURCE_URL['shi-lavoisier'],
  },
  {
    year: 1808,
    title: 'Dalton publica massas atômicas relativas',
    text: 'Em Um Novo Sistema de Filosofia Química, John Dalton propôs que cada elemento é formado por átomos de massa característica e publicou uma tabela de massas atômicas relativas, tomando o hidrogênio como 1. Vários valores estavam errados porque ele supunha fórmulas simples demais (para Dalton, a água era HO), mas a ideia de comparar os elementos pela massa dos átomos foi essencial para as classificações seguintes.',
    people: ['John Dalton'],
    related: [1, 8],
    sourceUrl: SOURCE_URL['shi-dalton'],
  },
  {
    year: 1829,
    title: 'As tríades de Döbereiner',
    text: `Johann Döbereiner reuniu elementos semelhantes em grupos de três, as tríades: ${TRIADS.map(names).join('; ')}. Em cada tríade, a massa atômica do elemento do meio fica perto da média dos outros dois. Com os valores atuais, a média de lítio e potássio é ${average(3, 19)}, e a massa do sódio é ${mass(11)}.`,
    people: ['Johann Wolfgang Döbereiner'],
    related: [3, 11, 19, 17, 35, 53],
    sourceUrl: SOURCE_URL['dobereiner-1829'],
  },
  {
    year: 1860,
    title: 'Congresso de Karlsruhe',
    text: 'No primeiro congresso internacional de química, em Karlsruhe (Alemanha), Stanislao Cannizzaro defendeu o uso da hipótese de Avogadro para obter massas atômicas coerentes. Com valores confiáveis, ficou possível comparar os elementos de forma sistemática. Entre os participantes estavam os jovens Dmitri Mendeleev e Lothar Meyer.',
    people: ['Stanislao Cannizzaro'],
  },
  {
    year: 1862,
    title: 'O "parafuso telúrico" de Chancourtois',
    text: 'O geólogo francês Béguyer de Chancourtois dispôs os elementos, em ordem de massa atômica, numa espiral traçada em torno de um cilindro, o "parafuso telúrico" (o telúrio ficava perto do centro). Elementos parecidos ficavam alinhados na vertical. Como o artigo original saiu sem o diagrama e usava termos da geologia, a ideia passou quase despercebida.',
    people: ['Alexandre-Émile Béguyer de Chancourtois'],
    related: [52],
  },
  {
    year: 1864,
    title: 'Lothar Meyer agrupa elementos pela valência',
    text: 'No livro As Teorias Modernas da Química, o alemão Lothar Meyer apresentou uma tabela com 28 elementos organizados em famílias segundo a valência (a capacidade de combinação), uma das primeiras classificações desse tipo.',
    people: ['Julius Lothar Meyer'],
  },
  {
    year: 1865,
    yearLabel: '1864–1865',
    title: 'A "lei das oitavas" de Newlands',
    text: 'O químico inglês John Newlands ordenou os elementos pela massa atômica e percebeu que propriedades parecidas se repetiam a cada oito elementos, como as notas de uma escala musical. A comparação foi ridicularizada na Sociedade Química de Londres, e a tabela não deixava espaços para elementos desconhecidos. Em 1887, a Royal Society reconheceu o trabalho com a Medalha Davy.',
    people: ['John Newlands'],
  },
  {
    year: 1869,
    title: 'Mendeleev apresenta sua tabela periódica',
    text: `Em março de 1869, a tabela de Dmitri Mendeleev foi apresentada à Sociedade Russa de Química, em texto lido pelo colega Nikolai Menshutkin. Os elementos estavam em ordem de massa atômica, com os semelhantes alinhados. Havia lacunas para elementos ainda desconhecidos, cujas propriedades Mendeleev previu, e inversões ditadas pela química, como o ${name(52)} antes do ${name(53)}.`,
    people: ['Dmitri Mendeleev', 'Nikolai Menshutkin'],
    related: [31, 21, 32, 52, 53],
  },
  {
    year: 1870,
    title: 'A curva dos volumes atômicos de Meyer',
    text: 'Lothar Meyer publicou uma tabela periódica com 55 elementos (em artigo datado de dezembro de 1869, impresso em 1870) e um gráfico do volume atômico em função da massa atômica: a curva sobe e desce periodicamente, com os metais alcalinos nos picos. Pelo trabalho, em grande parte independente, Meyer dividiu com Mendeleev a Medalha Davy de 1882.',
    people: ['Julius Lothar Meyer'],
    related: [3, 11, 19, 37, 55],
    focus: { kind: 'category', category: 'alkali-metal' },
  },
  {
    year: 1875,
    title: 'Descoberto o gálio, o eka-alumínio',
    text: 'O francês Paul-Émile Lecoq de Boisbaudran identificou um novo elemento pelo espectro (duas linhas violeta) de um minério de zinco e o chamou de gálio. Suas propriedades correspondiam às do eka-alumínio previsto por Mendeleev: foi a primeira grande confirmação da tabela periódica.',
    people: ['Paul-Émile Lecoq de Boisbaudran'],
    related: [31],
    sourceUrl: SOURCE_URL['weeks-1932'],
  },
  {
    year: 1879,
    title: 'Descoberto o escândio, o eka-boro',
    text: 'O sueco Lars Fredrik Nilson encontrou um novo elemento nos minerais euxenita e gadolinita e o chamou de escândio, em homenagem à Escandinávia. Seu compatriota Per Teodor Cleve percebeu que ele correspondia ao eka-boro de Mendeleev.',
    people: ['Lars Fredrik Nilson', 'Per Teodor Cleve'],
    related: [21],
    sourceUrl: SOURCE_URL['weeks-1932'],
  },
  {
    year: 1886,
    title: 'Descoberto o germânio, o eka-silício',
    text: 'O alemão Clemens Winkler isolou um novo elemento do mineral argirodita e o chamou de germânio, em homenagem à Alemanha. A massa atômica, a densidade e as propriedades do óxido e do cloreto coincidiram de forma impressionante com as do eka-silício, previsto 15 anos antes.',
    people: ['Clemens Winkler'],
    related: [32],
    sourceUrl: SOURCE_URL['weeks-1932'],
  },
  {
    year: 1894,
    yearLabel: '1894–1898',
    title: 'Os gases nobres ganham um grupo próprio',
    text: `Lord Rayleigh e William Ramsay descobriram o ${name(18)} no ar em 1894. Ramsay identificou o ${name(2)} na Terra em 1895 (ele já havia sido observado no espectro do Sol em 1868) e, com Morris Travers, o ${name(10)}, o ${name(36)} e o ${name(54)} em 1898. Esses gases quase não reagiam e não cabiam em nenhum grupo conhecido: a tabela ganhou uma nova coluna, hoje o grupo 18. Mendeleev não os havia previsto.`,
    people: ['Lord Rayleigh', 'William Ramsay', 'Morris Travers'],
    related: [18, 2, 10, 36, 54],
    sourceUrl: SOURCE_URL['ramsay-1904'],
    focus: { kind: 'group', group: 18 },
  },
  {
    year: 1913,
    yearLabel: '1913–1914',
    title: 'Moseley e o número atômico',
    text: 'Medindo os raios X emitidos por diferentes elementos, Henry Moseley descobriu que a frequência das linhas características cresce de forma regular com um número inteiro que aumenta de 1 em 1 de um elemento para o seguinte: o número atômico, igual à carga do núcleo. Isso confirmou a hipótese de Antonius van den Broek, explicou as inversões de Mendeleev e mostrou exatamente quais elementos ainda faltavam (Z = 43, 61, 72 e 75).',
    people: ['Henry Moseley', 'Antonius van den Broek'],
    related: [43, 61, 72, 75],
    sourceUrl: SOURCE_URL['moseley-1913'],
  },
  {
    year: 1922,
    yearLabel: 'Anos 1920',
    title: 'A física quântica explica a periodicidade',
    text: `Niels Bohr explicou a tabela pela distribuição dos elétrons em camadas: elementos do mesmo grupo têm arranjos parecidos na camada mais externa. Ele previu que o elemento 72 seria semelhante ao ${name(40)}, e não uma terra-rara, o que se confirmou com a descoberta do ${name(72)} por Dirk Coster e George de Hevesy em 1923. Com o princípio de exclusão de Pauli (1925) e a mecânica quântica (1926), a periodicidade ganhou sua base teórica moderna.`,
    people: ['Niels Bohr', 'Dirk Coster', 'George de Hevesy', 'Wolfgang Pauli'],
    related: [72, 40],
    sourceUrl: SOURCE_URL['bohr-1922'],
  },
  {
    year: 1944,
    yearLabel: '1944–1945',
    title: 'Seaborg e a série dos actinídeos',
    text: `Até então, ${names([90, 91, 92])} eram colocados sob ${names([72, 73, 74])}. Estudando os novos elementos transurânicos, Glenn Seaborg propôs em 1944 que os elementos a partir do actínio formam uma série parecida com a dos lantanídeos, e publicou a ideia em 1945. A proposta guiou a descoberta do amerício e do cúrio e deu à tabela o formato atual, com os actinídeos numa linha abaixo dos lantanídeos. Seaborg recebeu o Nobel de Química de 1951.`,
    people: ['Glenn T. Seaborg'],
    related: [89, 90, 92, 94, 95, 96],
    sourceUrl: SOURCE_URL['seaborg-1945'],
    focus: { kind: 'category', category: 'actinide' },
  },
  {
    year: 1988,
    title: 'Grupos numerados de 1 a 18',
    text: 'A IUPAC recomendou numerar os grupos da tabela de 1 a 18, da esquerda para a direita. A mudança acabou com a confusão entre as notações antigas com letras A e B, que eram usadas de maneiras diferentes nos Estados Unidos e na Europa.',
    sourceUrl: SOURCE_URL['fluck-1988'],
  },
  {
    year: 1997,
    title: 'Fim da "guerra dos transférmios"',
    text: `Por décadas, laboratórios dos Estados Unidos (Berkeley), da União Soviética, depois Rússia (Dubna), e da Alemanha (Darmstadt) disputaram a prioridade das descobertas dos elementos além do férmio e propuseram nomes diferentes. Após a análise de um grupo de trabalho conjunto IUPAC/IUPAP (1993), a IUPAC aprovou em 1997 os nomes definitivos dos elementos 104 a 109: ${names([104, 105, 106, 107, 108, 109])}.`,
    related: [104, 105, 106, 107, 108, 109],
    sourceUrl: SOURCE_URL['iupac-1997'],
  },
  {
    year: 2016,
    title: 'O 7º período fica completo',
    text: `Depois de reconhecer as descobertas no fim de 2015, a IUPAC aprovou em 28 de novembro de 2016 os nomes ${withSymbols([113, 115, 117, 118])} para os elementos 113, 115, 117 e 118. Eles homenageiam o Japão, a região de Moscou, o estado americano do Tennessee e o físico Yuri Oganessian. Com eles, as sete linhas da tabela ficaram completas.`,
    people: ['Yuri Oganessian'],
    related: [113, 115, 117, 118],
    sourceUrl: SOURCE_URL['iupac-2016'],
    focus: { kind: 'period', period: 7 },
  },
  {
    year: 2019,
    title: 'Ano Internacional da Tabela Periódica',
    text: 'A Assembleia Geral da ONU e a UNESCO proclamaram 2019 o Ano Internacional da Tabela Periódica dos Elementos Químicos, celebrando os 150 anos da tabela de Mendeleev.',
    sourceUrl: SOURCE_URL['iypt2019'],
  },
];

// ---------------------------------------------------------------------------
// Mendeleev: lacunas e previsões
// ---------------------------------------------------------------------------

export type PredictionKey = 'atomicWeight' | 'density' | 'meltingPoint' | 'oxide' | 'oxideDensity' | 'chloride' | 'discovery';

/** Rótulos e ordem das linhas da tabela "previsto × observado". */
export const PREDICTION_LABELS: Record<PredictionKey, string> = {
  atomicWeight: 'Massa atômica',
  density: 'Densidade',
  meltingPoint: 'Ponto de fusão',
  oxide: 'Fórmula do óxido',
  oxideDensity: 'Densidade do óxido',
  chloride: 'Cloreto',
  discovery: 'Como seria descoberto',
};

export interface MendeleevPrediction {
  /** Nome provisório dado por Mendeleev (ex.: "eka-alumínio"). */
  name: string;
  /** Número atômico do elemento que ocupou a lacuna. */
  element: number;
  discovery: { year: number; by: string; how: string };
  predicted: Partial<Record<PredictionKey, string>>;
  observed: Partial<Record<PredictionKey, string>>;
  /** Valores observados que são medidas da época (e não dados atuais). */
  historical?: PredictionKey[];
  note?: string;
}

export interface MendeleevSection {
  intro: string[];
  predictionsIntro: string;
  caveat: string;
  predictions: MendeleevPrediction[];
  /** De onde vêm os valores previstos e observados. */
  source: string;
}

const ga = getElement(31);
const ge = getElement(32);

export const MENDELEEV: MendeleevSection = {
  intro: [
    'Dmitri Ivanovich Mendeleev (1834–1907) era professor de química em São Petersburgo e escrevia um livro-texto, os Princípios de Química, quando procurou uma forma lógica de apresentar os elementos. Em 1869, organizou os cerca de 63 elementos então conhecidos em ordem crescente de massa atômica, alinhando os que tinham propriedades químicas semelhantes.',
    'A tabela foi apresentada à Sociedade Russa de Química em março de 1869; o texto foi lido pelo colega Nikolai Menshutkin, porque Mendeleev não pôde comparecer. O mais ousado foi confiar no padrão mais do que nas medidas da época: ele deixou espaços vazios para elementos desconhecidos e chegou a corrigir massas atômicas que considerava erradas, como a do berílio.',
    `Quando a ordem das massas contrariava a química, Mendeleev seguiu a química: pôs o ${name(52)} (massa atual ${mass(52)}) antes do ${name(53)} (${mass(53)}), para que o ${name(53)} ficasse na família do ${name(17)} e do ${name(35)}. Ele achava que a massa do ${name(52)} estava errada, mas não estava: a explicação só veio em 1913, com o número atômico.`,
  ],
  predictionsIntro:
    'Para três lacunas, Mendeleev descreveu em detalhe, em 1871, as propriedades esperadas, usando o prefixo sânscrito "eka-" ("um"): o eka-alumínio, por exemplo, seria o elemento logo abaixo do alumínio. Os três foram descobertos em menos de duas décadas, com propriedades muito próximas das previstas.',
  caveat:
    'Nem todas as previsões se confirmaram: Mendeleev também previu elementos que não existem (inclusive alguns mais leves que o hidrogênio) e não previu os gases nobres. Ainda assim, os acertos convenceram a comunidade científica do valor da tabela periódica.',
  predictions: [
    {
      name: 'eka-alumínio',
      element: 31,
      discovery: { year: 1875, by: 'Paul-Émile Lecoq de Boisbaudran (França)', how: 'por espectroscopia, em um minério de zinco' },
      predicted: {
        atomicWeight: '≈ 68',
        density: '5,9 g/cm³',
        meltingPoint: 'baixo',
        oxide: 'Ea₂O₃',
        discovery: 'provavelmente por espectroscopia',
      },
      observed: {
        atomicWeight: mass(31),
        density: formatDensity(ga.props.density, ga.state),
        meltingPoint: formatTemperature(ga.props.meltingPoint),
        oxide: 'Ga₂O₃',
        discovery: 'por espectroscopia (duas linhas violeta)',
      },
      note: 'Lecoq de Boisbaudran mediu de início uma densidade de 4,7 g/cm³, o único valor que não batia com a previsão. Mendeleev escreveu sugerindo que ele medisse de novo; com o metal mais puro, o resultado ficou em torno de 5,9 g/cm³, como previsto.',
    },
    {
      name: 'eka-boro',
      element: 21,
      discovery: { year: 1879, by: 'Lars Fredrik Nilson (Suécia)', how: 'nos minerais euxenita e gadolinita' },
      predicted: {
        atomicWeight: '44',
        oxide: 'Eb₂O₃',
      },
      observed: {
        atomicWeight: mass(21),
        oxide: 'Sc₂O₃',
      },
      note: 'Foi Per Teodor Cleve quem reconheceu que o novo elemento era o eka-boro e avisou Mendeleev.',
    },
    {
      name: 'eka-silício',
      element: 32,
      discovery: { year: 1886, by: 'Clemens Winkler (Alemanha)', how: 'no mineral argirodita' },
      predicted: {
        atomicWeight: '72',
        density: '5,5 g/cm³',
        meltingPoint: 'alto',
        oxide: 'EsO₂',
        oxideDensity: '4,7 g/cm³',
        chloride: 'EsCl₄, ferve abaixo de 100 °C',
      },
      observed: {
        atomicWeight: mass(32),
        density: formatDensity(ge.props.density, ge.state),
        meltingPoint: formatTemperature(ge.props.meltingPoint),
        oxide: 'GeO₂',
        oxideDensity: '≈ 4,7 g/cm³',
        chloride: 'GeCl₄, ferve a cerca de 86 °C',
      },
      historical: ['oxideDensity'],
      note: 'Foi a confirmação mais marcante: o germânio difere bastante dos vizinhos, e mesmo propriedades de compostos (óxido e cloreto) bateram com a previsão.',
    },
  ],
  source:
    'Previsões publicadas por Mendeleev em 1871 (Journal of the Russian Chemical Society, v. 3), conforme resumidas em livros de referência, como Greenwood & Earnshaw, Chemistry of the Elements. Massas atômicas, densidades e pontos de fusão observados são os dados atuais desta tabela (CIAAW 2024 e PubChem); valores marcados com * são medidas da época da descoberta (Winkler, 1886).',
};

// ---------------------------------------------------------------------------
// Moseley: inversões resolvidas pelo número atômico
// ---------------------------------------------------------------------------

/**
 * Pares de elementos vizinhos em que o de maior número atômico tem massa
 * menor (calculado a partir dos pesos atômicos padrão atuais).
 */
export const MASS_INVERSIONS = ELEMENTS.filter((el) => {
  const next = ELEMENTS.find((n) => n.z === el.z + 1);
  return next && !el.massIsMassNumber && !next.massIsMassNumber && el.atomicMass > next.atomicMass;
}).map((el) => [el.z, el.z + 1] as const);

/** Elementos que Moseley mostrou estarem faltando, com o ano em que foram descobertos. */
export const MOSELEY_GAPS = [43, 61, 72, 75].map((z) => ({ z, year: getElement(z).discovery.year }));
