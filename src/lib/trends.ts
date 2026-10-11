import type { ChemicalElement } from '../data/types';
import { ELEMENTS } from '../data/elements';
import { formatNumber, formatTemperature } from './format';

export type TrendId = 'radius' | 'electronegativity' | 'ionization' | 'mass' | 'density' | 'melting' | 'boiling';

export interface TrendDef {
  id: TrendId;
  label: string;
  unit: string;
  value: (el: ChemicalElement) => number | null;
  format: (v: number) => string;
  /** Escala logarítmica para propriedades que variam em várias ordens de grandeza. */
  log?: boolean;
  explanation: string;
}

export const TRENDS: TrendDef[] = [
  {
    id: 'radius',
    label: 'Raio atômico',
    unit: 'pm',
    value: (el) => el.props.radii.covalent,
    format: (v) => `${formatNumber(v, 0)} pm`,
    explanation: 'Raio covalente (Cordero et al., via PubChem). Tende a diminuir ao longo de um período (mais prótons puxam os elétrons) e a aumentar ao descer um grupo (mais camadas eletrônicas).',
  },
  {
    id: 'electronegativity',
    label: 'Eletronegatividade',
    unit: 'Pauling',
    value: (el) => el.props.electronegativity,
    format: (v) => formatNumber(v, 2),
    explanation: 'Capacidade de um átomo atrair elétrons em uma ligação (escala de Pauling). Aumenta da esquerda para a direita e de baixo para cima; o flúor é o mais eletronegativo. Gases nobres leves não têm valor definido.',
  },
  {
    id: 'ionization',
    label: 'Energia de ionização',
    unit: 'eV',
    value: (el) => el.props.ionizationEnergy,
    format: (v) => `${formatNumber(v, 2)} eV`,
    explanation: 'Energia necessária para remover o elétron mais externo de um átomo isolado (NIST). É máxima nos gases nobres e mínima nos metais alcalinos.',
  },
  {
    id: 'mass',
    label: 'Massa atômica',
    unit: 'u',
    value: (el) => el.atomicMass,
    format: (v) => `${formatNumber(v, 2)} u`,
    explanation: 'Massa atômica média (CIAAW). Cresce, de modo geral, com o número atômico — com poucas inversões, como argônio/potássio e telúrio/iodo.',
  },
  {
    id: 'density',
    label: 'Densidade',
    unit: 'g/cm³',
    value: (el) => el.props.density,
    format: (v) => `${formatNumber(v, v < 0.01 ? 5 : 2)} g/cm³`,
    log: true,
    explanation: 'Massa por volume nas condições padrão. Varia de gases muito leves até o ósmio e o irídio (≈ 22,6 g/cm³). Escala logarítmica.',
  },
  {
    id: 'melting',
    label: 'Ponto de fusão',
    unit: 'K',
    value: (el) => el.props.meltingPoint,
    format: (v) => formatTemperature(v),
    explanation: 'Temperatura em que o sólido vira líquido. Os maiores valores estão no centro do bloco d (tungstênio) e no carbono.',
  },
  {
    id: 'boiling',
    label: 'Ponto de ebulição',
    unit: 'K',
    value: (el) => el.props.boilingPoint,
    format: (v) => formatTemperature(v),
    explanation: 'Temperatura em que o líquido vira gás, à pressão de 1 atm.',
  },
];

export const TREND_BY_ID = Object.fromEntries(TRENDS.map((t) => [t.id, t])) as Record<TrendId, TrendDef>;

export interface TrendScale {
  min: number;
  max: number;
  /** Intensidade normalizada 0–1 por número atômico (`null` = sem dado). */
  intensity: Map<number, number | null>;
}

export function trendScale(id: TrendId, elements: ChemicalElement[] = ELEMENTS): TrendScale {
  const def = TREND_BY_ID[id];
  const values = elements.map((el) => [el.z, def.value(el)] as const);
  const valid = values.map(([, v]) => v).filter((v): v is number => v !== null && v > 0);
  const tx = (v: number) => (def.log ? Math.log10(v) : v);
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const intensity = new Map<number, number | null>();
  for (const [z, v] of values) {
    intensity.set(z, v === null || v <= 0 ? null : (tx(v) - tx(min)) / (tx(max) - tx(min) || 1));
  }
  return { min, max, intensity };
}
