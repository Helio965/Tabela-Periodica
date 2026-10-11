import type { CSSProperties, ReactNode } from 'react';
import type { ChemicalElement } from '../data/types';
import { CATEGORY_BY_ID } from '../data/categories';

export interface ElementRowProps {
  element: ChemicalElement;
  /** Coluna da esquerda (posição no ranking, ano...). */
  lead?: ReactNode;
  /** Valor exibido à direita. */
  value?: ReactNode;
  /** Texto secundário abaixo do nome. */
  detail?: ReactNode;
  onClick?: (z: number) => void;
  onHover?: (z: number | null) => void;
}

/** Linha clicável com símbolo colorido, nome e um valor (usada em listas e rankings). */
export function ElementRow({ element: el, lead, value, detail, onClick, onHover }: ElementRowProps) {
  return (
    <button
      type="button"
      className="element-row"
      style={{ '--cat': CATEGORY_BY_ID[el.category].color } as CSSProperties}
      onClick={() => onClick?.(el.z)}
      onPointerEnter={() => onHover?.(el.z)}
      onPointerLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(el.z)}
      onBlur={() => onHover?.(null)}
      aria-label={`${el.name} (${el.symbol}), número atômico ${el.z}${typeof value === 'string' ? `, ${value}` : ''}`}
    >
      <span className="er-pos">{lead ?? el.z}</span>
      <span className="er-sym">{el.symbol}</span>
      <span>
        <span style={{ display: 'block' }}>{el.name}</span>
        {detail ? <span className="muted small">{detail}</span> : null}
      </span>
      <span className="er-value">{value}</span>
    </button>
  );
}
