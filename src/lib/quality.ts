import type { Quality, ResolvedQuality } from '../state/types';

export const QUALITY_LABELS: Record<Quality, string> = {
  auto: 'Automática',
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

export interface DeviceHints {
  reducedMotion: boolean;
  cores: number;
  memoryGb: number | null;
  coarsePointer: boolean;
  viewportWidth: number;
}

export function readDeviceHints(): DeviceHints {
  const nav = typeof navigator !== 'undefined' ? (navigator as Navigator & { deviceMemory?: number }) : undefined;
  const mq = (q: string) => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q).matches : false);
  return {
    reducedMotion: mq('(prefers-reduced-motion: reduce)'),
    cores: nav?.hardwareConcurrency ?? 4,
    memoryGb: nav?.deviceMemory ?? null,
    coarsePointer: mq('(pointer: coarse)'),
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 1280,
  };
}

/**
 * Qualidade "Automática": reduz efeitos em aparelhos modestos ou quando o
 * usuário pediu menos movimento no sistema operacional.
 */
export function resolveQuality(q: Quality, hints: DeviceHints = readDeviceHints()): ResolvedQuality {
  if (q !== 'auto') return q;
  if (hints.reducedMotion) return 'low';
  const weak = hints.cores <= 4 || (hints.memoryGb !== null && hints.memoryGb <= 4);
  if (hints.coarsePointer && weak) return 'low';
  if (weak || hints.viewportWidth < 768) return 'medium';
  return 'high';
}

/** Parâmetros da cena por nível de qualidade. */
export const QUALITY_PRESETS: Record<ResolvedQuality, { tweenMs: number; lighting: boolean; glow: boolean; stars: number; damping: boolean }> = {
  low: { tweenMs: 900, lighting: false, glow: false, stars: 0, damping: false },
  medium: { tweenMs: 1600, lighting: true, glow: false, stars: 140, damping: true },
  high: { tweenMs: 2200, lighting: true, glow: true, stars: 320, damping: true },
};
