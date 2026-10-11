import { lazy, Suspense, useCallback, useMemo, useRef, useState } from 'react';
import { PeriodicScene } from './scene/PeriodicScene';
import { useStore } from './state/store';
import { computeVisuals } from './lib/visuals';
import { resolveQuality } from './lib/quality';
import { announce } from './lib/announce';
import { getElement } from './data/elements';
import { MAX_COMPARE } from './lib/compare';
import { Header } from './components/Header';
import { SceneToolbar } from './components/SceneToolbar';
import { Legend } from './components/Legend';
import { Tooltip } from './components/Tooltip';
import { ListView } from './components/ListView';
import { FeaturedElement } from './components/FeaturedElement';
import { Starfield } from './components/Starfield';
import { SidePanel } from './components/SidePanel';
import { Announcer } from './components/Announcer';

// A ficha completa (com os textos longos) é carregada só quando necessária.
const ElementSheet = lazy(() => import('./sheet/ElementSheet'));

type Locator = (z: number) => { x: number; y: number; visible: boolean } | null;

export function App() {
  const { state, dispatch } = useStore();
  const [hovered, setHovered] = useState<number | null>(null);
  const locatorRef = useRef<Locator | null>(null);
  const quality = useMemo(() => resolveQuality(state.quality), [state.quality]);

  const visuals = useMemo(
    () => computeVisuals(state),
    // Recalcula apenas quando algo que afeta a aparência dos cartões muda.
    [
      state.filters,
      state.legendHover,
      state.categoryFocus,
      state.groupFocus,
      state.periodFocus,
      state.ranking,
      state.panel,
      state.trend,
      state.temperatureK,
      state.timelineYear,
      state.freshlyDiscovered,
      state.compare,
      state.favorites,
    ],
  );

  const openElement = useCallback((z: number) => dispatch({ type: 'select', z }), [dispatch]);
  const pointElement = useCallback(
    (z: number | null) => {
      setHovered(z);
      if (z !== null) dispatch({ type: 'point', z });
    },
    [dispatch],
  );

  const panel = state.panel;
  const compareCount = state.compare.length;
  const inCompare = state.compare;
  const onActivate = useCallback(
    (z: number) => {
      if (panel === 'compare') {
        const el = getElement(z);
        if (inCompare.includes(z)) {
          dispatch({ type: 'toggleCompare', z });
          announce(`${el.name} removido da comparação`);
        } else if (compareCount >= MAX_COMPARE) {
          announce(`Compare no máximo ${MAX_COMPARE} elementos`);
        } else {
          dispatch({ type: 'toggleCompare', z });
          announce(`${el.name} adicionado à comparação`);
        }
        return;
      }
      dispatch({ type: 'select', z });
    },
    [panel, compareCount, inCompare, dispatch],
  );

  return (
    <div className={`app${state.panelOpen ? '' : ' panel-closed'}`}>
      <a className="skip-link" href="#painel">
        Pular para o painel
      </a>
      <Header />
      <main className="app-main">
        <section className="stage" aria-label="Visualização dos elementos">
          {state.viewMode === 'scene' ? (
            <>
              <Starfield quality={quality} />
              <PeriodicScene
                layout={state.layout}
                visuals={visuals}
                quality={quality}
                autoRotate={state.autoRotate}
                groupFocus={state.groupFocus}
                periodFocus={state.periodFocus}
                cameraResetToken={state.cameraResetToken}
                pointed={state.pointed}
                onActivate={onActivate}
                onHover={setHovered}
                onGroup={(group) => dispatch({ type: 'toggleGroup', group })}
                onPeriod={(period) => dispatch({ type: 'togglePeriod', period })}
                registerLocator={(fn) => {
                  locatorRef.current = fn;
                }}
              />
              {hovered !== null && locatorRef.current ? <Tooltip z={hovered} locate={locatorRef.current} /> : null}
            </>
          ) : (
            <ListView visuals={visuals} onActivate={onActivate} />
          )}
          <SceneToolbar quality={quality} />
          <Legend />
          {state.showFeatured && state.viewMode === 'scene' ? (
            <FeaturedElement z={state.featured} onOpen={openElement} onDismiss={() => dispatch({ type: 'dismissFeatured' })} />
          ) : null}
          <Announcer />
        </section>
        <SidePanel openElement={openElement} pointElement={pointElement} />
      </main>
      {state.selected !== null ? (
        <Suspense fallback={null}>
          <ElementSheet z={state.selected} onClose={() => dispatch({ type: 'select', z: null })} onNavigate={openElement} />
        </Suspense>
      ) : null}
    </div>
  );
}
