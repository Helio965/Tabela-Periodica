import { useId, type CSSProperties } from 'react';
import { CATEGORY_BY_ID } from '../data/categories';
import { ELEMENT_BY_Z } from '../data/elements';
import { formatMass } from '../lib/format';
import { Icon } from './Icon';
import './legend.css';

export interface FeaturedElementProps {
  z: number;
  onOpen: (z: number) => void;
  onDismiss: () => void;
}

/**
 * "Elemento em destaque": cartão discreto no canto inferior esquerdo do palco,
 * com uma curiosidade curta e um atalho para a ficha completa.
 */
export function FeaturedElement({ z, onOpen, onDismiss }: FeaturedElementProps) {
  const uid = useId();
  const el = ELEMENT_BY_Z.get(z);
  if (!el) return null;
  const cat = CATEGORY_BY_ID[el.category];
  const titleId = `${uid}-titulo`;

  return (
    <aside
      key={el.z}
      className="featured"
      aria-labelledby={titleId}
      style={{ '--cat': cat.color } as CSSProperties}
    >
      <div className="featured-top">
        <p className="featured-kicker">
          <Icon name="star" size={13} />
          Elemento em destaque
        </p>
        <button type="button" className="btn btn-ghost btn-icon featured-close" aria-label="Fechar o elemento em destaque" onClick={onDismiss}>
          <Icon name="close" size={16} />
        </button>
      </div>

      <div className="featured-main">
        <div className="featured-tile" aria-hidden="true">
          <span className="featured-tile-z">{el.z}</span>
          <span className="featured-tile-symbol">{el.symbol}</span>
          <span className="featured-tile-code">{cat.code}</span>
        </div>
        <div className="featured-id">
          <h2 className="featured-name" id={titleId}>
            {el.name}
            <span className="sr-only">, elemento em destaque</span>
          </h2>
          <p className="featured-meta">
            <span className="sr-only">Símbolo {el.symbol}, </span>
            Z = {el.z} · {formatMass(el.atomicMassDisplay)} u
          </p>
          <p className="featured-meta">
            {cat.label}
            {el.radioactive ? (
              <span className="featured-rad">
                {' · '}
                <span aria-hidden="true">☢ </span>
                {el.radioactivity === 'very-weak' ? 'radioatividade extremamente fraca' : 'radioativo'}
              </span>
            ) : null}
          </p>
        </div>
      </div>

      <p className="featured-text">{el.highlight}</p>

      <button
        type="button"
        className="btn btn-primary btn-sm featured-open"
        aria-label={`Explorar elemento: ${el.name}`}
        onClick={() => onOpen(el.z)}
      >
        Explorar elemento
        <Icon name="chevronRight" size={16} />
      </button>
    </aside>
  );
}
