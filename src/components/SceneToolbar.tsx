import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { announce } from '../lib/announce';
import { LAYOUTS } from '../scene/layouts';
import { useStore } from '../state/store';
import type { LayoutId, ResolvedQuality } from '../state/types';
import { Icon } from './Icon';
import '../styles/shell.css';

/** Disposições "planas": arrastar move a vista e a rotação automática fica desligada. */
const FLAT_LAYOUTS: ReadonlySet<LayoutId> = new Set(['table', 'timeline']);
const HINT_STORAGE_KEY = 'tabela-periodica:dica-controles:v1';
/** A dica de mouse só faz sentido em telas largas com mouse/trackpad. */
const DESKTOP_POINTER_QUERY = '(min-width: 901px) and (hover: hover) and (pointer: fine)';

function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );
  const getSnapshot = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

// ---------------------------------------------------------------------------
// Tela cheia (com prefixo webkit para Safari)
// ---------------------------------------------------------------------------
type FullscreenDocument = Document & {
  webkitFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};
type FullscreenElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };

function fullscreenSupported(): boolean {
  if (typeof document === 'undefined') return false;
  const doc = document as FullscreenDocument;
  return Boolean(doc.fullscreenEnabled || doc.webkitFullscreenEnabled);
}

function currentFullscreenElement(): Element | null {
  const doc = document as FullscreenDocument;
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

async function enterFullscreen(el: FullscreenElement) {
  if (el.requestFullscreen) await el.requestFullscreen();
  else await el.webkitRequestFullscreen?.();
}

async function exitFullscreen() {
  const doc = document as FullscreenDocument;
  if (doc.exitFullscreen) await doc.exitFullscreen();
  else await doc.webkitExitFullscreen?.();
}

function readHintDismissed(): boolean {
  try {
    return window.localStorage.getItem(HINT_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function saveHintDismissed() {
  try {
    window.localStorage.setItem(HINT_STORAGE_KEY, '1');
  } catch {
    /* armazenamento indisponível: a dica volta na próxima visita */
  }
}

/**
 * Barra flutuante no topo do palco: escolha da disposição 3D, ferramentas da
 * câmera, tela cheia e alternância entre a cena 3D e a lista acessível.
 */
export function SceneToolbar({ quality }: { quality: ResolvedQuality }) {
  const { state, dispatch } = useStore();
  const wrapRef = useRef<HTMLDivElement>(null);
  const layoutsRef = useRef<HTMLDivElement>(null);
  const isScene = state.viewMode === 'scene';
  const flat = FLAT_LAYOUTS.has(state.layout);
  const desktop = useMediaQuery(DESKTOP_POINTER_QUERY);

  const [fsSupported] = useState(fullscreenSupported);
  const [isFullscreen, setFullscreen] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(readHintDismissed);
  // Esquemas de controle que o visitante já usou (a dica some depois do primeiro uso).
  const [usedSchemes, setUsedSchemes] = useState<{ flat: boolean; orbit: boolean }>({ flat: false, orbit: false });

  const stage = useCallback(() => wrapRef.current?.closest<HTMLElement>('.stage') ?? null, []);

  // Publica a altura da barra no palco (a lista usa para não ficar escondida embaixo dela).
  useEffect(() => {
    const wrap = wrapRef.current;
    const host = stage();
    if (!wrap || !host) return;
    const update = () => host.style.setProperty('--scene-toolbar-h', `${Math.ceil(wrap.offsetHeight)}px`);
    update();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(wrap);
    return () => {
      observer?.disconnect();
      host.style.removeProperty('--scene-toolbar-h');
    };
  }, [stage]);

  // Acompanha a entrada/saída da tela cheia (inclusive pela tecla Esc do navegador).
  useEffect(() => {
    if (!fsSupported) return;
    const onChange = () => setFullscreen(currentFullscreenElement() === stage());
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    };
  }, [fsSupported, stage]);

  // A ficha do elemento fica fora do palco: sai da tela cheia para que ela apareça.
  useEffect(() => {
    if (state.selected !== null && isFullscreen) exitFullscreen().catch(() => undefined);
  }, [state.selected, isFullscreen]);

  // Em telas estreitas, mantém a disposição ativa visível na faixa rolável
  // (rolando só a faixa, sem mexer no palco).
  useEffect(() => {
    const track = layoutsRef.current;
    const btn = track?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!track || !btn || track.scrollWidth <= track.clientWidth) return;
    const pad = 12;
    if (btn.offsetLeft < track.scrollLeft + pad) track.scrollLeft = btn.offsetLeft - pad;
    else if (btn.offsetLeft + btn.offsetWidth > track.scrollLeft + track.clientWidth - pad)
      track.scrollLeft = btn.offsetLeft + btn.offsetWidth - track.clientWidth + pad;
  }, [state.layout, isScene]);

  // Esconde a dica depois que o visitante arrasta ou usa a roda do mouse na cena.
  const showHint = isScene && desktop && !hintDismissed && !(flat ? usedSchemes.flat : usedSchemes.orbit);
  useEffect(() => {
    const host = stage();
    if (!showHint || !host) return;
    const onUse = (e: Event) => {
      if (!(e.target instanceof Element) || !e.target.closest('.scene')) return;
      setUsedSchemes((prev) => ({ ...prev, [flat ? 'flat' : 'orbit']: true }));
    };
    host.addEventListener('pointerdown', onUse);
    host.addEventListener('wheel', onUse, { passive: true });
    return () => {
      host.removeEventListener('pointerdown', onUse);
      host.removeEventListener('wheel', onUse);
    };
  }, [showHint, flat, stage]);

  // Faixa de disposições rolável (telas estreitas): bordas esmaecidas quando há
  // botões escondidos e rolagem horizontal com a roda do mouse. Atualiza o DOM
  // direto, sem re-renderizar.
  useEffect(() => {
    const track = layoutsRef.current;
    if (!track) return;
    const update = () => {
      const start = track.scrollLeft > 2;
      const end = track.scrollLeft + track.clientWidth < track.scrollWidth - 2;
      track.dataset.fade = start && end ? 'both' : start ? 'start' : end ? 'end' : 'none';
    };
    const onWheel = (e: WheelEvent) => {
      if (track.scrollWidth <= track.clientWidth || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      track.scrollLeft += e.deltaY;
    };
    update();
    track.addEventListener('scroll', update, { passive: true });
    track.addEventListener('wheel', onWheel, { passive: false });
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(track);
    return () => {
      track.removeEventListener('scroll', update);
      track.removeEventListener('wheel', onWheel);
      observer?.disconnect();
    };
  }, []);

  const toggleFullscreen = async () => {
    const host = stage();
    if (!host) return;
    try {
      if (currentFullscreenElement()) await exitFullscreen();
      else await enterFullscreen(host);
    } catch {
      announce('Não foi possível ativar a tela cheia neste navegador.');
    }
  };

  const toggleRotate = () => {
    if (flat) {
      announce('A rotação automática funciona apenas nas vistas 3D, como Esfera ou Espiral.');
      return;
    }
    // O estado (aria-pressed) já é anunciado pelos leitores de tela.
    dispatch({ type: 'setAutoRotate', autoRotate: !state.autoRotate });
  };

  const rotating = state.autoRotate && !flat;
  const rotateTitle = flat ? 'Rotação automática: disponível apenas nas vistas 3D' : rotating ? 'Parar rotação automática' : 'Rotação automática';

  return (
    <div className="stb-wrap" ref={wrapRef} data-quality={quality}>
      <div className="stb" role="group" aria-label="Controles da visualização">
        <div className="stb-layouts" ref={layoutsRef} role="group" aria-label="Disposição dos elementos">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              type="button"
              className="stb-layout"
              aria-pressed={isScene && state.layout === l.id}
              title={l.description}
              onClick={() => dispatch({ type: 'setLayout', layout: l.id })}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="stb-tools">
          {isScene ? (
            <>
              <button
                type="button"
                className="stb-tool"
                title="Resetar visualização"
                onClick={() => dispatch({ type: 'resetCamera' })}
              >
                <Icon name="reset" />
                <span className="sr-only">Resetar visualização</span>
              </button>
              <button
                type="button"
                className="stb-tool"
                aria-pressed={rotating}
                aria-disabled={flat || undefined}
                title={rotateTitle}
                onClick={toggleRotate}
              >
                <Icon name="rotate" />
                <span className="sr-only">
                  Rotação automática{flat ? ' (disponível apenas nas vistas 3D)' : ''}
                </span>
              </button>
            </>
          ) : null}
          {fsSupported ? (
            <button
              type="button"
              className="stb-tool"
              aria-pressed={isFullscreen}
              title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
              onClick={toggleFullscreen}
            >
              <Icon name="fullscreen" />
              <span className="sr-only">Tela cheia</span>
            </button>
          ) : null}
          <div className="stb-view" role="group" aria-label="Vista">
            <button
              type="button"
              aria-pressed={isScene}
              title="Vista 3D"
              onClick={() => dispatch({ type: 'setViewMode', viewMode: 'scene' })}
            >
              <Icon name="cube" size={16} />
              <span className="stb-view-label">3D</span>
            </button>
            <button
              type="button"
              aria-pressed={!isScene}
              title="Vista em lista (acessível)"
              onClick={() => dispatch({ type: 'setViewMode', viewMode: 'list' })}
            >
              <Icon name="list" size={16} />
              <span className="stb-view-label">Lista</span>
            </button>
          </div>
        </div>
      </div>

      {showHint ? (
        <p className="stb-hint">
          <span>
            {flat ? 'Arraste para mover • botão direito para girar • role para aproximar' : 'Arraste para girar • role para aproximar'}
          </span>
          <button
            type="button"
            className="stb-hint-close"
            aria-label="Dispensar dica"
            title="Dispensar dica"
            onClick={() => {
              setHintDismissed(true);
              saveHintDismissed();
            }}
          >
            <Icon name="close" size={14} />
          </button>
        </p>
      ) : null}
    </div>
  );
}
