import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from 'react';
import { CATEGORY_BY_ID } from '../data/categories';
import { formatMass } from '../lib/format';
import { searchElements } from '../lib/search';
import { useStore } from '../state/store';
import { Icon } from './Icon';
import '../styles/shell.css';

export interface SearchBoxProps {
  /** Chamado logo depois que um elemento é escolhido (ex.: fechar a busca em tela cheia). */
  onPicked?: (z: number) => void;
  /** Esc com a lista já fechada e o campo vazio (ex.: fechar a sobreposição do celular). */
  onDismiss?: () => void;
  /** Recebe o foco ao montar. */
  autoFocus?: boolean;
  /** Referência para o campo de texto (usada pelo atalho "/"). */
  inputRef?: RefObject<HTMLInputElement | null>;
  /** Variante em tela cheia (celular): a lista ocupa toda a largura. */
  overlay?: boolean;
  /** Mostra a dica do atalho "/" dentro do campo (só em telas com teclado). */
  showShortcut?: boolean;
}

const MAX_RESULTS = 8;
const PLACEHOLDER = 'Buscar elemento: nome, símbolo ou número';

/**
 * Busca principal no padrão "combobox" da WAI-ARIA 1.2: o foco fica no campo
 * e a opção ativa é indicada por `aria-activedescendant`. Aceita nome com ou
 * sem acento ("hidrogenio"), símbolo ("H"), número atômico ("1"), parte do
 * nome ("hidro") e até o nome de quem descobriu ("Curie").
 */
export function SearchBox({ onPicked, onDismiss, autoFocus, inputRef, overlay, showShortcut }: SearchBoxProps) {
  const { dispatch } = useStore();
  const baseId = useId();
  const listId = `${baseId}-resultados`;
  const optionId = (z: number) => `${baseId}-opcao-${z}`;

  const localRef = useRef<HTMLInputElement>(null);
  const fieldRef = inputRef ?? localRef;
  const listRef = useRef<HTMLUListElement>(null);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const results = useMemo(() => searchElements(query, undefined, MAX_RESULTS), [query]);
  const hasQuery = query.trim() !== '';
  const popupOpen = open && hasQuery;
  const expanded = popupOpen && results.length > 0;
  const activeResult = expanded && active >= 0 ? results[active] : undefined;

  useEffect(() => {
    if (autoFocus) fieldRef.current?.focus();
  }, [autoFocus, fieldRef]);

  // Mantém a opção ativa visível quando a lista tem rolagem.
  useEffect(() => {
    if (!expanded || active < 0) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active, expanded]);

  function pick(index: number) {
    const r = results[index];
    if (!r) return;
    const z = r.element.z;
    setQuery('');
    setOpen(false);
    setActive(-1);
    onPicked?.(z);
    dispatch({ type: 'select', z });
    dispatch({ type: 'point', z });
  }

  function move(delta: 1 | -1) {
    if (!results.length) return;
    setActive((current) => {
      if (current < 0) return delta > 0 ? 0 : results.length - 1;
      return (current + delta + results.length) % results.length;
    });
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        if (!hasQuery) return;
        e.preventDefault();
        setOpen(true);
        move(e.key === 'ArrowDown' ? 1 : -1);
        break;
      case 'Enter': {
        if (!expanded) return;
        // Sem opção ativa, Enter escolhe o resultado mais relevante.
        e.preventDefault();
        pick(active >= 0 ? active : 0);
        break;
      }
      case 'Escape':
        // Cada Esc desfaz um nível: fecha a lista → apaga o texto → fecha a busca.
        if (popupOpen) {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
          setActive(-1);
        } else if (query) {
          e.preventDefault();
          e.stopPropagation();
          setQuery('');
        } else if (onDismiss) {
          e.preventDefault();
          e.stopPropagation();
          onDismiss();
        } else {
          fieldRef.current?.blur();
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
  if (popupOpen) {
    status = results.length
      ? `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}. Use as setas para navegar e Enter para abrir a ficha.`
      : 'Nenhum elemento encontrado.';
  }

  return (
    <div className={`searchbox${overlay ? ' is-overlay' : ''}${popupOpen ? ' is-open' : ''}`} role="search">
      <div className="sb-control">
        <Icon name="search" className="sb-icon" />
        <input
          ref={fieldRef}
          className="sb-input"
          type="text"
          role="combobox"
          aria-label="Buscar elemento por nome, símbolo ou número atômico"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-activedescendant={activeResult ? optionId(activeResult.element.z) : undefined}
          aria-keyshortcuts={showShortcut ? '/' : undefined}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="search"
          placeholder={PLACEHOLDER}
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
        {query ? (
          <button
            type="button"
            className="sb-clear"
            aria-label="Limpar busca"
            title="Limpar busca"
            // Mantém o foco no campo ao clicar.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setQuery('');
              setActive(-1);
              fieldRef.current?.focus();
            }}
          >
            <Icon name="close" size={16} />
          </button>
        ) : showShortcut ? (
          <kbd className="sb-kbd" aria-hidden="true" title="Atalho: tecla /">
            /
          </kbd>
        ) : null}
      </div>

      <div className="sb-popup" hidden={!popupOpen}>
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Elementos encontrados"
          className="sb-list"
          hidden={!results.length}
          // Evita que o campo perca o foco ao clicar numa opção ou na barra de rolagem.
          onMouseDown={(e) => e.preventDefault()}
        >
          {results.map((r, i) => {
            const el = r.element;
            const cat = CATEGORY_BY_ID[el.category];
            return (
              <li
                key={el.z}
                id={optionId(el.z)}
                data-index={i}
                role="option"
                aria-selected={i === active}
                className={`sb-option${i === active ? ' is-active' : ''}`}
                style={{ '--cat': cat.color } as CSSProperties}
                onMouseMove={() => {
                  if (active !== i) setActive(i);
                }}
                onClick={() => pick(i)}
              >
                <span className="sb-tile" aria-hidden="true">
                  <span className="sb-tile-z">{el.z}</span>
                  <span className="sb-tile-sym">{el.symbol}</span>
                </span>
                <span className="sb-text">
                  <span className="sb-name">
                    {el.name} <span className="sr-only">({el.symbol})</span>
                  </span>
                  <span className="sb-meta">
                    Z = {el.z} · massa {formatMass(el.atomicMassDisplay)} · {cat.label}
                  </span>
                  {r.reason ? <span className="sb-reason">{r.reason}</span> : null}
                </span>
                <Icon name="chevronRight" className="sb-go" size={16} />
              </li>
            );
          })}
        </ul>
        {!results.length ? (
          <p className="sb-empty" aria-hidden="true">
            Nenhum elemento encontrado
            <span className="muted small">Tente o nome (“Ferro”), o símbolo (“Fe”) ou o número atômico (“26”).</span>
          </p>
        ) : null}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
