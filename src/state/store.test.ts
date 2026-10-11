import { createElement, type ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ELEMENTS, ELEMENT_BY_SYMBOL } from '../data/elements';
import { MAX_COMPARE } from '../lib/compare';
import { hashFor, initialState, PANEL_SLUGS, parseHash, reducer, StoreProvider, useStore } from './store';
import type { Action, AppState, PanelMode } from './types';

const z = (symbol: string) => ELEMENT_BY_SYMBOL.get(symbol.toLowerCase())!.z;
const base = initialState(() => 0);
const run = (state: AppState, ...actions: Action[]) => actions.reduce(reducer, state);

describe('initialState', () => {
  it('começa na tabela, painel Explorar aberto, sem seleção nem filtros', () => {
    expect(base).toMatchObject({
      layout: 'table',
      viewMode: 'scene',
      panel: 'explore',
      panelOpen: true,
      filters: [],
      selected: null,
      compare: [],
      favorites: [],
      recent: [],
      quality: 'auto',
      temperatureK: 298.15,
      timelineYear: null,
    });
  });

  it('o elemento em destaque é sorteado entre 1 e 118', () => {
    expect(initialState(() => 0).featured).toBe(1);
    expect(initialState(() => 0.999999).featured).toBe(118);
    for (let i = 0; i < 20; i++) {
      const { featured } = initialState();
      expect(featured).toBeGreaterThanOrEqual(1);
      expect(featured).toBeLessThanOrEqual(ELEMENTS.length);
    }
  });
});

describe('reducer: seleção e recentes', () => {
  it('selecionar adiciona aos recentes, do mais novo para o mais antigo', () => {
    const s = run(base, { type: 'select', z: 1 }, { type: 'select', z: 26 });
    expect(s.selected).toBe(26);
    expect(s.recent).toEqual([26, 1]);
  });

  it('não duplica: reabrir um elemento o leva para o início', () => {
    const s = run(base, { type: 'select', z: 1 }, { type: 'select', z: 26 }, { type: 'select', z: 1 });
    expect(s.recent).toEqual([1, 26]);
  });

  it('guarda no máximo 12 recentes', () => {
    const actions: Action[] = Array.from({ length: 20 }, (_, i) => ({ type: 'select', z: i + 1 }));
    const s = run(base, ...actions);
    expect(s.recent).toHaveLength(12);
    expect(s.recent[0]).toBe(20);
    expect(s.recent.at(-1)).toBe(9);
  });

  it('fechar a ficha (null) mantém os recentes; Z inválido também fecha', () => {
    const open = run(base, { type: 'select', z: 8 });
    const closed = reducer(open, { type: 'select', z: null });
    expect(closed.selected).toBeNull();
    expect(closed.recent).toEqual([8]);
    const invalid = reducer(open, { type: 'select', z: 999 });
    expect(invalid.selected).toBeNull();
    expect(invalid.recent).toEqual([8]);
  });

  it('não altera o estado anterior (imutável)', () => {
    const before = structuredClone(base);
    reducer(base, { type: 'select', z: 5 });
    expect(base).toEqual(before);
  });
});

describe('reducer: comparação', () => {
  it('toggleCompare adiciona e remove', () => {
    const added = run(base, { type: 'toggleCompare', z: 6 }, { type: 'toggleCompare', z: 14 });
    expect(added.compare).toEqual([6, 14]);
    expect(reducer(added, { type: 'toggleCompare', z: 6 }).compare).toEqual([14]);
  });

  it(`respeita o limite de ${MAX_COMPARE} elementos`, () => {
    const full = run(base, ...[6, 14, 32, 50].map((n): Action => ({ type: 'toggleCompare', z: n })));
    expect(full.compare).toEqual([6, 14, 32, 50]);
    const extra = reducer(full, { type: 'toggleCompare', z: 82 });
    expect(extra.compare).toEqual([6, 14, 32, 50]);
    expect(extra).toBe(full);
    // Remover continua possível com a lista cheia.
    expect(reducer(full, { type: 'toggleCompare', z: 32 }).compare).toEqual([6, 14, 50]);
  });

  it('ignora números atômicos inválidos', () => {
    expect(reducer(base, { type: 'toggleCompare', z: 0 }).compare).toEqual([]);
    expect(reducer(base, { type: 'toggleCompare', z: 119 }).compare).toEqual([]);
  });

  it('setCompare remove duplicados e inválidos e corta no máximo', () => {
    expect(reducer(base, { type: 'setCompare', z: [6, 6, 14, 999, 32, 50, 82] }).compare).toEqual([6, 14, 32, 50]);
  });
});

