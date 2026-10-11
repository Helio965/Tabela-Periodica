import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';
import { ELEMENT_BY_SLUG, ELEMENT_BY_SYMBOL, ELEMENT_BY_Z, ELEMENTS } from '../data/elements';
import { MAX_COMPARE } from '../lib/compare';
import type { Action, AppState, LayoutId, PanelMode, Quality } from './types';

const STORAGE_KEY = 'tabela-periodica:prefs:v1';
const MAX_RECENT = 12;

export const PANEL_SLUGS: Record<PanelMode, string> = {
  explore: 'explorar',
  discoveries: 'descobertas',
  trends: 'tendencias',
  states: 'estados',
  compare: 'comparar',
  learn: 'aprender',
  history: 'historia',
  sources: 'fontes',
  quiz: 'quiz',
};
const PANEL_BY_SLUG = Object.fromEntries(Object.entries(PANEL_SLUGS).map(([k, v]) => [v, k])) as Record<string, PanelMode>;

export function initialState(random: () => number = Math.random): AppState {
  return {
    layout: 'table',
    viewMode: 'scene',
    panel: 'explore',
    panelOpen: true,
    filters: [],
    legendHover: null,
    categoryFocus: null,
    groupFocus: null,
    periodFocus: null,
    ranking: null,
    trend: 'electronegativity',
    temperatureK: 298.15,
    timelineYear: null,
    playing: false,
    freshlyDiscovered: [],
    discoveriesGroupBy: 'periodo',
    selected: null,
    compare: [],
    favorites: [],
    recent: [],
    quality: 'auto',
    autoRotate: false,
    pointed: null,
    showFeatured: true,
    featured: 1 + Math.floor(random() * ELEMENTS.length),
    cameraResetToken: 0,
  };
}

const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'setLayout':
      return { ...state, layout: action.layout, viewMode: 'scene' };
    case 'setViewMode':
      return { ...state, viewMode: action.viewMode };
    case 'setPanel':
      return {
        ...state,
        panel: action.panel,
        panelOpen: true,
        playing: action.panel === 'discoveries' ? state.playing : false,
        freshlyDiscovered: action.panel === 'discoveries' ? state.freshlyDiscovered : [],
      };
    case 'togglePanel':
      return { ...state, panelOpen: action.open ?? !state.panelOpen };
    case 'toggleFilter':
      return { ...state, filters: toggle(state.filters, action.filter) };
    case 'setFilters':
      return { ...state, filters: action.filters };
    case 'clearFocus':
      return { ...state, filters: [], categoryFocus: null, groupFocus: null, periodFocus: null, ranking: null, legendHover: null };
    case 'setLegendHover':
      return { ...state, legendHover: action.category };
    case 'toggleCategoryFocus':
      return { ...state, categoryFocus: state.categoryFocus === action.category ? null : action.category };
    case 'toggleGroup':
      return { ...state, groupFocus: state.groupFocus === action.group ? null : action.group, periodFocus: null };
    case 'togglePeriod':
      return { ...state, periodFocus: state.periodFocus === action.period ? null : action.period, groupFocus: null };
    case 'setRanking':
      return { ...state, ranking: action.ranking };
    case 'setTrend':
      return { ...state, trend: action.trend };
    case 'setTemperature':
      return { ...state, temperatureK: Math.max(0, action.kelvin) };
    case 'setTimelineYear':
      return { ...state, timelineYear: action.year };
    case 'setPlaying':
      return { ...state, playing: action.playing };
    case 'setFresh':
      return { ...state, freshlyDiscovered: action.z };
    case 'setGroupBy':
      return { ...state, discoveriesGroupBy: action.groupBy };
    case 'select': {
      if (action.z === null || !ELEMENT_BY_Z.has(action.z)) return { ...state, selected: null };
      const recent = [action.z, ...state.recent.filter((z) => z !== action.z)].slice(0, MAX_RECENT);
      return { ...state, selected: action.z, recent };
    }
    case 'toggleCompare': {
      if (state.compare.includes(action.z)) return { ...state, compare: state.compare.filter((z) => z !== action.z) };
      if (state.compare.length >= MAX_COMPARE) return state;
      return { ...state, compare: [...state.compare, action.z] };
    }
    case 'setCompare':
      return { ...state, compare: [...new Set(action.z)].filter((z) => ELEMENT_BY_Z.has(z)).slice(0, MAX_COMPARE) };
    case 'toggleFavorite':
      return { ...state, favorites: toggle(state.favorites, action.z) };
    case 'setQuality':
      return { ...state, quality: action.quality };
    case 'setAutoRotate':
      return { ...state, autoRotate: action.autoRotate };
    case 'point':
      return { ...state, pointed: action.z };
    case 'dismissFeatured':
      return { ...state, showFeatured: false };
    case 'resetCamera':
      return { ...state, cameraResetToken: state.cameraResetToken + 1 };
    case 'hydrate':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Persistência (preferências do visitante) — sempre protegida por try/catch.
