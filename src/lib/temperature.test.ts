import { describe, expect, it } from 'vitest';
import { ELEMENTS, ELEMENT_BY_SYMBOL, STATE_REFERENCE } from '../data/elements';
import { STATE_LABELS, stateAt, sublimesAtOneAtm } from './temperature';

const el = (symbol: string) => ELEMENT_BY_SYMBOL.get(symbol.toLowerCase())!;
const ROOM = STATE_REFERENCE.kelvin; // 298,15 K = 25 °C

describe('stateAt', () => {
  it('mercúrio e bromo são líquidos a 298 K', () => {
    expect(stateAt(el('Hg'), 298)).toBe('liquid');
    expect(stateAt(el('Br'), 298)).toBe('liquid');
  });

  it('gálio é sólido a 298 K, mas derrete na mão (líquido a 303 K)', () => {
    expect(stateAt(el('Ga'), 298)).toBe('solid');
    expect(stateAt(el('Ga'), 303)).toBe('liquid');
  });

  it('hélio é gás a 298 K', () => {
    expect(stateAt(el('He'), 298)).toBe('gas');
  });

  it('hélio não solidifica a 1 atm: é líquido até perto do zero absoluto', () => {
    expect(stateAt(el('He'), 4)).toBe('liquid');
    expect(stateAt(el('He'), 0.5)).toBe('liquid');
    expect(stateAt(el('He'), 0)).toBe('liquid');
    expect(stateAt(el('He'), 5)).toBe('gas');
  });

  it('arsênio sublima: sólido abaixo de 887 K e gás acima, sem fase líquida', () => {
    expect(stateAt(el('As'), 298)).toBe('solid');
    expect(stateAt(el('As'), 886)).toBe('solid');
    expect(stateAt(el('As'), 888)).toBe('gas');
    expect(stateAt(el('As'), 1100)).toBe('gas');
    expect(sublimesAtOneAtm(el('As'))).toBe(true);
  });

  it('carbono (grafite) sublima a 1 atm: nunca aparece como líquido', () => {
    const c = el('C');
    expect(sublimesAtOneAtm(c)).toBe(true);
    expect(stateAt(c, 298)).toBe('solid');
    expect(stateAt(c, c.props.boilingPoint! + 1)).toBe('gas');
    for (let k = 0; k <= 6000; k += 50) expect(stateAt(c, k)).not.toBe('liquid');
  });

  it('a maioria dos elementos não sublima', () => {
    expect(sublimesAtOneAtm(el('Fe'))).toBe(false);
    expect(sublimesAtOneAtm(el('Hg'))).toBe(false);
    expect(sublimesAtOneAtm(el('He'))).toBe(false);
  });

  it('desconhecido para o oganessônio e para elementos sem dados medidos', () => {
    expect(stateAt(el('Og'), 298)).toBe('unknown');
    expect(stateAt(el('Og'), 5000)).toBe('unknown');
    expect(stateAt(el('Fr'), 298)).toBe('unknown');
  });

  it('transições sólido → líquido → gás do ferro', () => {
    const fe = el('Fe');
    expect(stateAt(fe, 298)).toBe('solid');
    expect(stateAt(fe, fe.props.meltingPoint! + 1)).toBe('liquid');
    expect(stateAt(fe, fe.props.boilingPoint! + 1)).toBe('gas');
  });

  it('nos pontos de fusão e ebulição exatos o elemento já mudou de fase', () => {
    const hg = el('Hg');
    expect(stateAt(hg, hg.props.meltingPoint! - 0.01)).toBe('solid');
    expect(stateAt(hg, hg.props.meltingPoint!)).toBe('liquid');
    expect(stateAt(hg, hg.props.boilingPoint!)).toBe('gas');
  });

  it('a 25 °C, o estado calculado coincide com o estado de referência dos dados', () => {
    for (const e of ELEMENTS) {
      if (e.state === 'unknown') continue;
      expect(stateAt(e, ROOM), e.symbol).toBe(e.state);
    }
  });

  it('perto do zero absoluto, tudo que tem dados (menos o hélio) é sólido', () => {
    for (const e of ELEMENTS) {
      if (e.state === 'unknown' || e.symbol === 'He') continue;
      expect(stateAt(e, 1), e.symbol).toBe('solid');
    }
  });
});

describe('STATE_LABELS', () => {
  it('rótulos em português', () => {
    expect(STATE_LABELS).toEqual({ solid: 'Sólido', liquid: 'Líquido', gas: 'Gasoso', unknown: 'Desconhecido' });
  });
});
