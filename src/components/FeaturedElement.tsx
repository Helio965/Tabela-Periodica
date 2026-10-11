import { useEffect, useId, useState, type CSSProperties } from 'react';
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
 * com uma curiosidade curta e um atalho para a ficha completa. Assim que a
 * pessoa interage com a cena, ele se recolhe numa pílula (para não cobrir a
 * tabela) e pode ser reaberto com um clique.
 */
export function FeaturedElement({ z, onOpen, onDismiss }: FeaturedElementProps) {
  const uid = useId();
  // Em celulares o cartão cobriria boa parte da tabela: começa recolhido.
  const [expanded, setExpanded] = useState(() => !window.matchMedia?.('(max-width: 640px)').matches);

  useEffect(() => {
    if (!expanded) return;
    const collapse = (e: Event) => {
      if (e.target instanceof Element && e.target.closest('.scene')) setExpanded(false);
    };
    window.addEventListener('pointerdown', collapse, true);
    window.addEventListener('wheel', collapse, { capture: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', collapse, true);
      window.removeEventListener('wheel', collapse, true);
    };
  }, [expanded]);

  const el = ELEMENT_BY_Z.get(z);
  if (!el) return null;
  const cat = CATEGORY_BY_ID[el.category];
  const titleId = `${uid}-titulo`;

  if (!expanded) {
    return (
      <aside className="featured is-collapsed" aria-label="Elemento em destaque" style={{ '--cat': cat.color } as CSSProperties}>
        <button type="button" className="featured-pill" aria-expanded={false} onClick={() => setExpanded(true)}>
          <Icon name="star" size={13} />
          <span>
            Destaque: <strong>{el.name}</strong> ({el.symbol})
          </span>
        </button>
        <button type="button" className="btn btn-ghost btn-icon featured-close" aria-label="Fechar o elemento em destaque" onClick={onDismiss}>
          <Icon name="close" size={14} />
        </button>
      </aside>
    );
  }

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
        <div className="featured-top-actions">
          <button type="button" className="btn btn-ghost btn-icon featured-close" aria-label="Recolher o elemento em destaque" aria-expanded onClick={() => setExpanded(false)}>
            <Icon name="chevronDown" size={16} />
          </button>
          <button type="button" className="btn btn-ghost btn-icon featured-close" aria-label="Fechar o elemento em destaque" onClick={onDismiss}>
            <Icon name="close" size={16} />
          </button>
        </div>
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
