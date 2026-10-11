import type { DecayMode, HalfLife } from '../data/types';

const nf = (maxFrac: number, minFrac = 0) =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: maxFrac, minimumFractionDigits: minFrac });

export function formatNumber(value: number | null | undefined, maxFrac = 2): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return 'não disponível';
  return nf(maxFrac).format(value);
}

/** Massa atômica no padrão brasileiro: "1,0080", "[98]". */
export function formatMass(display: string): string {
  return display.replace('.', ',');
}

export function kelvinToCelsius(k: number): number {
  return k - 273.15;
}

/** "1.538 °C (1.811 K)" */
export function formatTemperature(kelvin: number | null | undefined): string {
  if (kelvin === null || kelvin === undefined) return 'não disponível';
  const c = kelvinToCelsius(kelvin);
  return `${nf(Math.abs(c) < 10 ? 2 : 1).format(c)} °C (${nf(2).format(kelvin)} K)`;
}

export function formatDensity(density: number | null, state?: string): string {
  if (density === null) return 'não disponível';
  if (state === 'gas') {
    // Para gases, g/L é mais legível (1 g/cm³ = 1000 g/L).
    return `${nf(4).format(density * 1000)} g/L`;
  }
  return `${nf(density < 1 ? 3 : 2).format(density)} g/cm³`;
}

const SUPERSCRIPT: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
export const superscript = (s: string | number) => String(s).split('').map((c) => SUPERSCRIPT[c] ?? c).join('');

/** Número em notação científica legível: 2,25 × 10²⁴ */
export function formatScientific(value: number, digits = 3): string {
  if (value === 0) return '0';
  const exp = Math.floor(Math.log10(Math.abs(value)));
  if (exp >= -3 && exp < 6) return nf(digits).format(value);
  const mantissa = value / 10 ** exp;
  return `${nf(2).format(mantissa)} × 10${superscript(exp)}`;
}

const HALF_LIFE_UNITS: Record<string, string> = {
  ys: 'ys', zs: 'zs', as: 'as', fs: 'fs', ps: 'ps', ns: 'ns', us: 'µs', ms: 'ms', s: 's', m: 'min', h: 'h', d: 'dias',
};

const YEAR_SCALE: Record<string, number> = { y: 1, ky: 1e3, My: 1e6, Gy: 1e9, Ty: 1e12, Py: 1e15, Ey: 1e18, Zy: 1e21, Yy: 1e24 };

export function formatHalfLife(h: HalfLife | null): string {
  if (!h) return 'estável';
  const prefix = h.approximate ? '≈ ' : '';
  if (HALF_LIFE_UNITS[h.unit]) return `${prefix}${nf(4).format(h.value)} ${HALF_LIFE_UNITS[h.unit]}`;
  const years = h.value * (YEAR_SCALE[h.unit] ?? 1);
  if (years < 1e3) return `${prefix}${nf(2).format(years)} anos`;
  if (years < 1e6) return `${prefix}${nf(1).format(years / 1e3)} mil anos`;
  if (years < 1e9) return `${prefix}${nf(2).format(years / 1e6)} milhões de anos`;
  if (years < 1e12) return `${prefix}${nf(3).format(years / 1e9)} bilhões de anos`;
  return `${prefix}${formatScientific(years)} anos`;
}

const DECAY_LABELS: Record<string, string> = {
  A: 'alfa (α)',
  'B-': 'beta menos (β⁻)',
  'B+': 'beta mais (β⁺)',
  EC: 'captura eletrônica',
  'e+': 'emissão de pósitron',
  IT: 'transição isomérica (γ)',
  SF: 'fissão espontânea',
  p: 'emissão de próton',
  n: 'emissão de nêutron',
  '2B-': 'duplo beta (2β⁻)',
  '2B+': 'duplo beta mais (2β⁺)',
  'B-n': 'β⁻ seguido de nêutron',
  'B+p': 'β⁺ seguido de próton',
  'B-2n': 'β⁻ seguido de 2 nêutrons',
  'B+A': 'β⁺ seguido de alfa',
  'B-A': 'β⁻ seguido de alfa',
  '2p': 'emissão de 2 prótons',
  '2n': 'emissão de 2 nêutrons',
  'B+SF': 'β⁺ seguido de fissão',
  'B-SF': 'β⁻ seguido de fissão',
  '14C': 'emissão de carbono-14 (aglomerado)',
  '24Ne': 'emissão de neônio-24 (aglomerado)',
  '28Mg': 'emissão de magnésio-28 (aglomerado)',
  '34Si': 'emissão de silício-34 (aglomerado)',
};

export function decayLabel(mode: string): string {
  return DECAY_LABELS[mode] ?? mode;
}

/** Modos de decaimento relevantes (>= 1% ou o principal). */
export function mainDecayModes(modes: DecayMode[]): DecayMode[] {
  if (modes.length <= 1) return modes;
  const relevant = modes.filter((m) => m.intensity === null || m.intensity >= 1);
  return relevant.length ? relevant : modes.slice(0, 1);
}

export function formatAbundance(mgPerKg: number | null, unit: 'mg/kg' | 'mg/L'): string {
  if (mgPerKg === null) return 'não disponível';
  return `${formatScientific(mgPerKg)} ${unit}`;
}

export function formatYear(year: number | null, label?: string): string {
  if (year === null) return label ?? 'Antiguidade';
  return label ?? String(year);
}
