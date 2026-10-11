import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { ELEMENT_BY_Z } from '../data/elements';
import { formatMass } from '../lib/format';
import { QUALITY_LABELS, resolveQuality } from '../lib/quality';
import { useStore } from '../state/store';
import type { PanelMode, Quality } from '../state/types';
import { CATEGORY_BY_ID } from '../data/categories';
import { ElementRow } from './ElementRow';
import { Icon } from './Icon';
import { SearchBox } from './SearchBox';
import '../styles/shell.css';

/** Ordem e rótulos curtos dos modos na barra de navegação. */
const NAV_ITEMS: Array<{ mode: PanelMode; label: string; description: string }> = [
  { mode: 'explore', label: 'Explorar', description: 'Filtros, categorias e rankings' },
  { mode: 'discoveries', label: 'Descobertas', description: 'Quando cada elemento foi identificado' },
  { mode: 'trends', label: 'Tendências', description: 'Como as propriedades variam na tabela' },
  { mode: 'states', label: 'Estados', description: 'Sólido, líquido ou gás em cada temperatura' },
  { mode: 'compare', label: 'Comparar', description: 'Elementos lado a lado' },
  { mode: 'learn', label: 'Aprender', description: 'Conceitos para entender a tabela' },
  { mode: 'history', label: 'História', description: 'Como a tabela periódica foi construída' },
  { mode: 'sources', label: 'Fontes', description: 'De onde vêm os dados científicos' },
  { mode: 'quiz', label: 'Quiz', description: 'Teste seus conhecimentos' },
];

const QUALITY_ORDER: Quality[] = ['auto', 'low', 'medium', 'high'];

/** Abaixo desta largura a navegação vira o botão "Menu". */
const NAV_COLLAPSE_QUERY = '(max-width: 1179px)';
/** Abaixo desta largura a busca vira um ícone que abre uma sobreposição. */
const COMPACT_QUERY = '(max-width: 639px)';

/** Assina uma media query (seguro em ambientes sem `matchMedia`, como testes). */
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

/** Fecha um popover ao clicar/tocar fora dele. */
function useOutsidePointer(open: boolean, ref: RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, ref, close]);
}

/** Fecha quando o foco sai do conjunto botão + popover (ex.: Tab para fora). */
function closeOnFocusOut(ref: RefObject<HTMLElement | null>, close: () => void) {
  return (e: FocusEvent<HTMLElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && ref.current && !ref.current.contains(next)) close();
  };
}

function editableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

function BrandLogo() {
  const gradId = useId();
  return (
    <svg className="hdr-logo" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5eead4" />
          <stop offset="1" stopColor="#7dd3fc" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="8" fill="rgba(94,234,212,0.07)" stroke="rgba(94,234,212,0.32)" />
      <g fill="none" stroke={`url(#${gradId})`} strokeWidth="1.4">
        <ellipse cx="16" cy="16" rx="11" ry="4.2" />
        <ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(-60 16 16)" />
      </g>
      <circle cx="16" cy="16" r="2.5" fill="#5eead4" />
    </svg>
  );
}

function MenuGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Navegação (botões em linha ou menu suspenso)
// ---------------------------------------------------------------------------
function InlineNav({ panel, onSelect }: { panel: PanelMode; onSelect: (mode: PanelMode) => void }) {
  return (
    <nav className="hdr-nav" aria-label="Modos de exploração">
      <ul>
        {NAV_ITEMS.map((item) => (
          <li key={item.mode}>
            <button
              type="button"
              className="hdr-nav-btn"
              aria-current={panel === item.mode ? 'page' : undefined}
              title={item.description}
              onClick={() => onSelect(item.mode)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function MenuNav({ panel, onSelect }: { panel: PanelMode; onSelect: (mode: PanelMode) => void }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const popId = useId();
  const close = useCallback(() => setOpen(false), []);
  useOutsidePointer(open, wrapRef, close);

  // Ao abrir, o foco vai para o modo atual.
  useEffect(() => {
    if (!open) return;
    const current = listRef.current?.querySelector<HTMLButtonElement>('[aria-current="page"]');
    (current ?? listRef.current?.querySelector<HTMLButtonElement>('button'))?.focus();
  }, [open]);

  const items = () => [...(listRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])];

  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (!open) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLButtonElement);
    let next = -1;
    if (e.key === 'ArrowDown') next = index < 0 ? 0 : (index + 1) % list.length;
    else if (e.key === 'ArrowUp') next = index < 0 ? list.length - 1 : (index - 1 + list.length) % list.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = list.length - 1;
    if (next >= 0) {
      e.preventDefault();
      list[next]?.focus();
    }
  }

  const current = NAV_ITEMS.find((item) => item.mode === panel);

  return (
    <nav className="hdr-menu" aria-label="Modos de exploração" ref={wrapRef} onKeyDown={onKeyDown} onBlur={closeOnFocusOut(wrapRef, close)}>
      <button
        ref={buttonRef}
        type="button"
        className="btn btn-ghost hdr-menu-btn"
        aria-expanded={open}
        aria-controls={popId}
        onClick={() => setOpen((o) => !o)}
      >
        <MenuGlyph />
        <span className="hdr-menu-label">Menu</span>
        {current ? (
          <span className="hdr-menu-current">
            <span className="sr-only">, modo atual: </span>
            {current.label}
          </span>
        ) : null}
      </button>
      <div className="hdr-popover hdr-menu-pop" id={popId} hidden={!open}>
        <ul ref={listRef}>
          {NAV_ITEMS.map((item) => (
            <li key={item.mode}>
              <button
                type="button"
                className="hdr-menu-item"
                aria-current={panel === item.mode ? 'page' : undefined}
                onClick={() => {
                  setOpen(false);
                  buttonRef.current?.focus();
                  onSelect(item.mode);
                }}
              >
                <span className="hdr-menu-item-label">{item.label}</span>
                <span className="hdr-menu-item-desc">{item.description}</span>
                {panel === item.mode ? (
                  <span className="hdr-menu-check" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Configurações: qualidade gráfica + favoritos
// ---------------------------------------------------------------------------
function SettingsMenu() {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const popId = useId();
  const titleId = useId();
  const favTitleId = useId();
  const close = useCallback(() => setOpen(false), []);
  useOutsidePointer(open, wrapRef, close);

  const resolved = useMemo(() => resolveQuality(state.quality), [state.quality]);

  // Ao abrir, o foco vai para a opção de qualidade marcada.
  useEffect(() => {
    if (open) popRef.current?.querySelector<HTMLInputElement>('input:checked')?.focus();
  }, [open]);

  const favorites = state.favorites.map((z) => ELEMENT_BY_Z.get(z)).filter((el) => el !== undefined);

  return (
    <div
      className="hdr-settings"
      ref={wrapRef}
      onBlur={closeOnFocusOut(wrapRef, close)}
      onKeyDown={(e) => {
        if (open && e.key === 'Escape') {
          e.preventDefault();
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="btn btn-ghost btn-icon hdr-icon-btn"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={popId}
        aria-label={`Configurações e favoritos${favorites.length ? ` (${favorites.length} ${favorites.length === 1 ? 'favorito' : 'favoritos'})` : ''}`}
        title="Configurações e favoritos"
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="settings" size={20} />
        {favorites.length ? (
          <span className="hdr-fav-count" aria-hidden="true">
            {favorites.length}
          </span>
        ) : null}
      </button>
      <div ref={popRef} className="hdr-popover hdr-settings-pop" id={popId} role="dialog" aria-labelledby={titleId} hidden={!open}>
        <h2 className="sr-only" id={titleId}>
          Configurações
        </h2>
        <fieldset className="hdr-quality">
          <legend className="section-title">Qualidade gráfica</legend>
          <div className="hdr-radio-seg">
            {QUALITY_ORDER.map((q) => (
              <label key={q} className="hdr-radio">
                <input
                  type="radio"
                  name={`${popId}-qualidade`}
                  value={q}
                  checked={state.quality === q}
                  onChange={() => dispatch({ type: 'setQuality', quality: q })}
                />
                <span>{QUALITY_LABELS[q]}</span>
              </label>
            ))}
          </div>
          <p className="small muted hdr-quality-note" aria-live="polite">
            {state.quality === 'auto' ? (
              <>
                Neste aparelho, a opção Automática está usando a qualidade <strong>{QUALITY_LABELS[resolved]}</strong>.
              </>
            ) : (
              <>
                Em uso: qualidade <strong>{QUALITY_LABELS[resolved]}</strong>.
              </>
            )}{' '}
            A qualidade Baixa desliga estrelas, brilho e iluminação simulada — ideal para aparelhos mais simples.
          </p>
        </fieldset>

        <section className="hdr-favorites" aria-labelledby={favTitleId}>
          <h3 className="section-title" id={favTitleId}>
            <span aria-hidden="true">★ </span>Favoritos
          </h3>
          {favorites.length ? (
            <ul className="element-list hdr-fav-list">
              {favorites.map((el) => (
                <li key={el.z}>
                  <ElementRow
                    element={el}
                    value={formatMass(el.atomicMassDisplay)}
                    detail={CATEGORY_BY_ID[el.category].label}
                    onClick={(z) => {
                      setOpen(false);
                      buttonRef.current?.focus();
                      dispatch({ type: 'select', z });
                      dispatch({ type: 'point', z });
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="small muted">Nenhum favorito ainda. Na ficha de um elemento, use o botão “Favoritar” para guardá-lo aqui.</p>
          )}
        </section>

        <section className="hdr-shortcuts" aria-label="Atalhos de teclado">
          <h3 className="section-title">Atalhos de teclado</h3>
          <dl>
            <dt>
              <kbd>/</kbd>
            </dt>
            <dd>buscar elemento</dd>
            <dt>
              <kbd>←</kbd> <kbd>↑</kbd> <kbd>→</kbd> <kbd>↓</kbd>
            </dt>
            <dd>navegar entre os elementos</dd>
            <dt>
              <kbd>Enter</kbd>
            </dt>
            <dd>abrir a ficha</dd>
            <dt>
              <kbd>Esc</kbd>
            </dt>
            <dd>fechar</dd>
          </dl>
        </section>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Busca em tela cheia (celular)
// ---------------------------------------------------------------------------
function SearchOverlay({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Mantém o Tab dentro da sobreposição (campo ↔ botão fechar).
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusables = [...(dialogRef.current?.querySelectorAll<HTMLElement>('input, button:not([disabled])') ?? [])];
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return createPortal(
    <div className="hdr-search-overlay" role="dialog" aria-modal="true" aria-label="Buscar elemento" ref={dialogRef} onKeyDown={onKeyDown}>
      <div className="hdr-search-backdrop" aria-hidden="true" onClick={onClose} />
      <div className="hdr-search-bar">
        <SearchBox overlay autoFocus onPicked={onClose} onDismiss={onClose} />
        <button type="button" className="btn btn-ghost btn-icon" aria-label="Fechar busca" title="Fechar busca" onClick={onClose}>
          <Icon name="close" size={20} />
        </button>
      </div>
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// Cabeçalho
// ---------------------------------------------------------------------------
export function Header() {
  const { state, dispatch } = useStore();
  const navCollapsed = useMediaQuery(NAV_COLLAPSE_QUERY);
  const compact = useMediaQuery(COMPACT_QUERY);
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  const selectPanel = useCallback((mode: PanelMode) => dispatch({ type: 'setPanel', panel: mode }), [dispatch]);

  // Se a tela crescer com a sobreposição aberta, ela some (a busca em linha assume).
  useEffect(() => {
    if (!compact) setSearchOpen(false);
  }, [compact]);

  // Devolve o foco ao ícone de busca; se um elemento foi escolhido, a ficha
  // que se abre em seguida guarda este botão como ponto de retorno.
  const closeOverlay = useCallback(() => {
    setSearchOpen(false);
    searchButtonRef.current?.focus();
  }, []);

  // Atalho global "/" para a busca (ignorado ao digitar ou com um diálogo modal aberto).
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
      if (editableTarget(e.target)) return;
      if (document.querySelector('[aria-modal="true"]')) return;
      e.preventDefault();
      if (compact) setSearchOpen(true);
      else {
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [compact]);

  return (
    <header className="app-header hdr">
      <div className="hdr-brand">
        <BrandLogo />
        <h1 className="hdr-title">
          <span className="hdr-title-main">Tabela Periódica</span> <span className="hdr-title-sub">Interativa</span>
        </h1>
      </div>

      {compact ? null : (
        <div className="hdr-search">
          <SearchBox inputRef={searchInputRef} showShortcut={finePointer} />
        </div>
      )}

      <div className="hdr-actions">
        {navCollapsed ? null : <InlineNav panel={state.panel} onSelect={selectPanel} />}
        {compact ? (
          <button
            ref={searchButtonRef}
            type="button"
            className="btn btn-ghost btn-icon hdr-icon-btn"
            aria-label="Buscar elemento"
            title="Buscar elemento"
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(true)}
          >
            <Icon name="search" size={20} />
          </button>
        ) : null}
        {navCollapsed ? <MenuNav panel={state.panel} onSelect={selectPanel} /> : null}
        <SettingsMenu />
      </div>

      {compact && searchOpen ? <SearchOverlay onClose={closeOverlay} /> : null}
    </header>
  );
}
