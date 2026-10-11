import type { ChemicalElement } from '../data/types';
import { ELEMENTS } from '../data/elements';
import { CATEGORY_BY_ID } from '../data/categories';

export interface QuizQuestion {
  answer: ChemicalElement;
  options: ChemicalElement[];
  clues: string[];
}

/** Gerador pseudoaleatório determinístico (para testes reprodutíveis). */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Esconde o nome (e símbolos de duas letras) do elemento dentro de uma pista. */
export function maskElement(text: string, el: ChemicalElement): string {
  let out = text;
  for (const n of [el.name, ...(el.aliases ?? [])]) {
    out = out.replace(new RegExp(escapeRe(n), 'gi'), '▢▢▢');
  }
  if (el.symbol.length === 2) out = out.replace(new RegExp(`\\b${el.symbol}\\b`, 'g'), '▢▢');
  return out;
}

/** Pistas progressivas: da mais difícil para a mais fácil. */
export function cluesFor(el: ChemicalElement): string[] {
  const cat = CATEGORY_BY_ID[el.category].label.toLowerCase();
  const year = el.discovery.year === null ? 'é conhecido desde a Antiguidade' : `foi identificado em ${el.discovery.year}`;
  const where = el.group ? `Está no grupo ${el.group}, período ${el.period}.` : `Está na série ${el.category === 'lanthanide' ? 'dos lantanídeos' : 'dos actinídeos'}, período ${el.period}.`;
  return [
    `Pertence à categoria: ${cat}. Este elemento ${year}.`,
    where,
    maskElement(el.highlight, el),
    `Seu número atômico é ${el.z}.`,
  ];
}

export function makeQuestion(rand: () => number = Math.random, pool: ChemicalElement[] = ELEMENTS): QuizQuestion {
  const answer = pool[Math.floor(rand() * pool.length)];
  // Distratores da mesma categoria tornam a pergunta mais interessante.
  const sameCategory = ELEMENTS.filter((e) => e.category === answer.category && e.z !== answer.z);
  const others = ELEMENTS.filter((e) => e.category !== answer.category);
  const distractors = shuffle(sameCategory, rand).slice(0, 2);
  distractors.push(...shuffle(others, rand).slice(0, 3 - distractors.length));
  return { answer, options: shuffle([answer, ...distractors], rand), clues: cluesFor(answer) };
}
