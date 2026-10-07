/**
 * Converte a configuração eletrônica (ex.: "[Ar]4s2 3d10 4p1") em número de
 * elétrons por camada (K, L, M, N, O, P, Q).
 */
const NOBLE_GAS_CORES: Record<string, string> = {
  He: '1s2',
  Ne: '[He]2s2 2p6',
  Ar: '[Ne]3s2 3p6',
  Kr: '[Ar]3d10 4s2 4p6',
  Xe: '[Kr]4d10 5s2 5p6',
  Rn: '[Xe]4f14 5d10 6s2 6p6',
};

export interface Subshell {
  n: number;
  l: 's' | 'p' | 'd' | 'f';
  electrons: number;
}

export function expandConfiguration(config: string): Subshell[] {
  const result: Subshell[] = [];
  const core = config.match(/^\[(\w+)\]/);
  let rest = config;
  if (core) {
    const coreConfig = NOBLE_GAS_CORES[core[1]];
    if (!coreConfig) throw new Error(`Cerne desconhecido: ${core[1]}`);
    result.push(...expandConfiguration(coreConfig));
    rest = config.slice(core[0].length);
  }
  for (const m of rest.matchAll(/(\d)([spdf])(\d+)/g)) {
    result.push({ n: Number(m[1]), l: m[2] as Subshell['l'], electrons: Number(m[3]) });
  }
  return result;
}

export function shellsFromConfiguration(config: string): number[] {
  const shells: number[] = [];
  for (const s of expandConfiguration(config)) {
    shells[s.n - 1] = (shells[s.n - 1] ?? 0) + s.electrons;
  }
  return Array.from(shells, (v) => v ?? 0);
}

export const SHELL_LETTERS = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

/** Configuração em ordem de camadas (1s, 2s, 2p, 3s...), útil para exibição. */
export function orderedConfiguration(config: string): string {
  const order = { s: 0, p: 1, d: 2, f: 3 };
  const core = config.match(/^\[(\w+)\]/);
  const subshells = expandConfiguration(core ? config.slice(core[0].length) : config);
  subshells.sort((a, b) => a.n - b.n || order[a.l] - order[b.l]);
  const body = subshells.map((s) => `${s.n}${s.l}${s.electrons}`).join(' ');
  return core ? `[${core[1]}] ${body}` : body;
}
