import type { ChemicalElement } from '../data/types';
import { ELEMENTS } from '../data/elements';

export const TIMELINE_START = 1600;
export const TIMELINE_END = 2026;

export interface Era {
  id: string;
  label: string;
  from: number;
  to: number;
}

export const ERAS: Era[] = [
  { id: 'antiguidade', label: 'Antiguidade e Idade Média', from: -Infinity, to: 1599 },
  { id: 'sec17', label: 'Século XVII', from: 1600, to: 1699 },
  { id: 'sec18', label: 'Século XVIII', from: 1700, to: 1799 },
  { id: 'sec19', label: 'Século XIX', from: 1800, to: 1899 },
  { id: 'sec20', label: 'Século XX', from: 1900, to: 1999 },
  { id: 'sec21', label: 'Século XXI', from: 2000, to: Infinity },
];

/** Ano usado para ordenar (Antiguidade = -∞). */
export function discoveryYear(el: ChemicalElement): number {
  return el.discovery.year ?? Number.NEGATIVE_INFINITY;
}

export function eraOf(el: ChemicalElement): Era {
  const y = discoveryYear(el);
  return ERAS.find((e) => y >= e.from && y <= e.to)!;
}

/** Elementos já conhecidos (identificados) até o ano informado, inclusive. */
export function knownBy(year: number, elements: ChemicalElement[] = ELEMENTS): ChemicalElement[] {
  return elements.filter((el) => discoveryYear(el) <= year);
}

/** Descobertas em ordem cronológica (empates por número atômico). */
export function chronological(elements: ChemicalElement[] = ELEMENTS): ChemicalElement[] {
  return [...elements].sort((a, b) => discoveryYear(a) - discoveryYear(b) || a.z - b.z);
}

/** Anos (distintos) em que houve descoberta, a partir de TIMELINE_START. */
export function discoveryYears(elements: ChemicalElement[] = ELEMENTS): number[] {
  return [...new Set(elements.map((e) => e.discovery.year).filter((y): y is number => y !== null && y >= TIMELINE_START))].sort((a, b) => a - b);
}

export type GroupBy = 'ano' | 'descobridor' | 'pais' | 'periodo' | 'metodo';

export const METHOD_LABELS: Record<ChemicalElement['discovery']['method'], string> = {
  ancient: 'Conhecido desde a Antiguidade',
  'chemical-analysis': 'Análise química de minerais',
  electrolysis: 'Eletrólise',
  'gas-chemistry': 'Estudo de gases e destilação do ar',
  spectroscopy: 'Espectroscopia (luz)',
  'xray-spectroscopy': 'Espectroscopia de raios X',
  radiochemistry: 'Radioquímica',
  'nuclear-reaction': 'Reação nuclear (reator ou cíclotron)',
  'thermonuclear-debris': 'Detritos de explosão termonuclear',
  'heavy-ion-fusion': 'Fusão de íons pesados em acelerador',
};

export interface Group {
  key: string;
  label: string;
  elements: ChemicalElement[];
}

export function groupDiscoveries(by: GroupBy, elements: ChemicalElement[] = ELEMENTS): Group[] {
  const map = new Map<string, Group>();
  const add = (key: string, label: string, el: ChemicalElement) => {
    if (!map.has(key)) map.set(key, { key, label, elements: [] });
    map.get(key)!.elements.push(el);
  };
  for (const el of chronological(elements)) {
    switch (by) {
      case 'ano':
        add(String(el.discovery.year ?? 'antiguidade'), el.discovery.yearLabel ?? String(el.discovery.year), el);
        break;
      case 'descobridor':
        for (const d of el.discovery.discoverers) add(d, d, el);
        break;
      case 'pais':
        if (el.discovery.countries.length === 0) add('—', 'Antiguidade (sem país definido)', el);
        for (const c of el.discovery.countries) add(c, c, el);
        break;
      case 'periodo': {
        const era = eraOf(el);
        add(era.id, era.label, el);
        break;
      }
      case 'metodo':
        add(el.discovery.method, METHOD_LABELS[el.discovery.method], el);
        break;
    }
  }
  const groups = [...map.values()];
  if (by === 'descobridor' || by === 'pais') groups.sort((a, b) => b.elements.length - a.elements.length || a.label.localeCompare(b.label, 'pt'));
  return groups;
}
