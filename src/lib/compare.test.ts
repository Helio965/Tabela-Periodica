import { describe, expect, it } from 'vitest';
import { ELEMENT_BY_SYMBOL } from '../data/elements';
import type { ChemicalElement } from '../data/types';
import { compareRows, extremes, MAX_COMPARE, MIN_COMPARE } from './compare';

const els = (...symbols: string[]): ChemicalElement[] => symbols.map((s) => ELEMENT_BY_SYMBOL.get(s.toLowerCase())!);
const row = (elements: ChemicalElement[], key: string) => compareRows(elements).find((r) => r.key === key)!;

describe('compareRows', () => {
  it('devolve as linhas esperadas, na ordem', () => {
    expect(compareRows(els('C', 'Si')).map((r) => r.key)).toEqual([
      'z',
      'mass',
      'group',
      'period',
      'category',
      'density',
      'melting',
      'boiling',
      'en',
      'radius',
      'ie',
      'config',
    ]);
  });

  it('cada linha tem um valor por elemento, e as numéricas têm o mesmo tamanho', () => {
    const list = els('C', 'Si', 'Ge', 'Og');
    for (const r of compareRows(list)) {
      expect(r.label.length).toBeGreaterThan(0);
      expect(r.values).toHaveLength(list.length);
      if (r.numeric) expect(r.numeric).toHaveLength(list.length);
    }
  });

  it('formata os valores em pt-BR', () => {
    const list = els('C', 'Si', 'Ge');
    expect(row(list, 'z').values).toEqual(['6', '14', '32']);
    expect(row(list, 'mass').values).toEqual(['12,011', '28,085', '72,630']);
    expect(row(list, 'group').values).toEqual(['14', '14', '14']);
    expect(row(list, 'period').values).toEqual(['2', '3', '4']);
    expect(row(list, 'category').values).toEqual(['Não metais', 'Semimetais', 'Semimetais']);
    expect(row(list, 'en').values).toEqual(['2,55', '1,9', '2,01']);
    expect(row(list, 'en').numeric).toEqual([2.55, 1.9, 2.01]);
  });

  it('mostra "não disponível" e usa null quando falta o dado', () => {
    const list = els('He', 'Og');
    // O hélio não tem eletronegatividade de Pauling definida.
    expect(row(list, 'en').values[0]).toBe('não disponível');
    expect(row(list, 'en').numeric?.[0]).toBeNull();
    // O oganessônio nunca teve propriedades macroscópicas medidas.
    expect(row(list, 'density').values[1]).toBe('não disponível');
    expect(row(list, 'melting').values[1]).toBe('não disponível');
    expect(row(list, 'melting').numeric?.[1]).toBeNull();
  });

  it('elementos do bloco f não têm grupo', () => {
    expect(row(els('U', 'Fe'), 'group').values).toEqual(['— (bloco f)', '8']);
  });

  it('massa por número de massa aparece entre colchetes', () => {
    expect(row(els('Tc', 'Fe'), 'mass').values[0]).toBe('[97]');
  });

  it('densidade de gases em g/L e de sólidos em g/cm³', () => {
    const [n, fe] = row(els('N', 'Fe'), 'density').values;
    expect(n).toMatch(/ g\/L$/);
    expect(fe).toMatch(/ g\/cm³$/);
  });

  it('configuração eletrônica em ordem de camadas', () => {
    expect(row(els('Fe', 'C'), 'config').values).toEqual(['[Ar] 3d6 4s2', '[He] 2s2 2p2']);
  });
});

describe('extremes', () => {
  it('encontra os índices do maior e do menor valor', () => {
    expect(extremes([2.55, 1.9, 2.01])).toEqual({ max: 0, min: 1 });
    expect(extremes([1, 5, 3, 0.5])).toEqual({ max: 1, min: 3 });
  });

  it('ignora valores nulos', () => {
    expect(extremes([null, 3, null, 7])).toEqual({ max: 3, min: 1 });
    expect(extremes([4, null, 2])).toEqual({ max: 0, min: 2 });
  });

  it('devolve null com menos de dois valores', () => {
    expect(extremes([])).toBeNull();
    expect(extremes([5])).toBeNull();
    expect(extremes([null, 5, null])).toBeNull();
    expect(extremes([null, null])).toBeNull();
  });

  it('devolve null quando todos os valores são iguais (não há destaque)', () => {
    expect(extremes([14, 14, 14])).toBeNull();
  });

  it('funciona com a linha real de comparação', () => {
    const r = row(els('C', 'Si', 'Ge', 'He'), 'en');
    // He (índice 3) não tem eletronegatividade; C é o maior e Si o menor.
    expect(extremes(r.numeric!)).toEqual({ max: 0, min: 1 });
  });
});

describe('limites da comparação', () => {
  it('compara de 2 a 4 elementos', () => {
    expect(MIN_COMPARE).toBe(2);
    expect(MAX_COMPARE).toBe(4);
  });
});