describe('reducer: foco, filtros e painéis', () => {
  it('toggleGroup liga/desliga o grupo e limpa o período', () => {
    const withPeriod = reducer(base, { type: 'togglePeriod', period: 3 });
    expect(withPeriod.periodFocus).toBe(3);
    const withGroup = reducer(withPeriod, { type: 'toggleGroup', group: 17 });
    expect(withGroup.groupFocus).toBe(17);
    expect(withGroup.periodFocus).toBeNull();
    expect(reducer(withGroup, { type: 'toggleGroup', group: 17 }).groupFocus).toBeNull();
  });

  it('togglePeriod limpa o grupo', () => {
    const s = run(base, { type: 'toggleGroup', group: 1 }, { type: 'togglePeriod', period: 2 });
    expect(s.periodFocus).toBe(2);
    expect(s.groupFocus).toBeNull();
  });

  it('toggleFilter combina filtros e clearFocus limpa tudo', () => {
    const s = run(
      base,
      { type: 'toggleFilter', filter: 'radioativos' },
      { type: 'toggleFilter', filter: 'naturais' },
      { type: 'toggleCategoryFocus', category: 'actinide' },
      { type: 'setRanking', ranking: { kind: 'heaviest', size: 5 } },
    );
    expect(s.filters).toEqual(['radioativos', 'naturais']);
    expect(reducer(s, { type: 'toggleFilter', filter: 'radioativos' }).filters).toEqual(['naturais']);
    const cleared = reducer(s, { type: 'clearFocus' });
    expect(cleared).toMatchObject({ filters: [], categoryFocus: null, groupFocus: null, periodFocus: null, ranking: null, legendHover: null });
  });

  it('toggleCategoryFocus alterna a mesma categoria', () => {
    const s = reducer(base, { type: 'toggleCategoryFocus', category: 'halogen' });
    expect(s.categoryFocus).toBe('halogen');
    expect(reducer(s, { type: 'toggleCategoryFocus', category: 'halogen' }).categoryFocus).toBeNull();
    expect(reducer(s, { type: 'toggleCategoryFocus', category: 'noble-gas' }).categoryFocus).toBe('noble-gas');
  });

  it('trocar de painel abre o painel e interrompe a reprodução da linha do tempo', () => {
    const playing = run(base, { type: 'setPanel', panel: 'discoveries' }, { type: 'setPlaying', playing: true }, { type: 'setFresh', z: [31] });
    expect(playing.playing).toBe(true);
    const closed = reducer(playing, { type: 'togglePanel', open: false });
    expect(closed.panelOpen).toBe(false);
    const other = reducer(closed, { type: 'setPanel', panel: 'trends' });
    expect(other).toMatchObject({ panel: 'trends', panelOpen: true, playing: false, freshlyDiscovered: [] });
  });

  it('togglePanel sem valor alterna', () => {
    expect(reducer(base, { type: 'togglePanel' }).panelOpen).toBe(false);
    expect(run(base, { type: 'togglePanel' }, { type: 'togglePanel' }).panelOpen).toBe(true);
  });

  it('temperatura nunca fica abaixo do zero absoluto', () => {
    expect(reducer(base, { type: 'setTemperature', kelvin: -50 }).temperatureK).toBe(0);
    expect(reducer(base, { type: 'setTemperature', kelvin: 303 }).temperatureK).toBe(303);
  });

  it('setLayout volta para a cena 3D', () => {
    const list = reducer(base, { type: 'setViewMode', viewMode: 'list' });
    expect(reducer(list, { type: 'setLayout', layout: 'helix' })).toMatchObject({ layout: 'helix', viewMode: 'scene' });
  });

  it('favoritos alternam; resetCamera incrementa o contador; hydrate mescla', () => {
    const fav = run(base, { type: 'toggleFavorite', z: 79 }, { type: 'toggleFavorite', z: 26 });
    expect(fav.favorites).toEqual([79, 26]);
    expect(reducer(fav, { type: 'toggleFavorite', z: 79 }).favorites).toEqual([26]);
    expect(run(base, { type: 'resetCamera' }, { type: 'resetCamera' }).cameraResetToken).toBe(2);
    expect(reducer(base, { type: 'hydrate', state: { selected: 92, panel: 'quiz' } })).toMatchObject({ selected: 92, panel: 'quiz', layout: 'table' });
  });

  it('ação desconhecida devolve o mesmo estado', () => {
    expect(reducer(base, { type: 'nada' } as unknown as Action)).toBe(base);
  });
});

