import { describe, expect, it } from 'vitest';
import { QUALITY_LABELS, QUALITY_PRESETS, readDeviceHints, resolveQuality, type DeviceHints } from './quality';

const desktop: DeviceHints = { reducedMotion: false, cores: 8, memoryGb: 16, coarsePointer: false, viewportWidth: 1440 };

describe('resolveQuality', () => {
  it('escolha manual é respeitada', () => {
    expect(resolveQuality('low', desktop)).toBe('low');
    expect(resolveQuality('medium', desktop)).toBe('medium');
    expect(resolveQuality('high', { ...desktop, reducedMotion: true })).toBe('high');
  });

  it('automática: alta em computadores potentes', () => {
    expect(resolveQuality('auto', desktop)).toBe('high');
  });

  it('automática: baixa quando o sistema pede menos movimento', () => {
    expect(resolveQuality('auto', { ...desktop, reducedMotion: true })).toBe('low');
  });

  it('automática: baixa em celulares modestos, média em aparelhos intermediários ou telas estreitas', () => {
    expect(resolveQuality('auto', { ...desktop, coarsePointer: true, cores: 4, viewportWidth: 390 })).toBe('low');
    expect(resolveQuality('auto', { ...desktop, coarsePointer: true, memoryGb: 2, viewportWidth: 390 })).toBe('low');
    expect(resolveQuality('auto', { ...desktop, cores: 4 })).toBe('medium');
    expect(resolveQuality('auto', { ...desktop, viewportWidth: 600 })).toBe('medium');
    expect(resolveQuality('auto', { ...desktop, coarsePointer: true, viewportWidth: 1024 })).toBe('high');
  });
});

describe('presets e rótulos', () => {
  it('rótulos em português para todas as opções', () => {
    expect(QUALITY_LABELS).toEqual({ auto: 'Automática', low: 'Baixa', medium: 'Média', high: 'Alta' });
  });

  it('a qualidade baixa desliga os efeitos mais pesados', () => {
    expect(QUALITY_PRESETS.low).toMatchObject({ lighting: false, glow: false, stars: 0 });
    expect(QUALITY_PRESETS.high.stars).toBeGreaterThan(QUALITY_PRESETS.medium.stars);
  });

  it('readDeviceHints funciona no ambiente de teste (sem matchMedia)', () => {
    const hints = readDeviceHints();
    expect(typeof hints.reducedMotion).toBe('boolean');
    expect(hints.cores).toBeGreaterThan(0);
    expect(hints.viewportWidth).toBeGreaterThan(0);
  });
});
