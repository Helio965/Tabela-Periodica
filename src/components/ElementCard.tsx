import { memo, type CSSProperties } from 'react';
import type { ChemicalElement } from '../data/types';
import { CATEGORY_BY_ID } from '../data/categories';
import { formatMass } from '../lib/format';
import type { ElementVisual } from '../lib/visuals';
import { STATE_LABELS } from '../lib/temperature';

export interface ElementCardProps {
  element: ChemicalElement;
  visual: ElementVisual;
  /** Tabindex "itinerante": só um cartão por vez recebe foco pelo Tab. */
  tabbable: boolean;
  onActivate: (z: number) => void;
  onHover: (z: number | null) => void;
  /** Variante usada fora da cena 3D (lista, ranking, comparação). */
  compact?: boolean;
}

const STATE_ICON: Record<string, string> = { solid: '■', liquid: '≈', gas: '○', unknown: '?' };

function describe(el: ChemicalElement, v: ElementVisual): string {
  const cat = CATEGORY_BY_ID[el.category].label;
  const parts = [`${el.name}, símbolo ${el.symbol}, número atômico ${el.z}`, `massa atômica ${formatMass(el.atomicMassDisplay)}`, cat];
  if (el.radioactive) parts.push(el.radioactivity === 'very-weak' ? 'radioatividade extremamente fraca' : 'radioativo');
  if (v.rank) parts.push(`posição ${v.rank} no ranking de massa`);
  if (v.trendLabel) parts.push(`valor: ${v.trendLabel}`);
  if (v.matterState) parts.push(`estado: ${STATE_LABELS[v.matterState]}`);
  if (v.undiscovered) parts.push('ainda não descoberto neste ano');
  if (v.dim) parts.push('fora do filtro atual');
  return parts.join('; ');
}

/**
 * Cartão de um elemento. Mostra número atômico, símbolo, nome, massa e uma
 * sigla da categoria (para não depender apenas da cor).
 */
export const ElementCard = memo(function ElementCard({ element: el, visual: v, tabbable, onActivate, onHover, compact }: ElementCardProps) {
  const cat = CATEGORY_BY_ID[el.category];
  const classes = ['element-card', `cat-${el.category}`];
  if (v.dim) classes.push('is-dim');
  if (v.emphasis) classes.push('is-emphasis');
  if (v.undiscovered) classes.push('is-undiscovered');
  if (v.fresh) classes.push('is-fresh');
  if (v.inCompare) classes.push('is-compare');
  if (v.trend !== undefined) classes.push('has-trend');
  if (v.trend === null) classes.push('no-data');
  if (v.matterState) classes.push(`state-${v.matterState}`);
  if (el.categoryPredicted) classes.push('is-predicted');
  if (compact) classes.push('is-compact');

  const style = {
    '--cat': cat.color,
    ...(v.trend !== undefined ? { '--trend': v.trend === null ? 0 : v.trend } : {}),
  } as CSSProperties;

  return (
    <button
      type="button"
      className={classes.join(' ')}
      style={style}
      tabIndex={tabbable ? 0 : -1}
      data-z={el.z}
      aria-label={describe(el, v)}
      onClick={(e) => {
        // Cliques de mouse na cena são tratados pelo motor 3D; aqui ficam teclado e listas.
        if (compact || e.detail === 0) onActivate(el.z);
      }}
      onPointerEnter={() => onHover(el.z)}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(el.z)}
      onBlur={() => onHover(null)}
    >
      <span className="ec-top">
        <span className="ec-z">{el.z}</span>
        {v.rank ? <span className="ec-rank" aria-hidden="true">#{v.rank}</span> : null}
        {el.radioactive ? (
          <span className={`ec-rad${v.radiationBadge ? ' is-on' : ''}`} aria-hidden="true" title="Radioativo">
            ☢
          </span>
        ) : null}
      </span>
      <span className="ec-symbol">{el.symbol}</span>
      <span className="ec-name">{el.name}</span>
      <span className="ec-bottom">
        <span className="ec-mass">{v.trendLabel ?? formatMass(el.atomicMassDisplay)}</span>
        <span className="ec-code" aria-hidden="true">
          {v.matterState ? STATE_ICON[v.matterState] : cat.code}
        </span>
      </span>
      {v.favorite ? <span className="ec-fav" aria-hidden="true">★</span> : null}
    </button>
  );
});
