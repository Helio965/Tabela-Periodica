import { describe, expect, it } from 'vitest';
import { ELEMENTS, ELEMENT_BY_SYMBOL } from '../data/elements';
import { cluesFor, makeQuestion, maskElement, mulberry32 } from './quiz';

const el = (symbol: string) => ELEMENT_BY_SYMBOL.get(symbol.toLowerCase())!;
const zs = (list: { z: number }[]) => list.map((e) => e.z);

describe('mulberry32', () => {
  it('é determinístico e gera valores em [0, 1)', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const seqA = Array.from({ length: 50 }, a);
    const seqB = Array.from({ length: 50 }, b);
    expect(seqA).toEqual(seqB);
    for (const v of seqA) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('sementes diferentes geram sequências diferentes', () => {
    const a = Array.from({ length: 10 }, mulberry32(1));
    const b = Array.from({ length: 10 }, mulberry32(2));
    expect(a).not.toEqual(b);
  });
});

describe('makeQuestion', () => {
  it('com a mesma semente gera a mesma pergunta', () => {
    const q1 = makeQuestion(mulberry32(2024));
    const q2 = makeQuestion(mulberry32(2024));
    expect(q1.answer.z).toBe(q2.answer.z);
    expect(zs(q1.options)).toEqual(zs(q2.options));
    expect(q1.clues).toEqual(q2.clues);
  });

  it('sempre tem 4 alternativas distintas, incluindo a resposta', () => {
    for (let seed = 1; seed <= 300; seed++) {
      const q = makeQuestion(mulberry32(seed));
      expect(q.options).toHaveLength(4);
      expect(new Set(zs(q.options)).size).toBe(4);
      expect(zs(q.options)).toContain(q.answer.z);
      expect(q.clues).toHaveLength(4);
    }
  });

  it('dois distratores são da mesma categoria da resposta', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const q = makeQuestion(mulberry32(seed));
      const same = q.options.filter((o) => o.z !== q.answer.z && o.category === q.answer.category);
      expect(same).toHaveLength(2);
    }
  });

  it('a resposta não fica sempre na mesma posição', () => {
    const positions = new Set<number>();
    for (let seed = 1; seed <= 60; seed++) {
      const q = makeQuestion(mulberry32(seed));
      positions.add(q.options.findIndex((o) => o.z === q.answer.z));
    }
    expect(positions.size).toBe(4);
  });

  it('sorteia a resposta dentro do conjunto informado', () => {
    const pool = ELEMENTS.filter((e) => e.category === 'noble-gas');
    for (let seed = 1; seed <= 30; seed++) {
      const q = makeQuestion(mulberry32(seed), pool);
      expect(q.answer.category).toBe('noble-gas');
      expect(q.options).toHaveLength(4);
    }
  });
});

describe('maskElement', () => {
  it('esconde o nome sem diferenciar maiúsculas', () => {
    const fe = el('Fe');
    expect(maskElement('O Ferro enferruja; o ferro é magnético; FERRO!', fe)).toBe('O ▢▢▢ enferruja; o ▢▢▢ é magnético; ▢▢▢!');
  });

  it('esconde o nome com acento, em qualquer caixa', () => {
    expect(maskElement('O HÉLIO e o hélio', el('He'))).toBe('O ▢▢▢ e o ▢▢▢');
  });

  it('esconde nomes alternativos', () => {
    expect(maskElement('O cromo e o crômio são o mesmo elemento.', el('Cr'))).toBe('O ▢▢▢ e o ▢▢▢ são o mesmo elemento.');
  });

  it('esconde o símbolo de duas letras como palavra inteira', () => {
    expect(maskElement('O símbolo Fe vem do latim.', el('Fe'))).toBe('O símbolo ▢▢ vem do latim.');
    expect(maskElement('Na tabela, Na é o sódio.', el('Na'))).toBe('▢▢ tabela, ▢▢ é o ▢▢▢.');
  });

  it('não esconde o símbolo dentro de outras palavras (inclusive acentuadas)', () => {
    expect(maskElement('Nações Unidas', el('Na'))).toBe('Nações Unidas');
    expect(maskElement('Feira de ciências', el('Fe'))).toBe('Feira de ciências');
    expect(maskElement('Café', el('Fe'))).toBe('Café');
  });

  it('não esconde símbolos de uma letra (seriam palavras comuns, como "O" e "U")', () => {
    expect(maskElement('O oxigênio é essencial.', el('O'))).toBe('O ▢▢▢ é essencial.');
    expect(maskElement('C de carbono', el('C'))).toBe('C de ▢▢▢');
  });

  it('esconde o nome no início de palavras derivadas, mas não no meio de outras palavras', () => {
    expect(maskElement('Íons ferrosos', el('Fe'))).toBe('Íons ▢▢▢sos');
    // "período" contém "iodo"; "tesouro" contém "ouro".
    expect(maskElement('O iodo no período 5', el('I'))).toBe('O ▢▢▢ no período 5');
    expect(maskElement('Um tesouro de ouro', el('Au'))).toBe('Um tesouro de ▢▢▢');
  });

  it('caracteres especiais no texto não quebram a máscara', () => {
    expect(maskElement('(ferro) [Fe] $ferro$', el('Fe'))).toBe('(▢▢▢) [▢▢] $▢▢▢$');
  });
});

describe('cluesFor', () => {
  it('quatro pistas, da mais difícil para a mais fácil (número atômico por último)', () => {
    const clues = cluesFor(el('Fe'));
    expect(clues).toHaveLength(4);
    expect(clues[0]).toMatch(/^Pertence à categoria: metais de transição\./);
    expect(clues[0]).toContain('conhecido desde a Antiguidade');
    expect(clues[1]).toBe('Está no grupo 8, período 4.');
    expect(clues[3]).toBe('Seu número atômico é 26.');
  });

  it('informa o ano de identificação e a série do bloco f', () => {
    const u = cluesFor(el('U'));
    expect(u[0]).toContain('foi identificado em 1789');
    expect(u[1]).toBe('Está na série dos actinídeos, período 7.');
    expect(cluesFor(el('Nd'))[1]).toBe('Está na série dos lantanídeos, período 6.');
  });

  it('nenhuma pista revela o nome ou o símbolo de duas letras do elemento', () => {
    for (const e of ELEMENTS) {
      const clues = cluesFor(e).join(' ');
      // O nome não pode começar nenhuma palavra ("período" pode aparecer, mesmo contendo "iodo").
      for (const name of [e.name, ...(e.aliases ?? [])]) expect(clues, e.symbol).not.toMatch(new RegExp(`(?<![\\p{L}])${name}`, 'iu'));
      if (e.symbol.length === 2) expect(clues, e.symbol).not.toMatch(new RegExp(`(?<![\\p{L}])${e.symbol}(?![\\p{L}])`, 'u'));
    }
  });
});
