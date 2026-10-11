import { describe, expect, it } from 'vitest';
import { ELEMENTS } from '../data/elements';
import { normalize, slugify } from './text';

describe('normalize', () => {
  it('remove acentos, converte para minúsculas e apara espaços', () => {
    expect(normalize('  Urânio ')).toBe('uranio');
    expect(normalize('NITROGÊNIO')).toBe('nitrogenio');
    expect(normalize('Ação, côco e pão')).toBe('acao, coco e pao');
  });

  it('trata texto já decomposto (NFD) do mesmo jeito', () => {
    expect(normalize('Urânio')).toBe('uranio');
  });
});

describe('slugify', () => {
  it('gera slugs para URLs', () => {
    expect(slugify('Urânio')).toBe('uranio');
    expect(slugify('Lord Rayleigh (John William Strutt)')).toBe('lord-rayleigh-john-william-strutt');
    expect(slugify('  --Água-marinha!  ')).toBe('agua-marinha');
  });

  it('os slugs dos 118 elementos são únicos e só têm a–z, 0–9 e hífen', () => {
    const slugs = ELEMENTS.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(118);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });
});
