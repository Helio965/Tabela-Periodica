import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { ELEMENTS, ELEMENT_BY_Z } from '../data/elements';
import type { ChemicalElement } from '../data/types';
import { ElementCard } from '../components/ElementCard';
import type { VisualMap } from '../lib/visuals';
import type { LayoutId, ResolvedQuality } from '../state/types';
import { SceneEngine } from './engine';
import type { LabelPlacement } from './layouts';

export interface PeriodicSceneProps {
  layout: LayoutId;
  visuals: VisualMap;
  quality: ResolvedQuality;
  autoRotate: boolean;
  groupFocus: number | null;
  periodFocus: number | null;
  cameraResetToken: number;
  /** Elemento a trazer para a vista (ex.: escolhido na busca). */
  pointed: number | null;
  onActivate: (z: number) => void;
  onHover: (z: number | null) => void;
  onGroup: (group: number) => void;
  onPeriod: (period: number) => void;
  /** Recebe a função que informa a posição de um cartão na tela (para o tooltip). */
  registerLocator?: (fn: (z: number) => { x: number; y: number; visible: boolean } | null) => void;
  /** Notifica a cada quadro renderizado. */
  onFrame?: () => void;
}

interface Hosts {
  cards: Array<{ el: ChemicalElement; host: HTMLDivElement }>;
  labels: Array<{ label: LabelPlacement; host: HTMLDivElement }>;
}

/** Vizinho de um elemento para navegação por setas no formato de tabela. */
function tableNeighbor(z: number, key: string): number | null {
  const el = ELEMENT_BY_Z.get(z)!;
  const at = (row: number, col: number) => ELEMENTS.find((e) => e.gridRow === row && e.gridColumn === col);
  const rows = [1, 2, 3, 4, 5, 6, 7, 9, 10];
  if (key === 'ArrowLeft' || key === 'ArrowRight') {
    const step = key === 'ArrowLeft' ? -1 : 1;
    for (let c = el.gridColumn + step; c >= 1 && c <= 18; c += step) {
      const n = at(el.gridRow, c);
      if (n) return n.z;
    }
    return null;
  }
  const idx = rows.indexOf(el.gridRow);
  const step = key === 'ArrowUp' ? -1 : 1;
  for (let i = idx + step; i >= 0 && i < rows.length; i += step) {
    const n = at(rows[i], el.gridColumn);
    if (n) return n.z;
  }
  return null;
}

export function PeriodicScene(props: PeriodicSceneProps) {
  const { layout, visuals, quality, autoRotate, groupFocus, periodFocus, cameraResetToken, pointed } = props;
  const mountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<SceneEngine | null>(null);
  const [hosts, setHosts] = useState<Hosts | null>(null);
  const [focusZ, setFocusZ] = useState(1);
  const callbacks = useRef(props);
  callbacks.current = props;

  // Cria o motor uma única vez.
  useEffect(() => {
    const engine = new SceneEngine(mountRef.current!, ELEMENTS, {
      onCardActivate: (z) => callbacks.current.onActivate(z),
      onLabelActivate: (label) => {
        if (label.kind === 'group' && label.value) callbacks.current.onGroup(label.value);
        if (label.kind === 'period' && label.value) callbacks.current.onPeriod(label.value);
      },
      onFrame: () => callbacks.current.onFrame?.(),
    });
    engineRef.current = engine;
    setHosts({
      cards: [...engine.cards.values()].map(({ el, host }) => ({ el, host })),
      labels: [...engine.labels.values()].map(({ label, host }) => ({ label, host })),
    });
    callbacks.current.registerLocator?.((z) => engine.screenPosition(z));
    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current?.setQuality(quality);
  }, [quality]);

  useEffect(() => {
    engineRef.current?.setLayout(layout, { animate: quality !== 'low' || layout !== 'table' });
  }, [layout]);

  useEffect(() => {
    engineRef.current?.setAutoRotate(autoRotate);
  }, [autoRotate]);

  useEffect(() => {
    if (cameraResetToken) engineRef.current?.resetCamera();
  }, [cameraResetToken]);

  useEffect(() => {
    if (pointed) engineRef.current?.ensureVisible(pointed);
  }, [pointed]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const z = Number(target.closest<HTMLElement>('[data-z]')?.dataset.z);
      if (!z) return;
      let next: number | null = null;
      const flat = layout === 'table' || layout === 'layers';
      if (e.key.startsWith('Arrow')) {
        if (flat) next = tableNeighbor(z, e.key);
        else next = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? z - 1 : z + 1;
      } else if (e.key === 'Home') next = 1;
      else if (e.key === 'End') next = 118;
      if (next === null || next < 1 || next > 118) return;
      e.preventDefault();
      setFocusZ(next);
      const btn = mountRef.current?.querySelector<HTMLButtonElement>(`button[data-z="${next}"]`);
      btn?.focus({ preventScroll: true });
      engineRef.current?.ensureVisible(next);
    },
    [layout],
  );

  return (
    <div
      ref={mountRef}
      className={`scene layout-${layout}`}
      onKeyDown={onKeyDown}
      role="application"
      aria-roledescription="tabela periódica interativa"
      aria-label="Tabela periódica: use as setas para navegar entre os elementos e Enter para abrir a ficha"
    >
      {hosts?.cards.map(({ el, host }) =>
        createPortal(
          <ElementCard
            element={el}
            visual={visuals.get(el.z)!}
            tabbable={el.z === focusZ}
            onActivate={props.onActivate}
            onHover={props.onHover}
          />,
          host,
          `card-${el.z}`,
        ),
      )}
      {hosts?.labels.map(({ label, host }) =>
        createPortal(
          label.kind === 'group' || label.kind === 'period' ? (
            <span
              className={`scene-label is-clickable${
                (label.kind === 'group' && groupFocus === label.value) || (label.kind === 'period' && periodFocus === label.value)
                  ? ' is-active'
                  : ''
              }`}
              title={label.kind === 'group' ? `Destacar o grupo ${label.text}` : `Destacar o período ${label.text}`}
            >
              {label.text}
            </span>
          ) : (
            <span className="scene-label">
              <span className="sl-text">{label.text}</span>
              {label.sub ? <span className="sl-sub">{label.sub}</span> : null}
            </span>
          ),
          host,
          `label-${label.id}`,
        ),
      )}
    </div>
  );
}
