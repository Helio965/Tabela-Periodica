import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { CATEGORIES } from '../data/categories';
import { useStore } from '../state/store';
import type { CategoryId } from '../data/types';
import './legend.css';

/** Largura das bordas esmaecidas da faixa (precisa casar com legend.css). */
const FADE_PX = 28;

/** Rola a faixa só o necessário para a pílula focada ficar fora das bordas esmaecidas. */
function revealPill(track: HTMLElement | null, pill: HTMLElement) {
  if (!track) return;
  const t = track.getBoundingClientRect();
  const p = pill.getBoundingClientRect();
  if (p.left < t.left + FADE_PX) track.scrollLeft -= t.left + FADE_PX - p.left;
  else if (p.right > t.right - FADE_PX) track.scrollLeft += p.right - (t.right - FADE_PX);
}

/**
 * Legenda compacta na base do palco 3D: uma única linha de "pílulas" de
 * categoria (cor + nome + sigla). Passar o mouse/foco destaca a categoria;
 * clicar fixa o destaque. Some nos modos que têm escala própria.
 */
export function Legend() {
  const { state, dispatch } = useStore();
  const hidden = state.panel === 'trends' || state.panel === 'states';
  const trackRef = useRef<HTMLUListElement>(null);
  // Indica se o destaque temporário atual foi criado por esta legenda.
  const ownsHover = useRef(false);
  const [edges, setEdges] = useState({ start: false, end: false });

  const hover = (category: CategoryId | null) => {
    ownsHover.current = category !== null;
    dispatch({ type: 'setLegendHover', category });
  };

  // Ao esconder a legenda, não deixa um destaque "preso" na cena.
  useEffect(() => {
    if (hidden && ownsHover.current) {
      ownsHover.current = false;
      dispatch({ type: 'setLegendHover', category: null });
    }
  }, [hidden, dispatch]);

  // Sombras nas bordas quando há pílulas escondidas + rolagem horizontal com a roda do mouse.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const start = track.scrollLeft > 2;
      const end = track.scrollLeft + track.clientWidth < track.scrollWidth - 2;
      setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
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
  }, [hidden]);

  if (hidden) return null;

  const trackClass = ['legend-track', edges.start ? 'fade-start' : '', edges.end ? 'fade-end' : ''].filter(Boolean).join(' ');

  return (
    <div className="legend-bar" role="group" aria-label="Legenda: destacar elementos por categoria">
      <ul className={trackClass} ref={trackRef}>
        {CATEGORIES.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className="chip legend-pill"
              style={{ '--chip-color': c.color } as CSSProperties}
              aria-pressed={state.categoryFocus === c.id}
              aria-label={`${c.label} (sigla ${c.code})`}
              title={c.description}
              onClick={() => dispatch({ type: 'toggleCategoryFocus', category: c.id })}
              onPointerEnter={() => hover(c.id)}
              onPointerLeave={() => hover(null)}
              onFocus={(e) => {
                hover(c.id);
                revealPill(trackRef.current, e.currentTarget);
              }}
              onBlur={() => hover(null)}
            >
              <span className="dot" aria-hidden="true" />
              <span className="legend-pill-label">{c.label}</span>
              <span className="legend-pill-code" aria-hidden="true">
                {c.code}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
