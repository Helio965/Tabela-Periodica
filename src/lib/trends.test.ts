import { describe, expect, it } from 'vitest';
import { ELEMENTS, ELEMENT_BY_SYMBOL } from '../data/elements';
import { TREND_BY_ID, TRENDS, trendScale, type TrendId } from './trends';

const z = (symbol: string) => ELEMENT_BY_SYMBOL.get(symbol.toLowerCase())!.z;
const ids = TRENDS.map((t) => t.id);

describe('TRENDS', () => {
  it('cada tendência tem rótulo, unidade e explicação', () => {
    expect(new Set(ids).size).toBe(ids.length);
    for (const t of TRENDS) {
      expect(TREND_BY_ID[t.id]).toBe(t);
      expect(t.label.length).toBeGreaterThan(0);
      expect(t.explanation.length).toBeGreaterThan(20);
    }
  });

  it('formata valores em pt-BR', () => {
    expect(TREND_BY_ID.electronegativity.format(3.98)).toBe('3,98');
    expect(TREND_BY_ID.radius.format(57)).toBe('57 pm');
    expect(TREND_BY_ID.density.format(22.57)).toBe('22,57 g/cm³');
    // Densidades de gases muito pequenas ganham mais casas decimais.
    expect(TREND_BY_ID.density.format(0.00008988)).toBe('0,00009 g/cm³');
  });
});

describe('trendScale', () => {
  it.each(ids)('%s: intensidades entre 0 e 1 (ou null), com 0 e 1 atingidos', (id: TrendId) => {
    const { intensity, min, max } = trendScale(id);
    expect(intensity.size).toBe(118);
    expect(min).toBeLessThan(max);
    const values = [...intensity.values()].filter((v): v is number => v !== null);
    expect(values.length).toBeGreaterThan(0);
    for (const v of values) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
    expect(Math.min(...values)).toBeCloseTo(0, 10);
    expect(Math.max(...values)).toBeCloseTo(1, 10);
  });

  it('null quando falta o dado', () => {
    const en = trendScale('electronegativity');
    expect(en.intensity.get(z('He'))).toBeNull();
    expect(en.intensity.get(z('Ne'))).toBeNull();
    const density = trendScale('density');
    expect(density.intensity.get(z('Og'))).toBeNull();
    // Todo elemento sem valor nos dados fica sem intensidade.
    const melting = trendScale('melting');
    for (const el of ELEMENTS) {
      if (TREND_BY_ID.melting.value(el) === null) expect(melting.intensity.get(el.z)).toBeNull();
    }
  });

  it('o flúor tem a maior eletronegatividade (intensidade 1) e o frâncio a menor', () => {
    const en = trendScale('electronegativity');
    expect(en.intensity.get(z('F'))).toBe(1);
    expect(en.max).toBe(3.98);
    expect(en.intensity.get(z('Fr'))).toBe(0);
    expect(en.min).toBe(0.7);
    // O césio fica logo acima do frâncio.
    expect(en.intensity.get(z('Cs'))!).toBeLessThan(0.05);
  });

  it('densidade usa escala logarítmica', () => {
    const { intensity, min, max } = trendScale('density');
    expect(TREND_BY_ID.density.log).toBe(true);
    const fe = ELEMENT_BY_SYMBOL.get('fe')!;
    const expected = (Math.log10(fe.props.density!) - Math.log10(min)) / (Math.log10(max) - Math.log10(min));
    expect(intensity.get(fe.z)).toBeCloseTo(expected, 10);
    // Em escala linear o ferro (7,9 g/cm³) ficaria perto de 0,35; na logarítmica fica bem acima.
    expect(intensity.get(fe.z)!).toBeGreaterThan(0.8);
    // O hidrogênio é o menos denso e o ósmio o mais denso.
    expect(intensity.get(z('H'))).toBe(0);
    expect(intensity.get(z('Os'))).toBe(1);
  });

  it('escala linear para as demais propriedades', () => {
    const { intensity, min, max } = trendScale('mass');
    const fe = ELEMENT_BY_SYMBOL.get('fe')!;
    expect(intensity.get(fe.z)).toBeCloseTo((fe.atomicMass - min) / (max - min), 10);
  });

  it('a energia de ionização é máxima no hélio e mínima no césio', () => {
    const ie = trendScale('ionization');
    expect(ie.intensity.get(z('He'))).toBe(1);
    expect(ie.intensity.get(z('Cs'))).toBe(0);
  });

  it('aceita uma lista personalizada de elementos', () => {
    const subset = ELEMENTS.filter((e) => ['Li', 'C', 'F'].includes(e.symbol));
    const en = trendScale('electronegativity', subset);
    expect(en.intensity.size).toBe(3);
    expect(en.intensity.get(z('Li'))).toBe(0);
    expect(en.intensity.get(z('F'))).toBe(1);
    expect(en.intensity.get(z('C'))).toBeCloseTo((2.55 - 0.98) / (3.98 - 0.98), 10);
  });
});
