import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { ELEMENTS } from '../data/elements';
import { CATEGORY_BY_ID } from '../data/categories';
import { searchElements } from '../lib/search';
import { Icon } from './Icon';
import '../panels/compare.css';

export interface ElementPickerProps {
  /** Chamado com o número atômico do elemento escolhido. */
  onPick: (z: number) => void;
  /** Rótulo visível do campo. */
  label: string;
  placeholder?: string;
  /** Elementos que aparecem como "já escolhido" e não podem ser escolhidos de novo. */
  excludeZ?: number[];
  disabled?: boolean;
  /** Texto de ajuda exibido abaixo do campo (ligado por aria-describedby). */
  hint?: string;
  /** id do campo de texto (útil para devolver o foco a ele). */
  id?: string;
}

const MAX_RESULTS = 8;
const NO_EXCLUSIONS: number[] = [];

/**
 * Campo de busca no padrão "combobox" da WAI-ARIA: digite nome, símbolo,
 * número atômico ou parte do nome; use ↑/↓ para navegar, Enter para escolher
 * e Esc para fechar a lista (ou apagar o texto).
 */
export function ElementPicker({
  onPick,
  label,
  placeholder = 'Nome, símbolo ou número atômico',
  excludeZ = NO_EXCLUSIONS,
  disabled = false,
  hint,
  id,
}: ElementPickerProps) {
  const baseId = useId();
  const inputId = id ?? `${baseId}-campo`;
  const listId = `${baseId}-lista`;
  const hintId = `${baseId}-ajuda`;
  const optionId = (z: number) => `${baseId}-opcao-${z}`;

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => searchElements(query, ELEMENTS, MAX_RESULTS), [query]);
  const excluded = useMemo(() => new Set(excludeZ), [excludeZ]);
  // Índices das opções que podem ser escolhidas (as já escolhidas ficam desativadas).
  const enabled = useMemo(
    () => results.flatMap((r, i) => (excluded.has(r.element.z) ? [] : [i])),
    [results, excluded],
  );

  const hasQuery = query.trim() !== '';
  const expanded = open && hasQuery && !disabled;
  const activeResult = expanded && active >= 0 ? results[active] : undefined;

  // Mantém a opção ativa visível quando a lista tem rolagem.
  useEffect(() => {
    if (!expanded || active < 0) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active, expanded]);

  // Se o campo for desativado (ex.: comparação cheia), fecha a lista.
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  function pick(index: number) {
    const r = results[index];
    if (!r || excluded.has(r.element.z)) return;
    onPick(r.element.z);
    setQuery('');
    setOpen(false);
    setActive(-1);
    inputRef.current?.focus();
  }

  function move(delta: 1 | -1) {
    if (!enabled.length) return;
    const pos = enabled.indexOf(active);
    const next =
      pos === -1 ? (delta > 0 ? enabled[0] : enabled[enabled.length - 1]) : enabled[(pos + delta + enabled.length) % enabled.length];
    setActive(next);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) setOpen(true);
        move(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) setOpen(true);
        move(-1);
        break;
      case 'Enter': {
        if (!expanded) return;
        // Sem opção ativa, Enter escolhe o primeiro resultado disponível.
        const index = active >= 0 ? active : enabled[0];
        if (index !== undefined) {
          e.preventDefault();
          pick(index);
        }
        break;
      }
      case 'Escape':
        if (expanded) {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
          setActive(-1);
        } else if (query) {
          e.preventDefault();
          e.stopPropagation();
          setQuery('');
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        break;
    }
  }

  let status = '';
  if (expanded) {
    if (!results.length) status = 'Nenhum elemento encontrado.';
    else if (!enabled.length) status = 'Os elementos encontrados já foram escolhidos.';
    else
      status = `${enabled.length} ${enabled.length === 1 ? 'resultado' : 'resultados'}. Use as setas para navegar e Enter para escolher.`;
  }

  return (
    <div className={`picker${disabled ? ' is-disabled' : ''}`}>
      <label className="picker-label" htmlFor={inputId}>
        {label}
      </label>
      <div className="picker-control">
        <Icon name="search" className="picker-icon" />
        <input
          ref={inputRef}
          id={inputId}
          className="input picker-input"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-activedescendant={activeResult ? optionId(activeResult.element.z) : undefined}
          aria-describedby={hint ? hintId : undefined}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="done"
          placeholder={placeholder}
          disabled={disabled}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
        />
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={`Resultados: ${label}`}
          className="picker-list"
          hidden={!expanded || !results.length}
          // Evita que o campo perca o foco ao clicar numa opção ou na barra de rolagem.
          onMouseDown={(e) => e.preventDefault()}
        >
          {results.map((r, i) => {
            const el = r.element;
            const cat = CATEGORY_BY_ID[el.category];
            const isExcluded = excluded.has(el.z);
            const classes = ['picker-option'];
            if (i === active) classes.push('is-active');
            if (isExcluded) classes.push('is-excluded');
            const extra = [r.reason, isExcluded ? 'já escolhido' : undefined].filter(Boolean).join(' · ');
            return (
              <li
                key={el.z}
                id={optionId(el.z)}
                data-index={i}
                role="option"
                aria-selected={i === active}
                aria-disabled={isExcluded || undefined}
                aria-label={`${el.name} (${el.symbol}), número atômico ${el.z}${extra ? `, ${extra}` : ''}`}
                className={classes.join(' ')}
                onMouseMove={() => {
                  if (!isExcluded && active !== i) setActive(i);
                }}
                onClick={() => pick(i)}
              >
                <span className="picker-sym" style={{ '--cat': cat.color } as CSSProperties} aria-hidden="true">
                  {el.symbol}
                </span>
                <span className="picker-text" aria-hidden="true">
                  <span className="picker-name">{el.name}</span>
                  <span className="picker-meta">
                    Z = {el.z} · {cat.label}
                    {extra ? <span className="picker-reason"> · {extra}</span> : null}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        {expanded && !results.length ? (
          <p className="picker-empty" aria-hidden="true">
            Nenhum elemento encontrado para “{query.trim()}”.
          </p>
        ) : null}
      </div>
      {hint ? (
        <p id={hintId} className="picker-hint muted small">
          {hint}
        </p>
      ) : null}
      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

export default ElementPicker;
