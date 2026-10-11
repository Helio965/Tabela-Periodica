import { describe, expect, it } from 'vitest';
import { ELEMENTS, ELEMENT_BY_SYMBOL } from '../data/elements';
import {
  chronological,
  discoveryYear,
  discoveryYears,
  eraOf,
  ERAS,
  groupDiscoveries,
  knownBy,
  METHOD_LABELS,
  TIMELINE_END,
  TIMELINE_START,
  type GroupBy,
} from './timeline';

const el = (symbol: string) => ELEMENT_BY_SYMBOL.get(symbol.toLowerCase())!;
const symbols = (list: { symbol: string }[]) => list.map((e) => e.symbol);

describe('discoveryYear', () => {
  it('elementos da Antiguidade ficam em -∞', () => {
    expect(discoveryYear(el('Fe'))).toBe(Number.NEGATIVE_INFINITY);
    expect(discoveryYear(el('Au'))).toBe(Number.NEGATIVE_INFINITY);
    expect(discoveryYear(el('Ga'))).toBe(1875);
  });
});

describe('knownBy', () => {
  it('em 1869 (tabela de Mendeleev) eram conhecidos 63 elementos', () => {
    const known = knownBy(1869);
    const expected = ELEMENTS.filter((e) => e.discovery.year === null || e.discovery.year <= 1869);
    expect(known).toEqual(expected);
    expect(known).toHaveLength(63);
  });

  it('os elementos previstos por Mendeleev ainda não eram conhecidos em 1869', () => {
    const known = symbols(knownBy(1869));
    // Eka-alumínio (Ga, 1875), eka-boro (Sc, 1879) e eka-silício (Ge, 1886).
    expect(known).not.toContain('Ga');
    expect(known).not.toContain('Sc');
    expect(known).not.toContain('Ge');
    expect(known).toEqual(expect.arrayContaining(['H', 'O', 'Fe', 'Au', 'U']));
  });

  it('o ano informado é inclusivo', () => {
    expect(symbols(knownBy(1875))).toContain('Ga');
    expect(symbols(knownBy(1874))).not.toContain('Ga');
  });

  it('o oganessônio (2002) já era conhecido em 2010, mas não em 2001', () => {
    expect(symbols(knownBy(2010))).toContain('Og');
    expect(symbols(knownBy(2001))).not.toContain('Og');
  });

  it('os 118 elementos são conhecidos no fim da linha do tempo; só os antigos antes dela', () => {
    expect(knownBy(TIMELINE_END)).toHaveLength(118);
    const ancient = knownBy(TIMELINE_START - 1);
    expect(ancient.every((e) => e.discovery.year === null || e.discovery.year < TIMELINE_START)).toBe(true);
    expect(symbols(ancient)).toContain('As'); // c. 1250
    expect(symbols(ancient)).not.toContain('P'); // 1669
  });

  it('a quantidade de elementos conhecidos nunca diminui com o tempo', () => {
    let previous = 0;
    for (let year = TIMELINE_START; year <= TIMELINE_END; year += 10) {
      const count = knownBy(year).length;
      expect(count).toBeGreaterThanOrEqual(previous);
      previous = count;
    }
  });
});

describe('chronological', () => {
  it('ordena por ano e desempata pelo número atômico', () => {
    const list = chronological();
    expect(list).toHaveLength(118);
    for (let i = 1; i < list.length; i++) {
      const a = discoveryYear(list[i - 1]);
      const b = discoveryYear(list[i]);
      expect(a <= b).toBe(true);
      if (a === b) expect(list[i - 1].z).toBeLessThan(list[i].z);
    }
  });

  it('começa pelos elementos da Antiguidade e termina com o tennesso (2010)', () => {
    const list = chronological();
    expect(list[0].symbol).toBe('C');
    expect(list[0].discovery.year).toBeNull();
    expect(list.at(-1)!.symbol).toBe('Ts');
  });

  it('não altera a lista original', () => {
    const before = ELEMENTS.map((e) => e.z);
    chronological();
    expect(ELEMENTS.map((e) => e.z)).toEqual(before);
  });
});

describe('discoveryYears', () => {
  it('anos distintos, crescentes e a partir de 1600', () => {
    const years = discoveryYears();
    expect(new Set(years).size).toBe(years.length);
    expect([...years].sort((a, b) => a - b)).toEqual(years);
    expect(years[0]).toBeGreaterThanOrEqual(TIMELINE_START);
    expect(years).toContain(1669);
    expect(years).toContain(1898);
    expect(years).not.toContain(1250);
    expect(years.at(-1)).toBe(2010);
  });
});

