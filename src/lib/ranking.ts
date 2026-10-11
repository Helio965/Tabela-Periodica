import type { ChemicalElement } from '../data/types';
import { ELEMENTS } from '../data/elements';

export type RankingKind = 'lightest' | 'heaviest';
export type RankingSize = 5 | 10 | 20;

/**
 * Ordena pela massa atômica. Para elementos sem isótopos estáveis, a "massa"
 * é o número de massa do isótopo de vida mais longa (padrão CIAAW/NUBASE2020),
 * indicado entre colchetes.
 */
export function rankByMass(kind: RankingKind, size: number, elements: ChemicalElement[] = ELEMENTS): ChemicalElement[] {
  const sorted = [...elements].sort((a, b) => a.atomicMass - b.atomicMass || a.z - b.z);
  if (kind === 'heaviest') sorted.reverse();
  return sorted.slice(0, size);
}
