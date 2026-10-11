import { useEffect, useRef, type CSSProperties } from 'react';
import { CATEGORY_BY_ID } from '../data/categories';
import { ELEMENT_BY_Z } from '../data/elements';
import { formatMass } from '../lib/format';
import '../styles/shell.css';

export interface TooltipProps {
  z: number;
  locate: (z: number) => { x: number; y: number; visible: boolean } | null;
}

/** Distância entre o cartão e a dica (px). */
const GAP = 10;
/** Margem mínima até as bordas do palco (px). */
const EDGE = 8;
/** Faixa do topo reservada à barra de ferramentas, se ela não informar a própria altura (px). */
const TOP_ZONE = 64;

/**
 * Dica flutuante sobre o cartão sob o mouse/foco. A posição é atualizada a
 * cada quadro por `requestAnimationFrame`, direto no DOM (sem re-renderizar o
 * React), para acompanhar a câmera enquanto ela se move.
 */
export function Tooltip({ z, locate }: TooltipProps) {
  const ref = useRef<HTMLDivElement>(null);
  const el = ELEMENT_BY_Z.get(z);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let raf = 0;
    let lastTransform = '';
    let lastVisible: boolean | null = null;

    const setVisible = (visible: boolean) => {
      if (visible === lastVisible) return;
      lastVisible = visible;
      node.dataset.visible = visible ? 'true' : 'false';
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const stage = node.offsetParent as HTMLElement | null;
      const p = locate(z);
      if (!stage || !p || !p.visible) {
        setVisible(false);
        return;
      }
      const sw = stage.clientWidth;
      const sh = stage.clientHeight;
      const w = node.offsetWidth;
      const h = node.offsetHeight;

      // Bordas reais do cartão na tela (a escala muda com o zoom da câmera).
      let top = p.y - 40;
      let bottom = p.y + 40;
      const card = stage.querySelector<HTMLElement>(`.scene .element-card[data-z="${z}"]`);
      if (card) {
        const r = card.getBoundingClientRect();
        const s = stage.getBoundingClientRect();
        if (r.height > 0) {
          top = r.top - s.top;
          bottom = r.bottom - s.top;
        }
      }

      // Acima do cartão; perto do topo (barra de ferramentas), vira para baixo. Sempre dentro do palco.
      const toolbarH = parseFloat(stage.style.getPropertyValue('--scene-toolbar-h'));
      const topZone = Number.isFinite(toolbarH) ? toolbarH + 16 : TOP_ZONE;
      let y = top - GAP - h;
      if (y < topZone) y = bottom + GAP;
      y = Math.min(Math.max(y, EDGE), Math.max(EDGE, sh - h - EDGE));
      const x = Math.min(Math.max(p.x - w / 2, EDGE), Math.max(EDGE, sw - w - EDGE));
      const outside = p.x < 0 || p.x > sw || p.y < 0 || p.y > sh;

      const transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
      if (transform !== lastTransform) {
        lastTransform = transform;
        node.style.transform = transform;
      }
      setVisible(!outside);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [z, locate]);

  if (!el) return null;
  const cat = CATEGORY_BY_ID[el.category];

  return (
    <div ref={ref} className="scene-tooltip" role="tooltip" data-visible="false" style={{ '--cat': cat.color } as CSSProperties}>
      <span className="tt-symbol" aria-hidden="true">
        {el.symbol}
      </span>
      <span className="tt-body">
        <span className="tt-name">
          {el.name} <span className="tt-sym-text">({el.symbol})</span>
        </span>
        <span className="tt-meta">
          Z = {el.z} · massa {formatMass(el.atomicMassDisplay)}
        </span>
        <span className="tt-cat">
          <span className="tt-dot" aria-hidden="true" />
          {cat.label}
          {el.categoryPredicted ? ' (categoria prevista)' : ''}
          {el.radioactive ? (
            <span className="tt-rad">
              <span aria-hidden="true">☢</span> {el.radioactivity === 'very-weak' ? 'radioatividade muito fraca' : 'radioativo'}
            </span>
          ) : null}
        </span>
      </span>
    </div>
  );
}
