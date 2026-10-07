import propertiesJson from '../generated/properties.json';
import isotopesJson from '../generated/isotopes.json';
import type { ChemicalElement, ElementContent, GeneratedProperties, Isotope, StateOfMatter } from '../types';
import { slugify } from '../../lib/text';
import { META } from './meta';
import { positionOf } from './position';
import { shellsFromConfiguration } from './shells';

const PROPERTIES = propertiesJson as GeneratedProperties[];
const ISOTOPES = isotopesJson as Record<string, Isotope[]>;

/**
 * Elementos nunca obtidos em quantidade visível: estado físico e propriedades
 * macroscópicas (fusão, ebulição, densidade) são apenas estimativas teóricas.
 */
export const ONLY_PREDICTED_BULK = new Set([85, 87, ...Array.from({ length: 19 }, (_, i) => 100 + i)]);

/** Temperatura e pressão de referência da classificação por estado físico. */
export const STATE_REFERENCE = { kelvin: 298.15, celsius: 25, pressure: '1 atm (101,325 kPa)' };

/** Meia-vida acima da qual a radioatividade é considerada desprezível na prática (anos). */
const VERY_WEAK_HALF_LIFE_YEARS = 1e18;
const SECONDS_PER_YEAR = 31556926;

function buildElement(z: number): ChemicalElement {
  const meta = META.find((m) => m.z === z);
  const props = PROPERTIES.find((p) => p.atomicNumber === z);
  if (!meta || !props) throw new Error(`Dados incompletos para Z=${z}`);
  const isotopes = ISOTOPES[String(z)] ?? [];
  const pos = positionOf(z);

  let radioactivity: ChemicalElement['radioactivity'] = 'stable';
  if (props.stableIsotopeCount === 0) {
    const longest = Math.max(0, ...isotopes.filter((i) => i.halfLife).map((i) => i.halfLife!.seconds));
    radioactivity = longest / SECONDS_PER_YEAR > VERY_WEAK_HALF_LIFE_YEARS ? 'very-weak' : 'radioactive';
  }

  const predicted = ONLY_PREDICTED_BULK.has(z);
  const state: StateOfMatter = predicted ? 'unknown' : props.standardState;

  return {
    ...meta,
    symbol: props.symbol,
    nameEn: props.nameEn,
    slug: slugify(meta.name),
    atomicMass: props.atomicWeight.value,
    atomicMassDisplay: props.atomicWeight.display,
    massIsMassNumber: props.atomicWeight.kind === 'mass-number',
    group: pos.group,
    period: pos.period,
    block: pos.block,
    gridColumn: pos.gridColumn,
    gridRow: pos.gridRow,
    state,
    statePredicted: predicted || props.standardStatePredicted,
    radioactivity,
    radioactive: radioactivity !== 'stable',
    natural: meta.occurrence !== 'synthetic',
    shells: props.electronConfiguration ? shellsFromConfiguration(props.electronConfiguration) : [],
    props,
    isotopes,
  };
}

export const ELEMENTS: ChemicalElement[] = Array.from({ length: 118 }, (_, i) => buildElement(i + 1));

export const ELEMENT_BY_Z = new Map(ELEMENTS.map((e) => [e.z, e]));
export const ELEMENT_BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.symbol.toLowerCase(), e]));
export const ELEMENT_BY_SLUG = new Map(ELEMENTS.map((e) => [e.slug, e]));

export function getElement(z: number): ChemicalElement {
  const el = ELEMENT_BY_Z.get(z);
  if (!el) throw new RangeError(`Elemento ${z} não existe`);
  return el;
}

/** Previsão de estado físico fornecida pelo PubChem para elementos não medidos. */
export function predictedStateOf(el: ChemicalElement): StateOfMatter {
  return el.props.standardState;
}

let contentCache: Map<number, ElementContent> | null = null;

/** Carrega (sob demanda) os textos longos de todos os elementos. */
export async function loadAllContent(): Promise<Map<number, ElementContent>> {
  if (!contentCache) {
    const { ALL_CONTENT } = await import('./content');
    contentCache = new Map(ALL_CONTENT.map((c) => [c.z, c]));
  }
  return contentCache;
}

export async function loadContent(z: number): Promise<ElementContent | undefined> {
  return (await loadAllContent()).get(z);
}
