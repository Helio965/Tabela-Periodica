import type { DecayMode, HalfLife } from '../data/types';

const formatters = new Map<string, Intl.NumberFormat>();

/** Reaproveita os formatadores (criar um Intl.NumberFormat é relativamente caro). */
function intl(maxFrac: number, minFrac: number): Intl.NumberFormat {
  const key = `${maxFrac}:${minFrac}`;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: maxFrac, minimumFractionDigits: minFrac });
    formatters.set(key, f);
  }
  return f;
}

/**
 * Formatador pt-BR. Um valor negativo que arredonda para zero (ex.: -0,001
 * com 2 casas, ou -1e-13 vindo de 273,15 − 273,15) apareceria como "-0";
 * aqui ele vira "0".
 */
const nf = (maxFrac: number, minFrac = 0) => ({
  format: (value: number) => {
    const text = intl(maxFrac, minFrac).format(value);
    return /^[-\u2212]0(,0+)?$/.test(text) ? text.slice(1) : text;
  },
});

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
  let exp = Math.floor(Math.log10(Math.abs(value)));
  if (exp >= -3 && exp < 6) return nf(digits).format(value);
  let mantissa = value / 10 ** exp;
  // 9,999 × 10⁻⁵ arredondaria para "10 × 10⁻⁵": ajusta para "1 × 10⁻⁴".
  if (Math.abs(Math.round(mantissa * 100) / 100) >= 10) {
    mantissa /= 10;
    exp += 1;
  }
  return `${nf(2).format(mantissa)} × 10${superscript(exp)}`;
}

const HALF_LIFE_UNITS: Record<string, string> = {
  ys: 'ys', zs: 'zs', as: 'as', fs: 'fs', ps: 'ps', ns: 'ns', us: 'µs', ms: 'ms', s: 's', m: 'min', h: 'h',
};

const YEAR_SCALE: Record<string, number> = { y: 1, ky: 1e3, My: 1e6, Gy: 1e9, Ty: 1e12, Py: 1e15, Ey: 1e18, Zy: 1e21, Yy: 1e24 };

/**
 * Número seguido de uma palavra que concorda com ele: singular abaixo de 2,
 * como pede a norma ("1,25 bilhão de anos", "1,5 dia", "2 dias").
 */
function counted(value: number, maxFrac: number, singular: string, plural: string): string {
  const rounded = Number(value.toFixed(maxFrac));
  return `${nf(maxFrac).format(value)} ${Math.abs(rounded) < 2 ? singular : plural}`;
}

export function formatHalfLife(h: HalfLife | null): string {
  if (!h) return 'estável';
  const prefix = h.approximate ? '≈ ' : '';
  if (HALF_LIFE_UNITS[h.unit]) return `${prefix}${nf(4).format(h.value)} ${HALF_LIFE_UNITS[h.unit]}`;
  if (h.unit === 'd') return prefix + counted(h.value, 4, 'dia', 'dias');
  const years = h.value * (YEAR_SCALE[h.unit] ?? 1);
  if (years < 1e3) return prefix + counted(years, 2, 'ano', 'anos');
  if (years < 1e6) return `${prefix}${nf(1).format(years / 1e3)} mil anos`;
  if (years < 1e9) return prefix + counted(years / 1e6, 2, 'milhão de anos', 'milhões de anos');
  if (years < 1e12) return prefix + counted(years / 1e9, 3, 'bilhão de anos', 'bilhões de anos');
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
