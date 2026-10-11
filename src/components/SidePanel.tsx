import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { useStore } from '../state/store';
import type { PanelMode } from '../state/types';
import { Icon } from './Icon';

/** Props comuns recebidas por todos os painéis. */
export interface PanelProps {
  /** Abre a ficha completa de um elemento. */
  openElement: (z: number) => void;
  /** Destaca temporariamente um elemento na cena (ex.: hover em listas). */
  pointElement: (z: number | null) => void;
}

export const PANEL_TITLES: Record<PanelMode, string> = {
  explore: 'Explorar elementos',
  discoveries: 'Descobertas',
  trends: 'Tendências periódicas',
  states: 'Estado da matéria',
  compare: 'Comparar elementos',
  learn: 'Aprender',
  history: 'História da Tabela Periódica',
  sources: 'Fontes científicas',
  quiz: 'Quiz: qual é o elemento?',
};

// Os painéis são carregados sob demanda (lazy loading) para deixar a abertura leve.
const PANELS: Record<PanelMode, LazyExoticComponent<ComponentType<PanelProps>>> = {
  explore: lazy(() => import('../panels/ExplorePanel')),
  discoveries: lazy(() => import('../panels/DiscoveriesPanel')),
  trends: lazy(() => import('../panels/TrendsPanel')),
  states: lazy(() => import('../panels/StatesPanel')),
  compare: lazy(() => import('../panels/ComparePanel')),
  learn: lazy(() => import('../panels/LearnPanel')),
  history: lazy(() => import('../panels/HistoryPanel')),
  sources: lazy(() => import('../panels/SourcesPanel')),
  quiz: lazy(() => import('../panels/QuizPanel')),
};

export function SidePanel(props: PanelProps) {
  const { state, dispatch } = useStore();
  const Panel = PANELS[state.panel];
  return (
    <aside className="side-panel" aria-labelledby="side-panel-title" id="painel">
      <div className="side-panel-head">
        <button
          type="button"
          className="side-panel-grip"
          aria-expanded={state.panelOpen}
          aria-controls="side-panel-body"
          onClick={() => dispatch({ type: 'togglePanel' })}
        >
          <span id="side-panel-title">{PANEL_TITLES[state.panel]}</span>
          <Icon name="chevronDown" className="grip-icon" />
          <span className="sr-only">{state.panelOpen ? 'Recolher painel' : 'Expandir painel'}</span>
        </button>
      </div>
      <div className="side-panel-body" id="side-panel-body">
        <Suspense fallback={<p className="muted">Carregando…</p>}>
          <Panel {...props} />
        </Suspense>
      </div>
    </aside>
  );
}
