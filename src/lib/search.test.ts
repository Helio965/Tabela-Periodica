import { describe, expect, it } from 'vitest';
import { ELEMENTS } from '../data/elements';
import { searchElements } from './search';

/** Símbolos dos resultados, na ordem. */
const symbols = (query: string, limit?: number) => searchElements(query, ELEMENTS, limit).map((r) => r.element.symbol);

describe('searchElements', () => {
  it('nome completo com acento coloca o elemento em primeiro', () => {
    expect(symbols('Hidrogênio')[0]).toBe('H');
  });

  it('símbolo de uma letra encontra o elemento antes dos nomes que começam com a mesma letra', () => {
    const results = symbols('h');
    expect(results[0]).toBe('H');
    // Hélio, Háfnio, Hólmio e Hássio aparecem depois, por começarem com "h".
    expect(results).toEqual(expect.arrayContaining(['He', 'Hf', 'Ho', 'Hs']));
  });

  it('símbolo em maiúsculas e com espaços também funciona', () => {
    expect(symbols('  FE ')[0]).toBe('Fe');
  });

  it('número atômico encontra o elemento exato', () => {
    expect(symbols('1')[0]).toBe('H');
    expect(symbols('92')[0]).toBe('U');
    expect(symbols('118')[0]).toBe('Og');
    // Número fora da tabela não devolve nada (nem casa com nomes).
    expect(symbols('119')).toEqual([]);
  });

  it('início do nome encontra o elemento', () => {
    expect(symbols('hidro')[0]).toBe('H');
    expect(symbols('oxig')[0]).toBe('O');
  });

  it('ignora acentos e maiúsculas', () => {
    expect(symbols('uranio')[0]).toBe('U');
    expect(symbols('URÂNIO')[0]).toBe('U');
    expect(symbols('sodio')[0]).toBe('Na');
  });

  it('aceita nomes alternativos (aliases) e informa o motivo', () => {
    const [first] = searchElements('Cromo');
    expect(first.element.symbol).toBe('Cr');
    expect(first.reason).toMatch(/também chamado Cromo/);
    expect(symbols('azoto')[0]).toBe('N');
    expect(symbols('volframio')[0]).toBe('W');
  });

  it('aceita o nome em inglês', () => {
    expect(symbols('tungsten')[0]).toBe('W');
    const [sodium] = searchElements('sodium');
    expect(sodium.element.symbol).toBe('Na');
    expect(sodium.reason).toBe('em inglês: Sodium');
  });

  it('busca por descobridor devolve os elementos com o motivo', () => {
    const results = searchElements('curie');
    const bySymbol = new Map(results.map((r) => [r.element.symbol, r]));
    expect(bySymbol.has('Po')).toBe(true);
    expect(bySymbol.has('Ra')).toBe(true);
    expect(bySymbol.get('Po')!.reason).toMatch(/^descoberto por .*Curie/);
    expect(bySymbol.get('Ra')!.reason).toMatch(/^descoberto por .*Curie/);
    // O cúrio homenageia os Curie, mas foi descoberto por Seaborg, James e Ghiorso.
    const seaborg = searchElements('seaborg', ELEMENTS, 20);
    const curium = seaborg.find((r) => r.element.symbol === 'Cm');
    expect(curium?.reason).toMatch(/descoberto por Glenn T\. Seaborg/);
  });

  it('o próprio nome vem antes dos resultados por descobridor', () => {
    // "Seabórgio" começa com "seaborg" e deve vir antes dos elementos descobertos por Seaborg.
    expect(symbols('seaborg')[0]).toBe('Sg');
  });

  it('consulta vazia ou só com espaços devolve lista vazia', () => {
    expect(searchElements('')).toEqual([]);
    expect(searchElements('   ')).toEqual([]);
  });

  it('respeita o limite e ordena por relevância', () => {
    const results = searchElements('a', ELEMENTS, 3);
    expect(results).toHaveLength(3);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it('consulta sem correspondência devolve lista vazia', () => {
    expect(searchElements('xyzzy')).toEqual([]);
  });
});
