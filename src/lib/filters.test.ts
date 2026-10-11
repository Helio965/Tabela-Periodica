import { describe, expect, it } from 'vitest';
import { ELEMENTS, ELEMENT_BY_SYMBOL } from '../data/elements';
import { applyFilters, FILTER_BY_ID, FILTERS, matchesFilters, type FilterId } from './filters';

/** Símbolos dos elementos que passam pelos filtros, em ordem de Z. */
const symbolsOf = (active: FilterId[]) => applyFilters(ELEMENTS, active).map((e) => e.symbol);
const zsOf = (active: FilterId[]) => applyFilters(ELEMENTS, active).map((e) => e.z);
const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const z = (symbol: string) => ELEMENT_BY_SYMBOL.get(symbol.toLowerCase())!.z;

describe('definições dos filtros', () => {
  it('cada filtro tem id único, rótulo e explicação', () => {
    const ids = FILTERS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const f of FILTERS) {
      expect(FILTER_BY_ID[f.id]).toBe(f);
      expect(f.label.length).toBeGreaterThan(0);
      expect(f.info.length).toBeGreaterThan(20);
    }
  });

  it('nenhum filtro está vazio', () => {
    for (const f of FILTERS) expect(applyFilters(ELEMENTS, [f.id]).length, f.id).toBeGreaterThan(0);
  });

  it('sem filtros ativos, todos os elementos passam', () => {
    expect(applyFilters(ELEMENTS, [])).toHaveLength(118);
    expect(matchesFilters(ELEMENTS[0], [])).toBe(true);
  });
});

describe('radioatividade', () => {
  it('radioativos = elementos sem isótopo estável (Tc, Pm, Bi e de Po a Og)', () => {
    const expected = [43, 61, 83, ...range(84, 118)];
    expect(zsOf(['radioativos'])).toEqual(expected);
    // Equivale exatamente aos elementos sem nenhum isótopo estável nos dados.
    expect(zsOf(['radioativos'])).toEqual(ELEMENTS.filter((e) => e.props.stableIsotopeCount === 0).map((e) => e.z));
  });

  it('o bismuto entra como radioativo, mas classificado como "muito fraco"', () => {
    const bi = ELEMENT_BY_SYMBOL.get('bi')!;
    expect(matchesFilters(bi, ['radioativos'])).toBe(true);
    expect(bi.radioactivity).toBe('very-weak');
    expect(ELEMENT_BY_SYMBOL.get('po')!.radioactivity).toBe('radioactive');
  });

  it('não radioativos é o complemento exato de radioativos', () => {
    const radio = new Set(zsOf(['radioativos']));
    const nonRadio = zsOf(['nao-radioativos']);
    expect(radio.size + nonRadio.length).toBe(118);
    expect(nonRadio.some((n) => radio.has(n))).toBe(false);
    expect(nonRadio).toContain(z('Pb'));
    expect(nonRadio).not.toContain(z('Tc'));
  });

  it('radioativos e não radioativos juntos não deixam ninguém (E lógico)', () => {
    expect(applyFilters(ELEMENTS, ['radioativos', 'nao-radioativos'])).toEqual([]);
  });
});

describe('origem', () => {
  it('naturais = Z de 1 a 94', () => {
    expect(zsOf(['naturais'])).toEqual(range(1, 94));
  });

  it('sintéticos inclui 95–118 e os sintetizados antes de achados na natureza', () => {
    const synthetic = symbolsOf(['sinteticos']);
    for (const n of range(95, 118)) expect(zsOf(['sinteticos'])).toContain(n);
    expect(synthetic).toEqual(expect.arrayContaining(['Tc', 'Pm', 'At', 'Np', 'Pu']));
    // Exatamente esses: 24 superpesados/transurânicos + 5 "primeiro sintetizados".
    expect(synthetic).toHaveLength(24 + 5);
    expect(synthetic).not.toContain('U');
    expect(synthetic).not.toContain('Fe');
  });

  it('naturais + sintéticos = elementos sintetizados antes de detectados na natureza', () => {
    expect(symbolsOf(['naturais', 'sinteticos'])).toEqual(['Tc', 'Pm', 'At', 'Np', 'Pu']);
  });
});

describe('estado físico a 25 °C e 1 atm', () => {
  it('líquidos: apenas bromo e mercúrio', () => {
    expect(symbolsOf(['liquidos'])).toEqual(['Br', 'Hg']);
  });

  it('gasosos: H, N, O, F, Cl e os gases nobres He, Ne, Ar, Kr, Xe, Rn', () => {
    expect(symbolsOf(['gasosos']).sort()).toEqual(['Ar', 'Cl', 'F', 'H', 'He', 'Kr', 'N', 'Ne', 'O', 'Rn', 'Xe'].sort());
  });

  it('sólidos não incluem elementos de estado desconhecido (superpesados)', () => {
    const solids = symbolsOf(['solidos']);
    expect(solids).toContain('Fe');
    expect(solids).toContain('Ga');
    expect(solids).not.toContain('Og');
    expect(solids).not.toContain('Fr');
    expect(solids).not.toContain('At');
  });

  it('sólidos, líquidos e gasosos não se sobrepõem', () => {
    const s = zsOf(['solidos']);
    const l = zsOf(['liquidos']);
    const g = zsOf(['gasosos']);
    expect(new Set([...s, ...l, ...g]).size).toBe(s.length + l.length + g.length);
  });
});

describe('tipos e famílias', () => {
  it('metais, não metais e semimetais formam uma partição dos 118 elementos', () => {
    const m = zsOf(['metais']);
    const n = zsOf(['nao-metais']);
    const s = zsOf(['semimetais']);
    expect(m.length + n.length + s.length).toBe(118);
    expect(new Set([...m, ...n, ...s]).size).toBe(118);
  });

  it('famílias conhecidas', () => {
    expect(symbolsOf(['gases-nobres'])).toEqual(['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og']);
    expect(symbolsOf(['alcalinos'])).toEqual(['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr']);
    expect(symbolsOf(['alcalino-terrosos'])).toEqual(['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra']);
    expect(zsOf(['lantanideos'])).toEqual(range(57, 71));
    expect(zsOf(['actinideos'])).toEqual(range(89, 103));
    expect(symbolsOf(['halogenios'])).toEqual(expect.arrayContaining(['F', 'Cl', 'Br', 'I']));
    expect(symbolsOf(['alcalinos'])).not.toContain('H');
  });

  it('todos os actinídeos são radioativos', () => {
    expect(applyFilters(ELEMENTS, ['actinideos', 'nao-radioativos'])).toEqual([]);
  });
});

describe('filtros combinados (E lógico)', () => {
  it('radioativos + naturais exclui os elementos 95 em diante', () => {
    const zs = zsOf(['radioativos', 'naturais']);
    expect(zs.every((n) => n <= 94)).toBe(true);
    expect(zs).toEqual([43, 61, ...range(83, 94)]);
  });

  it('radioativos + gasosos = só o radônio', () => {
    expect(symbolsOf(['radioativos', 'gasosos'])).toEqual(['Rn']);
  });

  it('a ordem dos filtros não muda o resultado', () => {
    expect(zsOf(['metais', 'radioativos', 'naturais'])).toEqual(zsOf(['naturais', 'metais', 'radioativos']));
  });

  it('matchesFilters exige todos os filtros', () => {
    const u = ELEMENT_BY_SYMBOL.get('u')!;
    expect(matchesFilters(u, ['radioativos', 'naturais', 'actinideos'])).toBe(true);
    expect(matchesFilters(u, ['radioativos', 'sinteticos'])).toBe(false);
  });
});
