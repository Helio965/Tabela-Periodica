import type { Block } from '../types';

export interface TablePosition {
  period: number;
  /** Grupo 1–18; `null` para lantanídeos e actinídeos (séries do bloco f). */
  group: number | null;
  block: Block;
  /** Coluna na grade (1–18). */
  gridColumn: number;
  /** Linha na grade: 1–7 para os períodos; 9 e 10 para as séries f. */
  gridRow: number;
}

const PERIOD_ENDS = [2, 10, 18, 36, 54, 86, 118];

export function periodOf(z: number): number {
  const idx = PERIOD_ENDS.findIndex((end) => z <= end);
  if (idx < 0 || z < 1) throw new RangeError(`Número atômico inválido: ${z}`);
  return idx + 1;
}

/**
 * Posição de um elemento no formato de 18 colunas usado pela IUPAC, com as
 * séries de 15 lantanídeos (57–71) e 15 actinídeos (89–103) abaixo da tabela.
 */
export function positionOf(z: number): TablePosition {
  const period = periodOf(z);
  const start = period === 1 ? 1 : PERIOD_ENDS[period - 2] + 1;
  const index = z - start; // posição dentro do período, a partir de 0

  if (period === 1) {
    const group = z === 1 ? 1 : 18;
    return { period, group, block: 's', gridColumn: group, gridRow: 1 };
  }

  if (period <= 3) {
    const group = index < 2 ? index + 1 : index + 11; // 1, 2, 13–18
    return { period, group, block: index < 2 ? 's' : 'p', gridColumn: group, gridRow: period };
  }

  if (period <= 5) {
    const group = index + 1;
    const block: Block = group <= 2 ? 's' : group <= 12 ? 'd' : 'p';
    return { period, group, block, gridColumn: group, gridRow: period };
  }

  // Períodos 6 e 7: 2 elementos s, 15 da série f, 15 restantes nos grupos 4–18.
  if (index < 2) return { period, group: index + 1, block: 's', gridColumn: index + 1, gridRow: period };
  if (index < 17) {
    return { period, group: null, block: 'f', gridColumn: index + 1, gridRow: period === 6 ? 9 : 10 };
  }
  const group = index - 13; // 17 → 4 … 31 → 18
  return { period, group, block: group <= 12 ? 'd' : 'p', gridColumn: group, gridRow: period };
}
