import type { ChemicalElement } from '../data/types';
import { CATEGORY_BY_ID } from '../data/categories';
import { formatDensity, formatMass, formatNumber, formatTemperature } from './format';
import { orderedConfiguration } from '../data/elements/shells';

export interface CompareRow {
  key: string;
  label: string;
  values: string[];
  /** Valores numéricos, para destacar maior/menor e desenhar barras. */
  numeric?: Array<number | null>;
  unit?: string;
}

export const MAX_COMPARE = 4;
export const MIN_COMPARE = 2;

export function compareRows(elements: ChemicalElement[]): CompareRow[] {
  const num = (f: (e: ChemicalElement) => number | null) => elements.map(f);
  return [
    { key: 'z', label: 'Número atômico', values: elements.map((e) => String(e.z)), numeric: num((e) => e.z) },
    { key: 'mass', label: 'Massa atômica (u)', values: elements.map((e) => formatMass(e.atomicMassDisplay)), numeric: num((e) => e.atomicMass) },
    { key: 'group', label: 'Grupo', values: elements.map((e) => (e.group ? String(e.group) : `— (bloco f)`)) },
    { key: 'period', label: 'Período', values: elements.map((e) => String(e.period)) },
    { key: 'category', label: 'Categoria', values: elements.map((e) => CATEGORY_BY_ID[e.category].label) },
    { key: 'density', label: 'Densidade', values: elements.map((e) => formatDensity(e.props.density, e.state)), numeric: num((e) => e.props.density) },
    { key: 'melting', label: 'Ponto de fusão', values: elements.map((e) => formatTemperature(e.props.meltingPoint)), numeric: num((e) => e.props.meltingPoint) },
    { key: 'boiling', label: 'Ponto de ebulição', values: elements.map((e) => formatTemperature(e.props.boilingPoint)), numeric: num((e) => e.props.boilingPoint) },
    { key: 'en', label: 'Eletronegatividade (Pauling)', values: elements.map((e) => formatNumber(e.props.electronegativity)), numeric: num((e) => e.props.electronegativity) },
    {
      key: 'radius',
      label: 'Raio atômico (covalente)',
      values: elements.map((e) => (e.props.radii.covalent ? `${e.props.radii.covalent} pm` : 'não disponível')),
      numeric: num((e) => e.props.radii.covalent),
    },
    {
      key: 'ie',
      label: '1ª energia de ionização',
      values: elements.map((e) => (e.props.ionizationEnergy ? `${formatNumber(e.props.ionizationEnergy, 3)} eV` : 'não disponível')),
      numeric: num((e) => e.props.ionizationEnergy),
    },
    {
      key: 'config',
      label: 'Configuração eletrônica',
      values: elements.map((e) => (e.props.electronConfiguration ? orderedConfiguration(e.props.electronConfiguration) : 'não disponível')),
    },
  ];
}

/** Índices do maior e do menor valor numérico de uma linha (ignorando nulos). */
export function extremes(values: Array<number | null>): { max: number; min: number } | null {
  const valid = values.map((v, i) => [v, i] as const).filter(([v]) => v !== null) as Array<readonly [number, number]>;
  if (valid.length < 2) return null;
  const max = valid.reduce((a, b) => (b[0] > a[0] ? b : a))[1];
  const min = valid.reduce((a, b) => (b[0] < a[0] ? b : a))[1];
  return max === min ? null : { max, min };
}
