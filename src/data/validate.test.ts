import { describe, expect, it } from 'vitest';
import { ALL_CONTENT } from './elements/content';
import { validateContent, validateElements } from './validate';

describe('integridade dos dados', () => {
  it('os 118 elementos passam em todas as validações', () => {
    expect(validateElements()).toEqual([]);
  });

  it('o conteúdo educativo dos 118 elementos está completo', () => {
    expect(validateContent(ALL_CONTENT)).toEqual([]);
  });
});
