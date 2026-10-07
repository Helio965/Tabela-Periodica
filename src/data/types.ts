/**
 * Tipos centrais dos dados científicos.
 *
 * Os dados ficam separados em três camadas:
 *  1. `generated/*.json` — valores numéricos extraídos automaticamente de
 *     fontes primárias (CIAAW, NUBASE2020, NIST, PubChem/LANL/Jefferson Lab).
 *  2. `elements/meta/*`   — curadoria em português (nome, categoria,
 *     ocorrência e resumo da descoberta). Carregado junto com a tabela.
 *  3. `elements/content/*` — textos educativos longos, carregados sob demanda
 *     quando a ficha de um elemento é aberta.
 */

export type CategoryId =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

/** Como o elemento ocorre (ou não) na natureza. */
export type Occurrence =
  /** Presente desde a formação da Terra (estável ou de vida muito longa). */
  | 'primordial'
  /** Existe naturalmente apenas por ser produzido continuamente em cadeias de decaimento. */
  | 'decay-chain'
  /** Existe na natureza só em traços ínfimos (fissão espontânea, captura de nêutrons). */
  | 'trace'
  /** Conhecido apenas por síntese em laboratório. */
  | 'synthetic';

export type DiscoveryMethod =
  | 'ancient'
  | 'chemical-analysis'
  | 'electrolysis'
  | 'gas-chemistry'
  | 'spectroscopy'
  | 'xray-spectroscopy'
  | 'radiochemistry'
  | 'nuclear-reaction'
  | 'thermonuclear-debris'
  | 'heavy-ion-fusion';

export type StateOfMatter = 'solid' | 'liquid' | 'gas' | 'unknown';
export type Block = 's' | 'p' | 'd' | 'f';

export type UseArea =
  | 'medicina'
  | 'eletronica'
  | 'industria'
  | 'energia'
  | 'construcao'
  | 'agricultura'
  | 'ciencia'
  | 'tecnologia'
  | 'aeroespacial'
  | 'alimentos'
  | 'iluminacao'
  | 'joias'
  | 'transporte'
  | 'ambiente'
  | 'defesa';

export type HazardFlag =
  | 'toxico'
  | 'radioativo'
  | 'reativo'
  | 'inflamavel'
  | 'oxidante'
  | 'corrosivo'
  | 'ambiental'
  | 'asfixiante'
  | 'baixo-risco';

export type HazardLevel = 'baixo' | 'moderado' | 'alto' | 'muito-alto';

export interface DiscoveryMeta {
  /** Ano da identificação como novo elemento; `null` = conhecido desde a Antiguidade. */
  year: number | null;
  /** Rótulo alternativo para o ano (ex.: "Antiguidade", "c. 1250"). */
  yearLabel?: string;
  discoverers: string[];
  /** Países (nomes atuais) onde a descoberta ocorreu. */
  countries: string[];
  /** Cidade e/ou instituição, quando conhecida. */
  place?: string;
  method: DiscoveryMethod;
  /** Presente quando há disputa de atribuição; explica a controvérsia. */
  disputed?: string;
  /** Quando o elemento foi obtido puro pela primeira vez (se diferente da descoberta). */
  isolated?: { year: number; by: string[] };
}

export interface ElementMeta {
  z: number;
  /** Nome oficial em português (SBQ/IUPAC). */
  name: string;
  /** Grafias alternativas usadas no Brasil/Portugal (aceitas na busca). */
  aliases?: string[];
  /** Nome latino/estrangeiro que explica o símbolo, quando diferente do nome em português. */
  symbolSourceName?: string;
  category: CategoryId;
  /** Categoria prevista teoricamente (propriedades químicas ainda não medidas). */
  categoryPredicted?: boolean;
  occurrence: Occurrence;
  /** Obtido artificialmente antes de ser detectado na natureza. */
  firstSynthesized?: boolean;
  discovery: DiscoveryMeta;
  /** Curiosidade curta usada no "Elemento em destaque". */
  highlight: string;
}

export interface UseItem {
  area: UseArea;
  text: string;
}

export interface ElementContent {
  z: number;
  /** "Como foi descoberto?" — parágrafos em linguagem acessível. */
  discoveryStory: string[];
  nameOrigin: string;
  symbolOrigin: string;
  nature: {
    text: string;
    minerals?: string[];
    /** Onde é encontrado. */
    where: Array<'crosta' | 'atmosfera' | 'oceanos' | 'organismos' | 'estrelas' | 'minerais' | 'apenas-laboratorio'>;
  };
  uses: UseItem[];
  hazards: {
    level: HazardLevel;
    flags: HazardFlag[];
    text: string;
  };
  curiosities: string[];
  /** Fontes extras específicas do elemento (ids do registro de fontes). */
  extraSources?: string[];
}

// ---------------------------------------------------------------------------
// Dados gerados automaticamente (ver scripts/build-data.mjs)
// ---------------------------------------------------------------------------

export interface HalfLife {
  value: number;
  unit: string;
  seconds: number;
  approximate: boolean;
}

export interface GeneratedProperties {
  atomicNumber: number;
  symbol: string;
  nameEn: string;
  atomicWeight: {
    kind: 'standard' | 'mass-number';
    value: number;
    display: string;
    uncertainty: string | null;
    standard: string | null;
    source: string;
    referenceIsotope?: { massNumber: number; halfLifeText: string; halfLife: HalfLife | null };
    alternatives?: Array<{ massNumber: number; halfLifeText: string; halfLife: HalfLife | null }>;
  };
  electronConfiguration: string | null;
  electronConfigurationPredicted: boolean;
  electronegativity: number | null;
  radii: { covalent: number | null; empirical: number | null; vanDerWaals: number | null };
  ionizationEnergy: number | null;
  electronAffinity: number | null;
  oxidationStates: string[];
  standardState: StateOfMatter;
  standardStatePredicted: boolean;
  meltingPoint: number | null;
  boilingPoint: number | null;
  density: number | null;
  crustalAbundance: number | null;
  oceanicAbundance: number | null;
  stableIsotopeCount: number;
  pubchemYearDiscovered: string | null;
  links: { ciaaw?: string; jlab?: string; lanl?: string; nist?: string; pubchem: string };
}

export interface DecayMode {
  mode: string;
  intensity: number | null;
  approx: boolean;
}

export interface Isotope {
  massNumber: number;
  isomer: boolean;
  mass: number | null;
  massEstimated: boolean;
  abundance: number | null;
  stable: boolean;
  halfLife: HalfLife | null;
  decayModes: DecayMode[];
  discoveryYear: number | null;
  reason: 'natural' | 'notable' | 'longest';
}

// ---------------------------------------------------------------------------
// Registro final, combinado, usado pela interface
// ---------------------------------------------------------------------------

export type Radioactivity = 'stable' | 'very-weak' | 'radioactive';

export interface ChemicalElement extends ElementMeta {
  symbol: string;
  nameEn: string;
  slug: string;
  atomicMass: number;
  atomicMassDisplay: string;
  massIsMassNumber: boolean;
  group: number | null;
  period: number;
  block: Block;
  /** Posição na grade da tabela (1–18 colunas, 1–10 linhas; 9 e 10 = série f). */
  gridColumn: number;
  gridRow: number;
  state: StateOfMatter;
  statePredicted: boolean;
  radioactivity: Radioactivity;
  radioactive: boolean;
  natural: boolean;
  shells: number[];
  props: GeneratedProperties;
  isotopes: Isotope[];
}
