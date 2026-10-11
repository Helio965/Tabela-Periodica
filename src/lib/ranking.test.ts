import { describe, expect, it } from 'vitest';
import { ELEMENTS } from '../data/elements';
import { rankByMass, type RankingSize } from './ranking';

const symbols = (list: { symbol: string }[]) => list.map((e) => e.symbol);

describe('rankByMass', () => {
  it('os 5 mais leves: H, He, Li, Be, B', () => {
    expect(symbols(rankByMass('lightest', 5))).toEqual(['H', 'He', 'Li', 'Be', 'B']);
  });

  it('o mais pesado é o oganessônio (número de massa do isótopo mais longevo)', () => {
    const [heaviest] = rankByMass('heaviest', 1);
    expect(heaviest.symbol).toBe('Og');
    expect(heaviest.massIsMassNumber).toBe(true);
    expect(heaviest.atomicMass).toBeGreaterThanOrEqual(293);
  });

  it('empates de massa são desfeitos pelo número atômico (Og antes de Ts entre os mais pesados)', () => {
    const top = rankByMass('heaviest', 3);
    // Ts e Og compartilham o mesmo número de massa de referência nos dados atuais.
    expect(top[0].atomicMass).toBeGreaterThanOrEqual(top[1].atomicMass);
    if (top[0].atomicMass === top[1].atomicMass) expect(top[0].z).toBeGreaterThan(top[1].z);
  });

  it.each([5, 10, 20] satisfies RankingSize[])('respeita o tamanho %i', (size) => {
    expect(rankByMass('lightest', size)).toHaveLength(size);
    expect(rankByMass('heaviest', size)).toHaveLength(size);
  });

  it('a lista é ordenada pela massa', () => {
    const light = rankByMass('lightest', 20);
    for (let i = 1; i < light.length; i++) expect(light[i].atomicMass).toBeGreaterThanOrEqual(light[i - 1].atomicMass);
    const heavy = rankByMass('heaviest', 20);
    for (let i = 1; i < heavy.length; i++) expect(heavy[i].atomicMass).toBeLessThanOrEqual(heavy[i - 1].atomicMass);
  });

  it('respeita as inversões de massa da tabela (argônio é mais pesado que potássio)', () => {
    const order = symbols(rankByMass('lightest', 20));
    expect(order.indexOf('K')).toBeLessThan(order.indexOf('Ar'));
  });

  it('não altera a lista original e aceita uma lista personalizada', () => {
    const before = ELEMENTS.map((e) => e.z);
    rankByMass('heaviest', 10);
    expect(ELEMENTS.map((e) => e.z)).toEqual(before);
    const subset = ELEMENTS.filter((e) => ['Fe', 'H', 'U'].includes(e.symbol));
    expect(symbols(rankByMass('heaviest', 5, subset))).toEqual(['U', 'Fe', 'H']);
  });
});
