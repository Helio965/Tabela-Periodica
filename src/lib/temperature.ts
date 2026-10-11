import type { ChemicalElement, StateOfMatter } from '../data/types';

/**
 * Estado físico estimado a uma temperatura (K) à pressão de 1 atm, a partir
 * dos pontos de fusão e ebulição. Elementos sem dados retornam "unknown".
 * Observação: alguns elementos (como arsênio e carbono) sublimam à pressão
 * ambiente; nesses casos o ponto de fusão listado foi medido sob pressão.
 */
export function stateAt(el: ChemicalElement, kelvin: number): StateOfMatter {
  if (el.state === 'unknown') return 'unknown';
  const { meltingPoint: mp, boilingPoint: bp } = el.props;
  if (mp === null) return 'unknown';
  // Sublimação à pressão ambiente (ex.: arsênio): passa direto de sólido a gás.
  if (bp !== null && bp < mp) return kelvin < bp ? 'solid' : 'gas';
  if (kelvin < mp) return 'solid';
  if (bp === null) return 'unknown';
  return kelvin < bp ? 'liquid' : 'gas';
}

export const STATE_LABELS: Record<StateOfMatter, string> = {
  solid: 'Sólido',
  liquid: 'Líquido',
  gas: 'Gasoso',
  unknown: 'Desconhecido',
};
