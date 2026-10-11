import { describe, expect, it } from 'vitest';
import {
  decayLabel,
  formatAbundance,
  formatDensity,
  formatHalfLife,
  formatMass,
  formatNumber,
  formatScientific,
  formatTemperature,
  formatYear,
  kelvinToCelsius,
  mainDecayModes,
  superscript,
} from './format';
import type { HalfLife } from '../data/types';

const half = (value: number, unit: string, approximate = false): HalfLife => ({ value, unit, seconds: 0, approximate });

describe('formatNumber', () => {
  it('usa vírgula decimal e ponto de milhar (pt-BR)', () => {
    expect(formatNumber(3.98)).toBe('3,98');
    expect(formatNumber(1.9)).toBe('1,9');
    expect(formatNumber(1234.5678)).toBe('1.234,57');
    expect(formatNumber(2.0)).toBe('2');
    expect(formatNumber(13.5336, 3)).toBe('13,534');
  });

  it('"não disponível" para valores ausentes ou inválidos', () => {
    expect(formatNumber(null)).toBe('não disponível');
    expect(formatNumber(undefined)).toBe('não disponível');
    expect(formatNumber(Number.NaN)).toBe('não disponível');
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe('não disponível');
  });

  it('não mostra "-0" para negativos que arredondam para zero', () => {
    expect(formatNumber(-0.001)).toBe('0');
    expect(formatNumber(-0)).toBe('0');
    expect(formatNumber(-0.4, 0)).toBe('0');
    expect(formatNumber(-0.01)).toBe('-0,01');
    expect(formatNumber(-12.5)).toBe('-12,5');
  });
});

describe('formatMass', () => {
  it('troca o ponto decimal pela vírgula', () => {
    expect(formatMass('1.0080')).toBe('1,0080');
    expect(formatMass('238.03')).toBe('238,03');
  });

  it('mantém o número de massa entre colchetes', () => {
    expect(formatMass('[98]')).toBe('[98]');
    expect(formatMass('[294]')).toBe('[294]');
  });
});

describe('temperaturas', () => {
  it('kelvinToCelsius', () => {
    expect(kelvinToCelsius(273.15)).toBe(0);
    expect(kelvinToCelsius(0)).toBeCloseTo(-273.15, 10);
    expect(kelvinToCelsius(373.15)).toBeCloseTo(100, 10);
  });

  it('formatTemperature mostra °C e K em pt-BR', () => {
    expect(formatTemperature(273.15)).toContain('0 °C');
    expect(formatTemperature(273.15)).toBe('0 °C (273,15 K)');
    expect(formatTemperature(1811)).toBe('1.537,9 °C (1.811 K)');
    expect(formatTemperature(234.32)).toBe('-38,8 °C (234,32 K)');
    expect(formatTemperature(0)).toBe('-273,2 °C (0 K)');
  });

  it('valores entre -10 °C e 10 °C ganham duas casas decimais', () => {
    expect(formatTemperature(276.15)).toBe('3 °C (276,15 K)');
    expect(formatTemperature(280.5)).toBe('7,35 °C (280,5 K)');
  });

  it('não mostra "-0 °C" por erro de arredondamento', () => {
    expect(formatTemperature(273.15 - 1e-9)).toBe('0 °C (273,15 K)');
  });

  it('"não disponível" sem dado', () => {
    expect(formatTemperature(null)).toBe('não disponível');
    expect(formatTemperature(undefined)).toBe('não disponível');
  });
});

describe('formatDensity', () => {
  it('sólidos e líquidos em g/cm³', () => {
    expect(formatDensity(7.874, 'solid')).toBe('7,87 g/cm³');
    expect(formatDensity(0.534, 'solid')).toBe('0,534 g/cm³');
    expect(formatDensity(13.5336, 'liquid')).toBe('13,53 g/cm³');
  });

  it('gases em g/L (1 g/cm³ = 1000 g/L)', () => {
    expect(formatDensity(0.0012506, 'gas')).toBe('1,2506 g/L');
    expect(formatDensity(0.00008988, 'gas')).toBe('0,0899 g/L');
  });

  it('"não disponível" sem dado', () => {
    expect(formatDensity(null, 'solid')).toBe('não disponível');
  });
});

describe('superscript', () => {
  it('converte dígitos e sinal de menos', () => {
    expect(superscript(24)).toBe('²⁴');
    expect(superscript(-12)).toBe('⁻¹²');
    expect(superscript('0123456789')).toBe('⁰¹²³⁴⁵⁶⁷⁸⁹');
  });

  it('mantém outros caracteres', () => {
    expect(superscript('2a')).toBe('²a');
  });
});

describe('formatScientific', () => {
  it('números "comuns" ficam em notação decimal', () => {
    expect(formatScientific(0)).toBe('0');
    expect(formatScientific(950)).toBe('950');
    expect(formatScientific(0.0012)).toBe('0,001');
    expect(formatScientific(123456)).toBe('123.456');
  });

  it('números muito grandes ou pequenos usam potência de 10', () => {
    expect(formatScientific(2.25e24)).toBe('2,25 × 10²⁴');
    expect(formatScientific(4.1e-5)).toBe('4,1 × 10⁻⁵');
    expect(formatScientific(1e6)).toBe('1 × 10⁶');
    expect(formatScientific(-3.2e8)).toBe('-3,2 × 10⁸');
  });

  it('a mantissa nunca vira "10" depois do arredondamento', () => {
    expect(formatScientific(9.999e-5)).toBe('1 × 10⁻⁴');
    expect(formatScientific(9.9999e8)).toBe('1 × 10⁹');
    expect(formatScientific(9.994e8)).toBe('9,99 × 10⁸');
  });
});