describe('parseHash', () => {
  it('#/elemento/<slug> abre a ficha do elemento', () => {
    expect(parseHash('#/elemento/uranio')).toEqual({ selected: 92 });
    expect(parseHash('#/elemento/ferro')).toEqual({ selected: 26 });
  });

  it('aceita símbolo, número atômico e nome com acento', () => {
    expect(parseHash('#/elemento/U')).toEqual({ selected: 92 });
    expect(parseHash('#/elemento/92')).toEqual({ selected: 92 });
    expect(parseHash('#/elemento/ur%C3%A2nio')).toEqual({ selected: 92 });
    expect(parseHash('#/elemento/Urânio')).toEqual({ selected: 92 });
  });

  it('elemento inexistente não muda nada', () => {
    expect(parseHash('#/elemento/xyz')).toEqual({});
    expect(parseHash('#/elemento/0')).toEqual({});
    expect(parseHash('#/elemento/119')).toEqual({});
  });

  it('#/comparar/c,si,ge abre a comparação', () => {
    expect(parseHash('#/comparar/c,si,ge')).toEqual({ compare: [6, 14, 32], panel: 'compare', panelOpen: true });
  });

  it('comparação ignora inválidos e duplicados e respeita o máximo', () => {
    expect(parseHash('#/comparar/C, Si ,xx,ge').compare).toEqual([6, 14, 32]);
    expect(parseHash('#/comparar/c,c,si').compare).toEqual([6, 14]);
    expect(parseHash('#/comparar/h,he,li,be,b,c').compare).toEqual([1, 2, 3, 4]);
    expect(parseHash('#/comparar/carbono,silicio').compare).toEqual([6, 14]);
  });

  it('#/modo/<painel> abre o painel', () => {
    expect(parseHash('#/modo/descobertas')).toEqual({ panel: 'discoveries', panelOpen: true });
    expect(parseHash('#/modo/tendencias')).toEqual({ panel: 'trends', panelOpen: true });
    expect(parseHash('#/modo/tend%C3%AAncias')).toEqual({ panel: 'trends', panelOpen: true });
    for (const [panel, slug] of Object.entries(PANEL_SLUGS)) {
      expect(parseHash(`#/modo/${slug}`)).toEqual({ panel, panelOpen: true });
    }
  });

  it('rotas desconhecidas, vazias ou malformadas são ignoradas sem erro', () => {
    expect(parseHash('')).toEqual({});
    expect(parseHash('#')).toEqual({});
    expect(parseHash('#/')).toEqual({});
    expect(parseHash('#/modo/inexistente')).toEqual({});
    expect(parseHash('#/modo/constructor')).toEqual({});
    expect(parseHash('#/outra/coisa')).toEqual({});
    expect(() => parseHash('#/elemento/%E0%A4%A')).not.toThrow();
  });
});

