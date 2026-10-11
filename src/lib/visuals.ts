import type { ChemicalElement, StateOfMatter } from '../data/types';
import { ELEMENTS } from '../data/elements';
import type { AppState } from '../state/types';
import { matchesFilters } from './filters';
import { rankByMass } from './ranking';
import { stateAt } from './temperature';
import { discoveryYear } from './timeline';
import { TREND_BY_ID, trendScale } from './trends';

/** Estado visual de um cartão, calculado a partir do estado da aplicação. */
export interface ElementVisual {
  /** Fora do foco atual (filtros, legenda, grupo/período, ranking): fica esmaecido. */
  dim: boolean;
  /** Algum foco está ativo e o elemento corresponde a ele: recebe contorno de destaque. */
  emphasis: boolean;
  /** Posição no ranking de massa (1, 2, 3…). */
  rank?: number;
  /** Intensidade 0–1 da tendência periódica (`null` = sem dado). */
  trend?: number | null;
  trendLabel?: string;
  /** Estado físico na temperatura escolhida (modo "Estado da matéria"). */
  matterState?: StateOfMatter;
  /** Ainda não descoberto no ano escolhido da linha do tempo. */
  undiscovered: boolean;
  /** Acabou de surgir na reprodução da evolução histórica. */
  fresh: boolean;
  inCompare: boolean;
  favorite: boolean;
  /** Mostrar o selo ☢ com destaque (filtro "Radioativos" ativo). */
  radiationBadge: boolean;
}

export type VisualMap = Map<number, ElementVisual>;

export function computeVisuals(state: AppState, elements: ChemicalElement[] = ELEMENTS): VisualMap {
  const ranking = state.ranking && state.panel === 'explore' ? rankByMass(state.ranking.kind, state.ranking.size, elements) : null;
  const rankOf = new Map(ranking?.map((el, i) => [el.z, i + 1]));
  const category = state.legendHover ?? state.categoryFocus;
  const focusActive =
    state.filters.length > 0 || category !== null || state.groupFocus !== null || state.periodFocus !== null || ranking !== null;

  const trendDef = state.panel === 'trends' ? TREND_BY_ID[state.trend] : null;
  const scale = trendDef ? trendScale(trendDef.id, elements) : null;
  const radiation = state.filters.includes('radioativos');
  const timelineActive = state.panel === 'discoveries' && state.timelineYear !== null;

  const map: VisualMap = new Map();
  for (const el of elements) {
    let match = matchesFilters(el, state.filters);
    if (category && el.category !== category) match = false;
    if (state.groupFocus !== null && el.group !== state.groupFocus) match = false;
    if (state.periodFocus !== null && el.period !== state.periodFocus) match = false;
    if (ranking && !rankOf.has(el.z)) match = false;

    const v: ElementVisual = {
      dim: focusActive && !match,
      emphasis: focusActive && match,
      undiscovered: timelineActive && discoveryYear(el) > (state.timelineYear as number),
      fresh: state.freshlyDiscovered.includes(el.z),
      inCompare: state.compare.includes(el.z),
      favorite: state.favorites.includes(el.z),
      radiationBadge: radiation && el.radioactive,
    };
    if (ranking && rankOf.has(el.z)) v.rank = rankOf.get(el.z);
    if (trendDef && scale) {
      v.trend = scale.intensity.get(el.z) ?? null;
      const raw = trendDef.value(el);
      v.trendLabel = raw === null ? '—' : trendDef.format(raw);
    }
    if (state.panel === 'states') v.matterState = stateAt(el, state.temperatureK);
    map.set(el.z, v);
  }
  return map;
}
