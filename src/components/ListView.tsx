import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ELEMENTS } from '../data/elements';
import type { ElementVisual, VisualMap } from '../lib/visuals';
import { ElementCard } from './ElementCard';
import '../styles/shell.css';

export interface ListViewProps {
  visuals: VisualMap;
  onActivate: (z: number) => void;
}

type SortKey = 'z' | 'name' | 'mass';

const SORTS: Array<{ id: SortKey; label: string }> = [
  { id: 'z', label: 'Número atômico' },
  { id: 'name', label: 'Nome' },
  { id: 'mass', label: 'Massa' },
];

const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' });

/** Visual neutro (usado só se o mapa não tiver o elemento). */
const NEUTRAL: ElementVisual = {
  dim: false,
  emphasis: false,
  undiscovered: false,
  fresh: false,
  inCompare: false,
  favorite: false,
  radiationBadge: false,
};

const noop = () => {};

const isFaded = (v: ElementVisual | undefined) => Boolean(v && (v.dim || v.undiscovered));

/**
 * Alternativa acessível à cena 3D (e mais confortável no celular): uma grade
 * de cartões compactos, navegável por Tab (entra na grade) e pelas setas
 * (move entre os cartões), que respeita os mesmos filtros e destaques.
 */
export function ListView({ visuals, onActivate }: ListViewProps) {
  const [sort, setSort] = useState<SortKey>('z');
  const [onlyHighlighted, setOnlyHighlighted] = useState(false);
  const [focusZ, setFocusZ] = useState(1);
  const gridRef = useRef<HTMLUListElement>(null);
  const sortLabelId = useId();
  const titleId = useId();

  const sorted = useMemo(() => {
    const list = [...ELEMENTS];
    if (sort === 'name') list.sort((a, b) => collator.compare(a.name, b.name) || a.z - b.z);
    else if (sort === 'mass') list.sort((a, b) => a.atomicMass - b.atomicMass || a.z - b.z);
    return list;
  }, [sort]);

  const highlightedCount = useMemo(() => ELEMENTS.filter((el) => !isFaded(visuals.get(el.z))).length, [visuals]);
  const someFaded = highlightedCount < ELEMENTS.length;

  // Sem filtro ativo, a opção "só destacados" deixa de fazer sentido.
  useEffect(() => {
    if (!someFaded) setOnlyHighlighted(false);
  }, [someFaded]);

  const filtering = onlyHighlighted && someFaded;
  const shown = filtering ? sorted.filter((el) => !isFaded(visuals.get(el.z))) : sorted;
  // Tabindex itinerante: só um cartão entra na ordem do Tab.
  const tabbableZ = shown.some((el) => el.z === focusZ) ? focusZ : shown[0]?.z;

  const focusCard = useCallback((z: number) => {
    setFocusZ(z);
    gridRef.current?.querySelector<HTMLButtonElement>(`button[data-z="${z}"]`)?.focus();
  }, []);

  function onKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    const z = Number((e.target as HTMLElement).closest<HTMLElement>('[data-z]')?.dataset.z);
    const index = shown.findIndex((el) => el.z === z);
    if (index < 0) return;
    const grid = gridRef.current;
    const columns = grid ? Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length) : 1;
    let next = -1;
    switch (e.key) {
      case 'ArrowRight':
        next = index + 1;
        break;
      case 'ArrowLeft':
        next = index - 1;
        break;
      case 'ArrowDown':
        next = index + columns;
        break;
      case 'ArrowUp':
        next = index - columns;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = shown.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    if (next < 0 || next >= shown.length) return;
    focusCard(shown[next].z);
  }

  let countText = `${ELEMENTS.length} elementos`;
  if (filtering) countText = `Mostrando ${shown.length} de ${ELEMENTS.length} elementos`;
  else if (someFaded) countText = `${ELEMENTS.length} elementos · ${highlightedCount} em destaque`;

  return (
    <div className="list-view" role="region" aria-labelledby={titleId}>
      <div className="lv-toolbar">
        <div className="lv-heading">
          <h2 className="lv-title" id={titleId}>
            Lista de elementos
          </h2>
          <p className="lv-count small muted">{countText}</p>
        </div>
        <div className="lv-controls">
          <span className="lv-sort-label small muted" id={sortLabelId}>
            Ordenar por
          </span>
          <div className="seg lv-sort" role="group" aria-labelledby={sortLabelId}>
            {SORTS.map((s) => (
              <button key={s.id} type="button" aria-pressed={sort === s.id} onClick={() => setSort(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
          {someFaded ? (
            <button type="button" className="chip lv-only" aria-pressed={onlyHighlighted} onClick={() => setOnlyHighlighted((v) => !v)}>
              <span aria-hidden="true">{onlyHighlighted ? '✓' : '○'}</span>
              Só os destacados
            </button>
          ) : null}
        </div>
      </div>

      {shown.length ? (
        <ul
          ref={gridRef}
          className="lv-grid"
          aria-label={`Elementos em ordem de ${SORTS.find((s) => s.id === sort)!.label.toLowerCase()}`}
          onKeyDown={onKeyDown}
          onFocus={(e) => {
            const z = Number((e.target as HTMLElement).dataset.z);
            if (z && z !== focusZ) setFocusZ(z);
          }}
        >
          {shown.map((el) => (
            <li key={el.z}>
              <ElementCard
                element={el}
                visual={visuals.get(el.z) ?? NEUTRAL}
                tabbable={el.z === tabbableZ}
                onActivate={onActivate}
                onHover={noop}
                compact
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="info-box lv-empty">Nenhum elemento corresponde aos filtros atuais.</p>
      )}
    </div>
  );
}
