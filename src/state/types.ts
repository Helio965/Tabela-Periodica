import type { CategoryId } from '../data/types';
import type { FilterId } from '../lib/filters';
import type { RankingKind, RankingSize } from '../lib/ranking';
import type { TrendId } from '../lib/trends';
import type { GroupBy } from '../lib/timeline';

/** Disposições espaciais dos 118 cartões na cena 3D. */
export type LayoutId = 'table' | 'sphere' | 'cylinder' | 'helix' | 'layers' | 'grid' | 'timeline';

/** Painéis/modos de exploração da barra lateral. */
export type PanelMode =
  | 'explore'
  | 'discoveries'
  | 'trends'
  | 'states'
  | 'compare'
  | 'learn'
  | 'history'
  | 'sources'
  | 'quiz';

export type Quality = 'auto' | 'low' | 'medium' | 'high';
export type ResolvedQuality = Exclude<Quality, 'auto'>;

export interface RankingState {
  kind: RankingKind;
  size: RankingSize;
}

export interface AppState {
  layout: LayoutId;
  /** "scene" = cena 3D; "list" = lista de cartões acessível (útil no celular). */
  viewMode: 'scene' | 'list';
  panel: PanelMode;
  /** Painel lateral aberto (no celular vira uma "gaveta" inferior). */
  panelOpen: boolean;

  /** Filtros combinados (E lógico). Vazio = todos. */
  filters: FilterId[];
  /** Categoria sob o mouse na legenda (destaque temporário). */
  legendHover: CategoryId | null;
  /** Categoria fixada ao clicar na legenda. */
  categoryFocus: CategoryId | null;
  /** Grupo (coluna) ou período (linha) destacados ao clicar nos números da tabela. */
  groupFocus: number | null;
  periodFocus: number | null;
  ranking: RankingState | null;

  trend: TrendId;
  /** Temperatura (K) usada no modo "Estado da matéria". */
  temperatureK: number;

  /** Ano da linha do tempo no modo "Descobertas"; `null` = todos os elementos. */
  timelineYear: number | null;
  /** Reprodução automática da evolução histórica. */
  playing: boolean;
  /** Elementos que acabaram de "surgir" na reprodução (para animação/anúncio). */
  freshlyDiscovered: number[];
  discoveriesGroupBy: GroupBy;

  /** Elemento com a ficha aberta. */
  selected: number | null;
  /** Elementos na comparação (2 a 4). */
  compare: number[];
  favorites: number[];
  recent: number[];

  quality: Quality;
  autoRotate: boolean;
  /** Elemento destacado por foco/hover vindo da busca ou de listas. */
  pointed: number | null;
  /** Mostra o "Elemento em destaque" (dispensável). */
  showFeatured: boolean;
  featured: number;
  /** Incrementado para pedir à cena que reposicione a câmera. */
  cameraResetToken: number;
}

export type Action =
  | { type: 'setLayout'; layout: LayoutId }
  | { type: 'setViewMode'; viewMode: AppState['viewMode'] }
  | { type: 'setPanel'; panel: PanelMode }
  | { type: 'togglePanel'; open?: boolean }
  | { type: 'toggleFilter'; filter: FilterId }
  | { type: 'setFilters'; filters: FilterId[] }
  | { type: 'clearFocus' }
  | { type: 'setLegendHover'; category: CategoryId | null }
  | { type: 'toggleCategoryFocus'; category: CategoryId }
  | { type: 'toggleGroup'; group: number }
  | { type: 'togglePeriod'; period: number }
  | { type: 'setRanking'; ranking: RankingState | null }
  | { type: 'setTrend'; trend: AppState['trend'] }
  | { type: 'setTemperature'; kelvin: number }
  | { type: 'setTimelineYear'; year: number | null }
  | { type: 'setPlaying'; playing: boolean }
  | { type: 'setFresh'; z: number[] }
  | { type: 'setGroupBy'; groupBy: GroupBy }
  | { type: 'select'; z: number | null }
  | { type: 'toggleCompare'; z: number }
  | { type: 'setCompare'; z: number[] }
  | { type: 'toggleFavorite'; z: number }
  | { type: 'setQuality'; quality: Quality }
  | { type: 'setAutoRotate'; autoRotate: boolean }
  | { type: 'point'; z: number | null }
  | { type: 'dismissFeatured' }
  | { type: 'resetCamera' }
  | { type: 'hydrate'; state: Partial<AppState> };