describe('hashFor', () => {
  it('gera as rotas esperadas', () => {
    expect(hashFor({ selected: 92, compare: [], panel: 'explore' })).toBe('#/elemento/uranio');
    expect(hashFor({ selected: null, compare: [6, 14, 32], panel: 'compare' })).toBe('#/comparar/c,si,ge');
    expect(hashFor({ selected: null, compare: [], panel: 'discoveries' })).toBe('#/modo/descobertas');
    expect(hashFor({ selected: null, compare: [], panel: 'explore' })).toBe('');
  });

  it('a ficha aberta tem prioridade sobre o painel', () => {
    expect(hashFor({ selected: 26, compare: [6, 14], panel: 'compare' })).toBe('#/elemento/ferro');
  });

  it('painel de comparação vazio vira #/modo/comparar', () => {
    expect(hashFor({ selected: null, compare: [], panel: 'compare' })).toBe('#/modo/comparar');
  });

  it('ida e volta: todos os elementos', () => {
    for (const el of ELEMENTS) {
      expect(parseHash(hashFor({ selected: el.z, compare: [], panel: 'explore' })).selected, el.symbol).toBe(el.z);
    }
  });

  it('ida e volta: comparação e painéis', () => {
    const compare = [z('C'), z('Si'), z('Ge'), z('Sn')];
    expect(parseHash(hashFor({ selected: null, compare, panel: 'compare' }))).toEqual({ compare, panel: 'compare', panelOpen: true });
    for (const panel of Object.keys(PANEL_SLUGS) as PanelMode[]) {
      if (panel === 'explore') continue;
      expect(parseHash(hashFor({ selected: null, compare: [], panel })).panel).toBe(panel);
    }
  });
});

describe('StoreProvider', () => {
  const STORAGE_KEY = 'tabela-periodica:prefs:v1';
  const wrapper = ({ children }: { children: ReactNode }) => createElement(StoreProvider, null, children);

  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
  });
  afterEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
  });

  it('useStore fora do provider lança um erro explicativo', () => {
    expect(() => renderHook(() => useStore())).toThrow(/StoreProvider/);
  });

  it('lê o estado inicial da URL', () => {
    window.history.replaceState(null, '', '/#/comparar/c,si,ge');
    const { result } = renderHook(() => useStore(), { wrapper });
    expect(result.current.state.compare).toEqual([6, 14, 32]);
    expect(result.current.state.panel).toBe('compare');
  });

  it('atualiza a URL quando o estado muda', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => result.current.dispatch({ type: 'select', z: 92 }));
    expect(window.location.hash).toBe('#/elemento/uranio');
    act(() => result.current.dispatch({ type: 'select', z: null }));
    act(() => result.current.dispatch({ type: 'setPanel', panel: 'quiz' }));
    expect(window.location.hash).toBe('#/modo/quiz');
  });

  it('reage à mudança de hash (links e botão voltar)', () => {
    const { result } = renderHook(() => useStore(), { wrapper });
    act(() => {
      window.history.replaceState(null, '', '/#/elemento/ferro');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(result.current.state.selected).toBe(26);
  });

  it('salva e recupera favoritos, recentes e qualidade', () => {
    const first = renderHook(() => useStore(), { wrapper });
    act(() => {
      first.result.current.dispatch({ type: 'toggleFavorite', z: 79 });
      first.result.current.dispatch({ type: 'select', z: 8 });
      first.result.current.dispatch({ type: 'setQuality', quality: 'low' });
    });
    first.unmount();
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    expect(saved).toMatchObject({ favorites: [79], recent: [8], quality: 'low' });

    window.history.replaceState(null, '', '/');
    const second = renderHook(() => useStore(), { wrapper });
    expect(second.result.current.state.favorites).toEqual([79]);
    expect(second.result.current.state.recent).toEqual([8]);
    expect(second.result.current.state.quality).toBe('low');
  });

  it('ignora preferências salvas inválidas ou corrompidas', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ favorites: [1, 999, -3], recent: 'x', quality: 'ultra' }));
    const { result } = renderHook(() => useStore(), { wrapper });
    expect(result.current.state.favorites).toEqual([1]);
    expect(result.current.state.recent).toEqual([]);
    expect(result.current.state.quality).toBe('auto');

    window.localStorage.setItem(STORAGE_KEY, '{não é json');
    const broken = renderHook(() => useStore(), { wrapper });
    expect(broken.result.current.state.favorites).toEqual([]);
  });
});