describe('formatHalfLife', () => {
  it('estável quando não há meia-vida', () => {
    expect(formatHalfLife(null)).toBe('estável');
  });

  it('unidades curtas (ms, s, min, h, dias)', () => {
    expect(formatHalfLife(half(5, 'ms'))).toBe('5 ms');
    expect(formatHalfLife(half(0.89, 'ms'))).toBe('0,89 ms');
    expect(formatHalfLife(half(2.5, 'us'))).toBe('2,5 µs');
    expect(formatHalfLife(half(3.8235, 's'))).toBe('3,8235 s');
    expect(formatHalfLife(half(20.4, 'm'))).toBe('20,4 min');
    expect(formatHalfLife(half(6.0067, 'h'))).toBe('6,0067 h');
    expect(formatHalfLife(half(138.376, 'd'))).toBe('138,376 dias');
  });

  it('anos (y), com mil, milhões e bilhões', () => {
    expect(formatHalfLife(half(5700, 'y'))).toBe('5,7 mil anos');
    expect(formatHalfLife(half(432.6, 'y'))).toBe('432,6 anos');
    expect(formatHalfLife(half(1600, 'y'))).toBe('1,6 mil anos');
    expect(formatHalfLife(half(24.11, 'ky'))).toBe('24,1 mil anos');
    expect(formatHalfLife(half(703.8, 'My'))).toBe('703,8 milhões de anos');
  });

  it('gigaanos (Gy) e escalas maiores', () => {
    expect(formatHalfLife(half(4.468, 'Gy'))).toBe('4,468 bilhões de anos');
    expect(formatHalfLife(half(14.0, 'Gy'))).toBe('14 bilhões de anos');
    expect(formatHalfLife(half(2.01, 'Ey'))).toBe('2,01 × 10¹⁸ anos');
    expect(formatHalfLife(half(20.1, 'Ey'))).toBe('2,01 × 10¹⁹ anos');
  });

  it('concordância: singular abaixo de 2 ("1,248 bilhão", "1,5 dia"), plural a partir de 2', () => {
    // Potássio-40, berílio-10 e túlio-171 (valores reais dos dados).
    expect(formatHalfLife(half(1.248, 'Gy'))).toBe('1,248 bilhão de anos');
    expect(formatHalfLife(half(1.387, 'My'))).toBe('1,39 milhão de anos');
    expect(formatHalfLife(half(1.92, 'y'))).toBe('1,92 ano');
    expect(formatHalfLife(half(1, 'd'))).toBe('1 dia');
    expect(formatHalfLife(half(1.5, 'd'))).toBe('1,5 dia');
    expect(formatHalfLife(half(2, 'd'))).toBe('2 dias');
    expect(formatHalfLife(half(2.6, 'y'))).toBe('2,6 anos');
    // O arredondamento decide: 1,999 ano aparece como "2 anos".
    expect(formatHalfLife(half(1.999, 'y'))).toBe('2 anos');
  });

  it('valores aproximados recebem "≈"', () => {
    expect(formatHalfLife(half(2, 'ms', true))).toBe('≈ 2 ms');
    expect(formatHalfLife(half(1.4, 'Gy', true))).toBe('≈ 1,4 bilhão de anos');
  });
});

describe('decaimento', () => {
  it('decayLabel traduz os modos conhecidos e mantém os demais', () => {
    expect(decayLabel('A')).toBe('alfa (α)');
    expect(decayLabel('B-')).toBe('beta menos (β⁻)');
    expect(decayLabel('EC')).toBe('captura eletrônica');
    expect(decayLabel('SF')).toBe('fissão espontânea');
    expect(decayLabel('XYZ')).toBe('XYZ');
  });

  it('mainDecayModes mantém os modos com 1% ou mais (ou de intensidade desconhecida)', () => {
    const modes = [
      { mode: 'A', intensity: 99.5, approx: false },
      { mode: 'SF', intensity: 0.5, approx: false },
      { mode: 'EC', intensity: null, approx: false },
    ];
    expect(mainDecayModes(modes).map((m) => m.mode)).toEqual(['A', 'EC']);
  });

  it('mainDecayModes nunca devolve lista vazia', () => {
    const rare = [
      { mode: 'B-', intensity: 0.2, approx: false },
      { mode: 'A', intensity: 0.1, approx: false },
    ];
    expect(mainDecayModes(rare).map((m) => m.mode)).toEqual(['B-']);
    expect(mainDecayModes([])).toEqual([]);
    const single = [{ mode: 'A', intensity: 0.3, approx: false }];
    expect(mainDecayModes(single)).toEqual(single);
  });
});

describe('outros formatos', () => {
  it('formatAbundance', () => {
    expect(formatAbundance(null, 'mg/kg')).toBe('não disponível');
    expect(formatAbundance(56300, 'mg/kg')).toBe('56.300 mg/kg');
    expect(formatAbundance(2.5e-6, 'mg/L')).toBe('2,5 × 10⁻⁶ mg/L');
  });

  it('formatYear', () => {
    expect(formatYear(null)).toBe('Antiguidade');
    expect(formatYear(null, 'Pré-história')).toBe('Pré-história');
    expect(formatYear(1898)).toBe('1898');
    expect(formatYear(1735, 'c. 1735')).toBe('c. 1735');
  });
});