describe('eraOf', () => {
  it('classifica cada descoberta em sua época', () => {
    expect(eraOf(el('Fe')).id).toBe('antiguidade');
    expect(eraOf(el('As')).id).toBe('antiguidade'); // c. 1250
    expect(eraOf(el('P')).id).toBe('sec17'); // 1669
    expect(eraOf(el('O')).id).toBe('sec18'); // 1774
    expect(eraOf(el('Ga')).id).toBe('sec19'); // 1875
    expect(eraOf(el('Tc')).id).toBe('sec20'); // 1937
    expect(eraOf(el('Og')).id).toBe('sec21'); // 2002
  });

  it('limites das épocas são inclusivos e contíguos', () => {
    for (let i = 1; i < ERAS.length; i++) expect(ERAS[i].from).toBe(ERAS[i - 1].to + 1);
    expect(eraOf(el('Ne')).label).toBe('Século XIX'); // 1898
    expect(eraOf(el('Ac')).label).toBe('Século XIX'); // 1899
    expect(eraOf(el('Rn')).label).toBe('Século XX'); // 1900
  });

  it('todo elemento pertence a uma época', () => {
    for (const e of ELEMENTS) expect(eraOf(e), e.symbol).toBeDefined();
  });
});

describe('groupDiscoveries', () => {
  const total = (by: GroupBy) => groupDiscoveries(by).reduce((n, g) => n + g.elements.length, 0);

  it('por país: a Suécia aparece com muitos elementos', () => {
    const groups = groupDiscoveries('pais');
    const sweden = groups.find((g) => g.key === 'Suécia');
    expect(sweden).toBeDefined();
    expect(sweden!.label).toBe('Suécia');
    expect(sweden!.elements.length).toBeGreaterThanOrEqual(15);
    expect(symbols(sweden!.elements)).toEqual(expect.arrayContaining(['O', 'Cl', 'Mn', 'Mo', 'Ba', 'Sc', 'Tm']));
  });

  it('por país: grupos ordenados do maior para o menor, com a Antiguidade à parte', () => {
    const groups = groupDiscoveries('pais');
    for (let i = 1; i < groups.length; i++) expect(groups[i - 1].elements.length).toBeGreaterThanOrEqual(groups[i].elements.length);
    const ancient = groups.find((g) => g.key === '—');
    expect(ancient?.label).toBe('Antiguidade (sem país definido)');
    expect(ancient?.elements).toHaveLength(10);
  });

  it('por época: cada elemento aparece exatamente uma vez', () => {
    const groups = groupDiscoveries('periodo');
    expect(total('periodo')).toBe(118);
    expect(groups.map((g) => g.key)).toEqual(ERAS.map((e) => e.id));
  });

  it('por método: cada elemento aparece uma vez e com rótulo em português', () => {
    expect(total('metodo')).toBe(118);
    for (const g of groupDiscoveries('metodo')) expect(g.label).toBe(METHOD_LABELS[g.key as keyof typeof METHOD_LABELS]);
    const spectroscopy = groupDiscoveries('metodo').find((g) => g.key === 'spectroscopy')!;
    expect(symbols(spectroscopy.elements)).toEqual(expect.arrayContaining(['Cs', 'Rb', 'He']));
  });

  it('por ano: rótulos legíveis, inclusive para a Antiguidade', () => {
    const groups = groupDiscoveries('ano');
    expect(total('ano')).toBe(118);
    expect(groups[0].key).toBe('antiguidade');
    expect(groups[0].label).toBe('Antiguidade');
    expect(groups.every((g) => g.label !== 'null' && g.label !== 'undefined')).toBe(true);
    const y1898 = groups.find((g) => g.key === '1898')!;
    expect(symbols(y1898.elements)).toEqual(['Ne', 'Kr', 'Xe', 'Po', 'Ra']);
  });

  it('por descobridor: Seaborg aparece em vários elementos', () => {
    const groups = groupDiscoveries('descobridor');
    const seaborg = groups.find((g) => g.key === 'Glenn T. Seaborg')!;
    expect(symbols(seaborg.elements)).toEqual(expect.arrayContaining(['Pu', 'Am', 'Cm', 'Bk', 'Cf']));
    for (let i = 1; i < groups.length; i++) expect(groups[i - 1].elements.length).toBeGreaterThanOrEqual(groups[i].elements.length);
  });

  it('dentro de cada grupo, os elementos seguem a ordem cronológica', () => {
    for (const g of groupDiscoveries('pais')) {
      for (let i = 1; i < g.elements.length; i++) expect(discoveryYear(g.elements[i - 1]) <= discoveryYear(g.elements[i])).toBe(true);
    }
  });
});