// ---------------------------------------------------------------------------
interface Persisted {
  favorites?: number[];
  recent?: number[];
  quality?: Quality;
  layout?: LayoutId;
  autoRotate?: boolean;
}

function loadPersisted(): Partial<AppState> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw) as Persisted;
    const valid = (list?: number[]) => (Array.isArray(list) ? list.filter((z) => ELEMENT_BY_Z.has(z)) : []);
    return {
      favorites: valid(data.favorites),
      recent: valid(data.recent).slice(0, MAX_RECENT),
      quality: data.quality ?? 'auto',
      autoRotate: Boolean(data.autoRotate),
    };
  } catch {
    return {};
  }
}

function savePersisted(state: AppState) {
  try {
    const data: Persisted = { favorites: state.favorites, recent: state.recent, quality: state.quality, autoRotate: state.autoRotate };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* armazenamento indisponível: preferências ficam só na sessão */
  }
}

// ---------------------------------------------------------------------------
// Rotas por hash: #/elemento/uranio · #/comparar/c,si,ge · #/modo/descobertas
// ---------------------------------------------------------------------------
export function parseHash(hash: string): Partial<AppState> {
  const parts = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  const [route, arg] = parts;
  if (route === 'elemento' && arg) {
    const el = ELEMENT_BY_SLUG.get(arg.toLowerCase()) ?? ELEMENT_BY_SYMBOL.get(arg.toLowerCase()) ?? ELEMENT_BY_Z.get(Number(arg));
    return el ? { selected: el.z } : {};
  }
  if (route === 'comparar' && arg) {
    const z = arg
      .split(',')
      .map((s) => ELEMENT_BY_SYMBOL.get(s.trim().toLowerCase())?.z ?? ELEMENT_BY_SLUG.get(s.trim().toLowerCase())?.z)
      .filter((x): x is number => x !== undefined);
    return { compare: z.slice(0, MAX_COMPARE), panel: 'compare', panelOpen: true };
  }
  if (route === 'modo' && arg && PANEL_BY_SLUG[arg]) {
    return { panel: PANEL_BY_SLUG[arg], panelOpen: true };
  }
  return {};
}

export function hashFor(state: Pick<AppState, 'selected' | 'compare' | 'panel'>): string {
  if (state.selected) {
    const el = ELEMENT_BY_Z.get(state.selected);
    if (el) return `#/elemento/${el.slug}`;
  }
  if (state.panel === 'compare' && state.compare.length) {
    return `#/comparar/${state.compare.map((z) => ELEMENT_BY_Z.get(z)!.symbol.toLowerCase()).join(',')}`;
  }
  if (state.panel !== 'explore') return `#/modo/${PANEL_SLUGS[state.panel]}`;
  return '';
}

// ---------------------------------------------------------------------------
// Contexto React
// ---------------------------------------------------------------------------
interface Store {
  state: AppState;
  dispatch: Dispatch<Action>;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children, initial }: { children: ReactNode; initial?: Partial<AppState> }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const base = initialState();
    if (typeof window === 'undefined') return { ...base, ...initial };
    return { ...base, ...loadPersisted(), ...parseHash(window.location.hash), ...initial };
  });

  useEffect(() => savePersisted(state), [state.favorites, state.recent, state.quality, state.autoRotate]);

  // Estado → URL (sem empilhar entradas de histórico a cada clique).
  useEffect(() => {
    const next = hashFor(state);
    if (next !== window.location.hash && !(next === '' && window.location.hash === '')) {
      const url = `${window.location.pathname}${window.location.search}${next}`;
      window.history.replaceState(null, '', url);
    }
  }, [state.selected, state.compare, state.panel]);

  // URL → estado (links compartilhados e botão voltar).
  useEffect(() => {
    const onHash = () => {
      const parsed = parseHash(window.location.hash);
      dispatch({ type: 'hydrate', state: { selected: null, ...parsed } });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore precisa estar dentro de <StoreProvider>');
  return ctx;
}
