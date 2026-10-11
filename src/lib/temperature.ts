import type { ChemicalElement, StateOfMatter } from '../data/types';

/**
 * Elementos que sublimam à pressão de 1 atm (passam direto de sólido a gás).
 * Para eles, o "ponto de ebulição" das fontes é a temperatura de sublimação e
 * o ponto de fusão listado só vale sob pressão elevada. O arsênio já é
 * reconhecido pelos próprios dados (ebulição < fusão); o carbono (grafite)
 * precisa ser indicado, pois seu ponto de fusão sob pressão fica abaixo da
 * temperatura de sublimação a 1 atm.
 */
const SUBLIMES_AT_1_ATM = new Set([6]);

/**
 * Elementos que não solidificam a 1 atm, nem perto do zero absoluto: o hélio
 * só vira sólido sob cerca de 25 atm (o ponto de fusão listado vale sob pressão).
 */
const NO_SOLID_AT_1_ATM = new Set([2]);

/** O elemento sublima a 1 atm? (o "ponto de ebulição" é, na verdade, de sublimação) */
export function sublimesAtOneAtm(el: ChemicalElement): boolean {
  const { meltingPoint: mp, boilingPoint: bp } = el.props;
  if (bp === null) return false;
  return SUBLIMES_AT_1_ATM.has(el.z) || (mp !== null && bp < mp);
}

/**
 * Estado físico estimado a uma temperatura (K) à pressão de 1 atm, a partir
 * dos pontos de fusão e ebulição. Elementos sem dados retornam "unknown".
 * Observação: alguns elementos (como arsênio e carbono) sublimam à pressão
 * ambiente, e o hélio não solidifica a 1 atm; nesses casos o ponto de fusão
 * listado foi medido sob pressão e não é usado aqui.
 */
export function stateAt(el: ChemicalElement, kelvin: number): StateOfMatter {
  if (el.state === 'unknown') return 'unknown';
  const { meltingPoint: mp, boilingPoint: bp } = el.props;
  // Sublimação à pressão ambiente (ex.: arsênio, carbono): passa direto de sólido a gás.
  if (bp !== null && sublimesAtOneAtm(el)) return kelvin < bp ? 'solid' : 'gas';
  // Hélio: líquido até o zero absoluto a 1 atm.
  if (bp !== null && NO_SOLID_AT_1_ATM.has(el.z)) return kelvin < bp ? 'liquid' : 'gas';
  if (mp === null) return 'unknown';
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
