import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { ELEMENT_BY_Z, ELEMENTS, loadContent, ONLY_PREDICTED_BULK, STATE_REFERENCE } from '../data/elements';
import { CATEGORY_BY_ID } from '../data/categories';
import { BASE_ELEMENT_SOURCES, SOURCE_BY_ID, type Source } from '../data/sources';
import { expandConfiguration, orderedConfiguration, SHELL_LETTERS } from '../data/elements/shells';
import type {
  ChemicalElement,
  ElementContent,
  HalfLife,
  HazardFlag,
  HazardLevel,
  Occurrence,
  UseArea,
} from '../data/types';
import { hashFor, useStore } from '../state/store';
import { MAX_COMPARE, MIN_COMPARE } from '../lib/compare';
import { announce } from '../lib/announce';
import {
  formatAbundance,
  formatDensity,
  formatHalfLife,
  formatMass,
  formatNumber,
  formatTemperature,
  formatYear,
  superscript,
} from '../lib/format';
import { METHOD_LABELS } from '../lib/timeline';
import { STATE_LABELS } from '../lib/temperature';
import { Icon } from '../components/Icon';
import { AtomModel } from './AtomModel';
import { IsotopeTable, RadioactivityInfo } from './IsotopeTable';
import './sheet.css';

export interface ElementSheetProps {
  z: number;
  onClose: () => void;
  onNavigate: (z: number) => void;
}

// ---------------------------------------------------------------------------
// Textos e rótulos
// ---------------------------------------------------------------------------

const SECTIONS = [
  { id: 'geral', nav: 'Geral', title: 'Informações gerais' },
  { id: 'propriedades', nav: 'Propriedades', title: 'Propriedades' },
  { id: 'estrutura', nav: 'Átomo', title: 'Estrutura atômica' },
  { id: 'isotopos', nav: 'Isótopos', title: 'Isótopos' },
  { id: 'descoberta', nav: 'Descoberta', title: 'Descoberta' },
  { id: 'nome', nav: 'Nome', title: 'Origem do nome' },
  { id: 'natureza', nav: 'Natureza', title: 'Na natureza' },
  { id: 'usos', nav: 'Usos', title: 'Principais usos' },
  { id: 'seguranca', nav: 'Segurança', title: 'Segurança' },
  { id: 'curiosidades', nav: 'Curiosidades', title: 'Curiosidades' },
  { id: 'fontes', nav: 'Fontes', title: 'Fontes' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

const sectionDomId = (id: SectionId) => `ficha-${id}`;

const OCCURRENCE_BADGE: Record<Occurrence, string> = {
  primordial: 'Natural',
  'decay-chain': 'Natural (cadeias de decaimento)',
  trace: 'Traços na natureza',
  synthetic: 'Sintético',
};

const OCCURRENCE_TEXT: Record<Occurrence, string> = {
  primordial: 'Natural (primordial): presente na Terra desde a sua formação.',
  'decay-chain':
    'Natural, mas só existe porque é produzido continuamente no decaimento radioativo de elementos mais pesados, como urânio e tório.',
  trace:
    'Ocorre na natureza apenas em traços ínfimos (por fissão espontânea ou captura de nêutrons); as quantidades usadas são produzidas artificialmente.',
  synthetic:
    'Sintético: conhecido apenas por produção artificial, em reatores nucleares ou aceleradores de partículas.',
};

const WHERE_LABELS: Record<ElementContent['nature']['where'][number], { label: string; icon: string }> = {
  crosta: { label: 'Crosta terrestre', icon: '🪨' },
  atmosfera: { label: 'Atmosfera', icon: '🌬️' },
  oceanos: { label: 'Oceanos', icon: '🌊' },
  organismos: { label: 'Seres vivos', icon: '🧬' },
  estrelas: { label: 'Estrelas', icon: '✨' },
  minerais: { label: 'Minerais', icon: '💎' },
  'apenas-laboratorio': { label: 'Apenas em laboratório', icon: '🧪' },
};

const USE_AREAS: Record<UseArea, { label: string; icon: string }> = {
  medicina: { label: 'Medicina', icon: '🩺' },
  eletronica: { label: 'Eletrônica', icon: '💻' },
  industria: { label: 'Indústria', icon: '🏭' },
  energia: { label: 'Energia', icon: '⚡' },
  construcao: { label: 'Construção', icon: '🏗️' },
  agricultura: { label: 'Agricultura', icon: '🌱' },
  ciencia: { label: 'Ciência', icon: '🔬' },
  tecnologia: { label: 'Tecnologia', icon: '📡' },
  aeroespacial: { label: 'Aeroespacial', icon: '🚀' },
  alimentos: { label: 'Alimentos', icon: '🍎' },
  iluminacao: { label: 'Iluminação', icon: '💡' },
  joias: { label: 'Joias', icon: '💍' },
  transporte: { label: 'Transporte', icon: '🚗' },
  ambiente: { label: 'Meio ambiente', icon: '🌍' },
  defesa: { label: 'Defesa', icon: '🛡️' },
};

const HAZARD_LEVELS: Record<HazardLevel, { label: string; step: number }> = {
  baixo: { label: 'Baixo', step: 1 },
  moderado: { label: 'Moderado', step: 2 },
  alto: { label: 'Alto', step: 3 },
  'muito-alto': { label: 'Muito alto', step: 4 },
};

const HAZARD_FLAGS: Record<HazardFlag, { label: string; icon: string }> = {
  toxico: { label: 'Tóxico', icon: '☠️' },
  radioativo: { label: 'Radioativo', icon: '☢️' },
  reativo: { label: 'Reativo', icon: '⚡' },
  inflamavel: { label: 'Inflamável', icon: '🔥' },
  oxidante: { label: 'Oxidante', icon: '⭕' },
  corrosivo: { label: 'Corrosivo', icon: '🧪' },
  ambiental: { label: 'Risco ambiental', icon: '🌿' },
  asfixiante: { label: 'Asfixiante', icon: '💨' },
  'baixo-risco': { label: 'Baixo risco', icon: '✅' },
};

const LIST_AND = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });
const LIST_OR = new Intl.ListFormat('pt-BR', { style: 'long', type: 'disjunction' });
/** ["A", "B", "C"] → "A, B e C" */
const listPt = (items: string[]) => LIST_AND.format(items);

// ---------------------------------------------------------------------------
// Utilitários
// ---------------------------------------------------------------------------

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const NA = 'não disponível';

/** "4s2 3d10" → "4s² 3d¹⁰" */
const supConfig = (config: string) => config.replace(/([spdf])(\d+)/g, (_, l: string, n: string) => `${l}${superscript(n)}`);

/** Configuração completa (sem o cerne de gás nobre), em ordem de camadas. */
function fullConfiguration(config: string): string {
  const order = { s: 0, p: 1, d: 2, f: 3 };
  return expandConfiguration(config)
    .sort((a, b) => a.n - b.n || order[a.l] - order[b.l])
    .map((s) => `${s.n}${s.l}${s.electrons}`)
    .join(' ');
}

/** Peso atômico padrão no formato brasileiro: "[1,007 84; 1,008 11]". */
const standardWeightPt = (s: string) => s.replace(/, /g, '; ').replace(/\./g, ',');

const halfLifeOrNA = (h: HalfLife | null | undefined) => (h ? formatHalfLife(h) : NA);

const withUnit = (value: number | null, unit: string, maxFrac = 2) => (value === null ? NA : `${formatNumber(value, maxFrac)} ${unit}`);

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

function focusableIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((node) => node.tabIndex >= 0 && node.getClientRects().length > 0);
}

function isTextField(node: HTMLElement): boolean {
  return node.isContentEditable || node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || node.tagName === 'SELECT';
}

// ---------------------------------------------------------------------------
// Pequenos componentes de apresentação
// ---------------------------------------------------------------------------

function Skeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="sheet-skeleton">
      <span className="sr-only">Carregando conteúdo…</span>
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} className="sheet-skeleton-line" aria-hidden="true" />
      ))}
    </div>
  );
}

function Missing() {
  return <p className="muted">Conteúdo educativo não disponível para este elemento.</p>;
}

interface SectionProps {
  id: SectionId;
  index: number;
  title: string;
  busy?: boolean;
  children: ReactNode;
}

function Section({ id, index, title, busy, children }: SectionProps) {
  const headingId = `${sectionDomId(id)}-titulo`;
  return (
    <section id={sectionDomId(id)} className="sheet-section" aria-labelledby={headingId} aria-busy={busy || undefined}>
      <h2 id={headingId} tabIndex={-1}>
        <span className="sheet-section-num" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="sheet-ext">
      {children}
      <Icon name="external" size={14} className="sheet-ext-icon" />
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/** Ficha completa de um elemento, exibida como diálogo modal. */
export default function ElementSheet({ z, onClose, onNavigate }: ElementSheetProps) {
  const element = ELEMENT_BY_Z.get(z);
  if (!element) return null;
  return <Sheet el={element} onClose={onClose} onNavigate={onNavigate} />;
}

interface SheetProps {
  el: ChemicalElement;
  onClose: () => void;
  onNavigate: (z: number) => void;
}

interface Loaded {
  z: number;
  content: ElementContent | undefined;
}

function Sheet({ el, onClose, onNavigate }: SheetProps) {
  const { state, dispatch } = useStore();
  const z = el.z;
  const cat = CATEGORY_BY_ID[el.category];
  const titleId = useId();
  const prev = ELEMENT_BY_Z.get(z - 1);
  const next = ELEMENT_BY_Z.get(z + 1);

  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const [active, setActive] = useState<SectionId>('geral');
  const [closing, setClosing] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; id: number } | null>(null);
  const [manualLink, setManualLink] = useState<string | null>(null);
  const [navMessage, setNavMessage] = useState('');
  const [shownZ, setShownZ] = useState(z);

  // Ao trocar de elemento (anterior/próximo), volta ao início da ficha.
  if (shownZ !== z) {
    setShownZ(z);
    setActive('geral');
    setManualLink(null);
    setNavMessage(`Ficha de ${el.name}, número atômico ${z}`);
  }

  // ---- Conteúdo educativo (carregado sob demanda) --------------------------
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  useEffect(() => {
    let alive = true;
    loadContent(z)
      .then((content) => {
        if (alive) setLoaded({ z, content });
      })
      .catch(() => {
        if (alive) setLoaded({ z, content: undefined });
      });
    return () => {
      alive = false;
    };
  }, [z]);
  const loading = loaded?.z !== z;
  const content = loaded?.z === z ? loaded.content : undefined;

  // ---- Referências estáveis para os ouvintes globais -----------------------
  const latest = useRef({ z, onClose, onNavigate });
  useEffect(() => {
    latest.current = { z, onClose, onNavigate };
  });

  const closeTimer = useRef<number | undefined>(undefined);
  const requestClose = useCallback(() => {
    if (closeTimer.current !== undefined) return;
    if (prefersReducedMotion()) {
      latest.current.onClose();
      return;
    }
    setClosing(true);
    closeTimer.current = window.setTimeout(() => latest.current.onClose(), 190);
  }, []);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // ---- Foco: move para o diálogo, prende o Tab e devolve ao fechar ----------
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panelRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      const panel = panelRef.current;
      if (!panel || e.defaultPrevented) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key === 'Tab') {
        const items = focusableIn(panel);
        if (!items.length) {
          e.preventDefault();
          panel.focus();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        const current = document.activeElement;
        const outside = !(current instanceof Node) || !panel.contains(current);
        if (e.shiftKey && (current === first || current === panel || outside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (current === last || outside)) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const target = e.target instanceof HTMLElement ? e.target : null;
        if (target && (isTextField(target) || target.closest('[data-keep-arrows]'))) return;
        const { z: currentZ, onNavigate: navigate } = latest.current;
        const destination = currentZ + (e.key === 'ArrowLeft' ? -1 : 1);
        if (ELEMENT_BY_Z.has(destination)) {
          e.preventDefault();
          navigate(destination);
        }
      }
    };

    // Se algo fora do diálogo receber foco, ele volta para a ficha.
    const onFocusIn = (e: FocusEvent) => {
      const panel = panelRef.current;
      if (panel && e.target instanceof Node && !panel.contains(e.target)) panel.focus({ preventScroll: true });
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [requestClose]);

  // ---- Volta ao topo quando o elemento muda --------------------------------
  const lastZ = useRef(z);
  useEffect(() => {
    if (lastZ.current === z) return;
    lastZ.current = z;
    bodyRef.current?.scrollTo({ top: 0 });
  }, [z]);

  // ---- Navegação por seções (scroll-spy) -----------------------------------
  const lockSpyUntil = useRef(0);
  const spyFrame = useRef(0);
  const onBodyScroll = useCallback(() => {
    if (spyFrame.current) return;
    spyFrame.current = requestAnimationFrame(() => {
      spyFrame.current = 0;
      const body = bodyRef.current;
      if (!body || performance.now() < lockSpyUntil.current) return;
      const threshold = body.scrollTop + (navRef.current?.offsetHeight ?? 0) + 48;
      let current: SectionId = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const node = body.querySelector<HTMLElement>(`#${sectionDomId(s.id)}`);
        if (node && node.offsetTop <= threshold) current = s.id;
      }
      if (body.scrollTop > 0 && body.scrollTop + body.clientHeight >= body.scrollHeight - 4) current = SECTIONS[SECTIONS.length - 1].id;
      setActive(current);
    });
  }, []);
  useEffect(() => () => cancelAnimationFrame(spyFrame.current), []);

  const goToSection = (id: SectionId) => {
    const body = bodyRef.current;
    const node = body?.querySelector<HTMLElement>(`#${sectionDomId(id)}`);
    if (!body || !node) return;
    lockSpyUntil.current = performance.now() + 900;
    setActive(id);
    body.scrollTo({ top: node.offsetTop - (navRef.current?.offsetHeight ?? 0) - 2, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    node.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
  };

  // Mantém a aba ativa visível na barra de seções (rolagem horizontal no celular).
  useEffect(() => {
    const nav = navRef.current;
    const button = nav?.querySelector<HTMLElement>(`[data-target="${active}"]`);
    if (!nav || !button || nav.scrollWidth <= nav.clientWidth) return;
    const left = button.offsetLeft - (nav.clientWidth - button.offsetWidth) / 2;
    nav.scrollTo({ left: Math.max(0, left), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [active]);

  // ---- Mensagens de retorno (favorito, comparação, link) --------------------
  const notify = useCallback((text: string) => {
    announce(text);
    setFeedback({ text, id: Date.now() });
  }, []);
  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 2800);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    if (manualLink) {
      linkInputRef.current?.focus();
      linkInputRef.current?.select();
    }
  }, [manualLink]);

  const isFavorite = state.favorites.includes(z);
  const inCompare = state.compare.includes(z);
  const compareCount = state.compare.length;

  const toggleFavorite = () => {
    dispatch({ type: 'toggleFavorite', z });
    notify(isFavorite ? `${el.name} removido dos favoritos` : `${el.name} adicionado aos favoritos`);
  };

  const toggleCompare = () => {
    if (inCompare) {
      dispatch({ type: 'toggleCompare', z });
      notify(`${el.name} removido da comparação`);
    } else if (compareCount >= MAX_COMPARE) {
      notify(`Compare no máximo ${MAX_COMPARE} elementos. Remova um antes de adicionar ${el.name}.`);
    } else {
      dispatch({ type: 'toggleCompare', z });
      notify(`${el.name} adicionado à comparação (${compareCount + 1} de ${MAX_COMPARE})`);
    }
  };

  const openComparison = () => {
    dispatch({ type: 'setPanel', panel: 'compare' });
    requestClose();
  };

  const shareLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}${hashFor({ selected: z, compare: state.compare, panel: state.panel })}`;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Área de transferência indisponível');
      await navigator.clipboard.writeText(url);
      setManualLink(null);
      notify('Link copiado');
    } catch {
      // Sem acesso à área de transferência: mostra o link selecionado para copiar à mão.
      setManualLink(url);
      notify('Não foi possível copiar automaticamente. O link está selecionado: copie com Ctrl+C (ou Cmd+C).');
    }
  };

  // ---- Fechar ao clicar no fundo ---------------------------------------------
  const pressedOnBackdrop = useRef(false);
  const onOverlayPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    pressedOnBackdrop.current = e.target === e.currentTarget;
  };
  const onOverlayClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (pressedOnBackdrop.current && e.target === e.currentTarget) requestClose();
    pressedOnBackdrop.current = false;
  };

  // ---- Dados derivados -------------------------------------------------------
  const usesByArea = useMemo(() => {
    const map = new Map<UseArea, string[]>();
    for (const use of content?.uses ?? []) map.set(use.area, [...(map.get(use.area) ?? []), use.text]);
    return [...map.entries()];
  }, [content]);

  const sources = useMemo(() => {
    const ids = [...new Set([...BASE_ELEMENT_SOURCES, ...(content?.extraSources ?? [])])];
    return ids.map((id) => SOURCE_BY_ID[id]).filter((s): s is Source => Boolean(s));
  }, [content]);

  const style = { '--cat': cat.color } as CSSProperties;

  return (
    <div
      className={`overlay sheet-overlay${closing ? ' is-closing' : ''}`}
      onPointerDown={onOverlayPointerDown}
      onClick={onOverlayClick}
    >
      <div ref={panelRef} className="sheet" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} style={style}>
        <div className="sheet-topbar">
          <div className="sheet-steps" role="group" aria-label="Navegar entre elementos">
            <button
              type="button"
              className="btn btn-sm btn-ghost sheet-step"
              aria-disabled={!prev}
              aria-label={prev ? `Elemento anterior: ${prev.name} (${prev.z})` : 'Não há elemento anterior'}
              onClick={() => prev && onNavigate(prev.z)}
            >
              <Icon name="chevronLeft" />
              <span aria-hidden="true">{prev?.symbol ?? '—'}</span>
            </button>
            <span className="sheet-position mono" aria-hidden="true">
              {z} / {ELEMENTS.length}
            </span>
            <button
              type="button"
              className="btn btn-sm btn-ghost sheet-step"
              aria-disabled={!next}
              aria-label={next ? `Próximo elemento: ${next.name} (${next.z})` : 'Não há próximo elemento'}
              onClick={() => next && onNavigate(next.z)}
            >
              <span aria-hidden="true">{next?.symbol ?? '—'}</span>
              <Icon name="chevronRight" />
            </button>
          </div>
          <p className="sheet-keyhint small muted" aria-hidden="true">
            <kbd>←</kbd> <kbd>→</kbd> navegar · <kbd>Esc</kbd> fechar
          </p>
          <button type="button" className="btn btn-icon btn-ghost sheet-close" aria-label="Fechar ficha" title="Fechar (Esc)" onClick={requestClose}>
            <Icon name="close" size={20} />
          </button>
        </div>

        <div ref={bodyRef} className="sheet-body" onScroll={onBodyScroll}>
          {/* ---------------- Cabeçalho ---------------- */}
          <header className="sheet-hero">
            <div className="sheet-tile" aria-hidden="true">
              <span className="sheet-tile-z">{z}</span>
              <span className="sheet-tile-code">{cat.code}</span>
              <span className="sheet-tile-symbol">{el.symbol}</span>
              <span className="sheet-tile-mass">{formatMass(el.atomicMassDisplay)}</span>
            </div>
            <div className="sheet-hero-info">
              <p className="sheet-overline">
                Elemento químico · <span className="mono">Z = {z}</span>
              </p>
              <h1 id={titleId} className="sheet-title">
                {el.name}
                <span className="sr-only">
                  , símbolo {el.symbol}, número atômico {z}
                </span>
              </h1>
              <p className="sheet-sub">
                Em inglês: <span lang="en">{el.nameEn}</span>
                {el.aliases?.length ? <> · também escrito {LIST_OR.format(el.aliases.map((a) => `“${a}”`))}</> : null}
              </p>
              <div className="sheet-tags">
                <span className="chip is-static sheet-cat" style={{ '--chip-color': cat.color } as CSSProperties}>
                  <span className="dot" aria-hidden="true" />
                  {cat.label}
                  {el.categoryPredicted ? <span className="sheet-cat-note">(prevista)</span> : null}
                </span>
                <ul className="sheet-badges" aria-label="Características">
                  {el.radioactive ? (
                    <li>
                      <span className="badge rad">
                        <span aria-hidden="true">☢</span>{' '}
                        {el.radioactivity === 'very-weak' ? 'Radioatividade extremamente fraca' : 'Radioativo'}
                      </span>
                    </li>
                  ) : null}
                  <li>
                    <span className={`badge${el.natural ? ' ok' : ''}`}>
                      <span aria-hidden="true">{el.occurrence === 'synthetic' ? '⚗' : el.occurrence === 'trace' ? '·' : '✓'}</span>{' '}
                      {OCCURRENCE_BADGE[el.occurrence]}
                    </span>
                  </li>
                  {el.firstSynthesized ? (
                    <li>
                      <span className="badge">
                        <span aria-hidden="true">⚗</span> Sintetizado antes de ser achado na natureza
                      </span>
                    </li>
                  ) : null}
                  {isFavorite ? (
                    <li>
                      <span className="badge sheet-fav-badge">
                        <span aria-hidden="true">★</span> Favorito
                      </span>
                    </li>
                  ) : null}
                </ul>
              </div>
              {el.categoryPredicted ? (
                <p className="sheet-note">
                  Categoria prevista teoricamente: as propriedades químicas deste elemento ainda não foram medidas.
                </p>
              ) : null}
              {el.radioactivity === 'very-weak' ? (
                <p className="sheet-note">
                  Não tem isótopos estáveis, mas decai tão devagar que, na prática, se comporta como um elemento estável.
                </p>
              ) : null}

              <div className="sheet-actions">
                <button type="button" className="btn btn-sm sheet-action" aria-pressed={isFavorite} onClick={toggleFavorite}>
                  <Icon name="star" size={16} />
                  Favoritar
                </button>
                <button type="button" className="btn btn-sm sheet-action" aria-pressed={inCompare} onClick={toggleCompare}>
                  <Icon name="compare" size={16} />
                  Comparar
                  <span className="sheet-action-count mono" aria-label={`${compareCount} de ${MAX_COMPARE} na comparação`}>
                    {compareCount}/{MAX_COMPARE}
                  </span>
                </button>
                <button type="button" className="btn btn-sm sheet-action" onClick={shareLink}>
                  <Icon name="share" size={16} />
                  Copiar link
                </button>
                {inCompare && compareCount >= MIN_COMPARE ? (
                  <button type="button" className="btn btn-sm btn-ghost sheet-action" onClick={openComparison}>
                    Ver comparação
                    <Icon name="chevronRight" size={16} />
                  </button>
                ) : null}
              </div>
              {manualLink ? (
                <label className="field sheet-manual-link">
                  Link desta ficha
                  <input ref={linkInputRef} className="input mono" readOnly value={manualLink} onFocus={(e) => e.currentTarget.select()} />
                </label>
              ) : null}
            </div>
          </header>

          {/* ---------------- Navegação entre seções ---------------- */}
          <nav ref={navRef} className="sheet-nav" aria-label="Seções da ficha">
            <ul>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    data-target={s.id}
                    aria-current={active === s.id ? 'location' : undefined}
                    aria-controls={sectionDomId(s.id)}
                    onClick={() => goToSection(s.id)}
                  >
                    {s.nav}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------------- 1. Informações gerais ---------------- */}
          <Section id="geral" index={0} title={SECTIONS[0].title}>
            <GeneralInfo el={el} />
          </Section>

          {/* ---------------- 2. Propriedades ---------------- */}
          <Section id="propriedades" index={1} title={SECTIONS[1].title}>
            <Properties el={el} />
          </Section>

          {/* ---------------- 3. Estrutura atômica ---------------- */}
          <Section id="estrutura" index={2} title={SECTIONS[2].title}>
            <AtomModel element={el} />
          </Section>

          {/* ---------------- 4. Isótopos ---------------- */}
          <Section id="isotopos" index={3} title={SECTIONS[3].title}>
            <IsotopeTable element={el} />
            {el.radioactive ? (
              <RadioactivityInfo
                element={el}
                occurrence={`${OCCURRENCE_TEXT[el.occurrence]}${el.firstSynthesized ? ' Foi obtido artificialmente antes de ser detectado na natureza.' : ''}`}
                hazards={loading ? <Skeleton lines={2} /> : content ? <p className="sheet-prose">{content.hazards.text}</p> : <p className="muted">{NA}</p>}
              />
            ) : null}
          </Section>

          {/* ---------------- 5. Descoberta ---------------- */}
          <Section id="descoberta" index={4} title={SECTIONS[4].title} busy={loading}>
            <Discovery el={el} />
            <h3 className="sheet-h3">Como foi descoberto?</h3>
            {loading ? (
              <Skeleton lines={5} />
            ) : content?.discoveryStory.length ? (
              <div className="sheet-prose">
                {content.discoveryStory.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : (
              <Missing />
            )}
          </Section>

          {/* ---------------- 6. Origem do nome e do símbolo ---------------- */}
          <Section id="nome" index={5} title={SECTIONS[5].title} busy={loading}>
            {loading ? <Skeleton lines={2} /> : content ? <p className="sheet-prose">{content.nameOrigin}</p> : <Missing />}
            <h3 className="sheet-h3">Origem do símbolo</h3>
            {loading ? <Skeleton lines={1} /> : content ? <p className="sheet-prose">{content.symbolOrigin}</p> : <Missing />}
            {el.symbolSourceName ? (
              <p className="sheet-note">
                O símbolo <strong>{el.symbol}</strong> vem de <em>{el.symbolSourceName}</em>, e não do nome em português.
              </p>
            ) : null}
          </Section>

          {/* ---------------- 7. Na natureza ---------------- */}
          <Section id="natureza" index={6} title={SECTIONS[6].title} busy={loading}>
            {loading ? <Skeleton lines={3} /> : content ? <Nature el={el} nature={content.nature} /> : <Missing />}
            <h3 className="sheet-h3">Abundância</h3>
            <dl className="kv">
              <dt>Na crosta terrestre</dt>
              <dd className="mono">{formatAbundance(el.props.crustalAbundance, 'mg/kg')}</dd>
              <dt>Nos oceanos</dt>
              <dd className="mono">{formatAbundance(el.props.oceanicAbundance, 'mg/L')}</dd>
            </dl>
            <p className="sheet-note">Fonte: Jefferson Lab via PubChem. 1 mg/kg equivale a 1 parte por milhão em massa.</p>
          </Section>

          {/* ---------------- 8. Usos ---------------- */}
          <Section id="usos" index={7} title={SECTIONS[7].title} busy={loading}>
            {loading ? (
              <Skeleton lines={4} />
            ) : !content ? (
              <Missing />
            ) : usesByArea.length ? (
              <div className="sheet-uses">
                {usesByArea.map(([area, texts]) => (
                  <article key={area} className="sheet-use">
                    <h3 className="sheet-use-title">
                      <span className="sheet-use-icon" aria-hidden="true">
                        {USE_AREAS[area].icon}
                      </span>
                      {USE_AREAS[area].label}
                    </h3>
                    <ul>
                      {texts.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            ) : (
              <p className="muted">Nenhum uso registrado nesta ficha.</p>
            )}
          </Section>

          {/* ---------------- 9. Segurança ---------------- */}
          <Section id="seguranca" index={8} title={SECTIONS[8].title} busy={loading}>
            {loading ? <Skeleton lines={3} /> : content ? <Safety hazards={content.hazards} /> : <Missing />}
            <p className="info-box warn sheet-safety-note">
              Informação educacional; não substitui fichas de segurança (FISPQ) nem orientações profissionais.
            </p>
          </Section>

          {/* ---------------- 10. Curiosidades ---------------- */}
          <Section id="curiosidades" index={9} title={SECTIONS[9].title} busy={loading}>
            {loading ? (
              <Skeleton lines={3} />
            ) : content?.curiosities.length ? (
              <ul className="sheet-curiosities">
                {content.curiosities.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            ) : (
              <Missing />
            )}
          </Section>

          {/* ---------------- 11. Fontes ---------------- */}
          <Section id="fontes" index={10} title={SECTIONS[10].title}>
            <h3 className="sheet-h3">Fontes dos dados</h3>
            <ul className="sheet-sources">
              {sources.map((s) => (
                <li key={s.id}>
                  <ExternalLink href={s.url}>{s.title}</ExternalLink>
                  <span className="sheet-source-pub">{s.publisher}</span>
                  <span className="sheet-source-use">{s.usedFor}</span>
                </li>
              ))}
            </ul>
            <h3 className="sheet-h3">Páginas sobre este elemento</h3>
            <ElementLinks el={el} />
          </Section>

          <nav className="sheet-footer-nav" aria-label="Outros elementos">
            {prev ? (
              <button type="button" className="sheet-footer-step" onClick={() => onNavigate(prev.z)}>
                <span className="small muted">
                  <Icon name="chevronLeft" size={14} /> Anterior
                </span>
                <span className="sheet-footer-name">
                  {prev.name} <span className="mono muted">({prev.z})</span>
                </span>
              </button>
            ) : (
              <span />
            )}
            {next ? (
              <button type="button" className="sheet-footer-step is-next" onClick={() => onNavigate(next.z)}>
                <span className="small muted">
                  Próximo <Icon name="chevronRight" size={14} />
                </span>
                <span className="sheet-footer-name">
                  {next.name} <span className="mono muted">({next.z})</span>
                </span>
              </button>
            ) : null}
          </nav>
        </div>

        <p className={`sheet-feedback${feedback ? ' is-visible' : ''}`} role="status" aria-live="polite">
          {feedback ? <span key={feedback.id}>{feedback.text}</span> : null}
        </p>
        <p className="sr-only" aria-live="polite">
          {navMessage}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Seções
// ---------------------------------------------------------------------------

function GeneralInfo({ el }: { el: ChemicalElement }) {
  const aw = el.props.atomicWeight;
  const cat = CATEGORY_BY_ID[el.category];
  const config = el.props.electronConfiguration;
  const ordered = config ? orderedConfiguration(config) : null;
  const raw = config ? config.replace(/^\[(\w+)\]\s*/, '[$1] ') : null;
  const hasCore = Boolean(config && /^\[\w+\]/.test(config));
  const predictedState = el.props.standardState;
  const isInterval = Boolean(aw.standard && aw.standard.startsWith('['));

  let stateText: string;
  if (el.state === 'unknown') {
    const forecast = predictedState === 'unknown' ? NA : STATE_LABELS[predictedState].toLowerCase();
    stateText = `Desconhecido — nunca obtido em quantidade visível; previsão: ${forecast}`;
  } else {
    stateText = `${STATE_LABELS[el.state]}${el.statePredicted ? ' (previsto)' : ''}`;
  }

  let groupText: string;
  if (el.group !== null) groupText = String(el.group);
  else if (el.category === 'lanthanide') groupText = '— série dos lantanídeos (bloco f)';
  else if (el.category === 'actinide') groupText = '— série dos actinídeos (bloco f)';
  else groupText = '— (bloco f)';

  return (
    <dl className="kv sheet-kv">
      <dt>Nome</dt>
      <dd>{el.name}</dd>

      <dt>Símbolo</dt>
      <dd>
        <strong className="sheet-symbol">{el.symbol}</strong>
      </dd>

      <dt>Número atômico</dt>
      <dd>
        <span className="mono">{el.z}</span>
        <span className="sheet-note">Número de prótons no núcleo de cada átomo.</span>
      </dd>

      <dt>Massa atômica</dt>
      <dd>
        <span className="mono sheet-strong">{formatMass(el.atomicMassDisplay)}</span>
        {!el.massIsMassNumber && aw.uncertainty ? <span className="mono muted"> ± {formatMass(aw.uncertainty)}</span> : null}
        {el.massIsMassNumber ? (
          <>
            <span className="sheet-note">
              Número de massa do isótopo de vida mais longa (CIAAW/NUBASE2020)
              {aw.referenceIsotope
                ? `: ${el.name}-${aw.referenceIsotope.massNumber}, com meia-vida de ${halfLifeOrNA(aw.referenceIsotope.halfLife)}`
                : ''}
              . Elementos sem composição isotópica característica na natureza não têm peso atômico padrão.
            </span>
            {aw.alternatives?.length ? (
              <span className="sheet-note">
                {aw.alternatives.length === 1 ? 'Alternativa citada' : 'Alternativas citadas'} pelo CIAAW, com meia-vida
                comparável:{' '}
                {aw.alternatives.map((a) => `[${a.massNumber}] (meia-vida de ${halfLifeOrNA(a.halfLife)})`).join('; ')}.
              </span>
            ) : null}
          </>
        ) : (
          <span className="sheet-note">
            Peso atômico padrão abreviado (CIAAW): massa média dos átomos do elemento em amostras naturais, em u.
          </span>
        )}
      </dd>

      {!el.massIsMassNumber && aw.standard ? (
        <>
          <dt>Peso atômico padrão (CIAAW)</dt>
          <dd>
            <span className="mono">{standardWeightPt(aw.standard)}</span>
            {isInterval ? (
              <span className="sheet-note">
                Intervalo: a composição isotópica — e, com ela, a massa atômica — varia conforme a origem da amostra.
              </span>
            ) : null}
            {aw.standard.includes('(') ? (
              <span className="sheet-note">O número entre parênteses é a incerteza no último algarismo.</span>
            ) : null}
          </dd>
        </>
      ) : null}

      <dt>Grupo</dt>
      <dd>{groupText}</dd>

      <dt>Período</dt>
      <dd>{el.period}</dd>

      <dt>Bloco</dt>
      <dd>
        {el.block}
        <span className="sheet-note">Indica o tipo de subnível (s, p, d ou f) que está sendo preenchido nessa região da tabela.</span>
      </dd>

      <dt>Categoria</dt>
      <dd>
        {cat.label}
        {el.categoryPredicted ? ' (prevista)' : ''}
        <span className="sheet-note">{cat.description}</span>
      </dd>

      <dt>
        Estado físico a {STATE_REFERENCE.celsius} °C
        <span className="sheet-dt-note">
          {formatNumber(STATE_REFERENCE.kelvin, 2)} K e {STATE_REFERENCE.pressure}
        </span>
      </dt>
      <dd>{stateText}</dd>

      <dt>Ocorrência</dt>
      <dd>
        {OCCURRENCE_TEXT[el.occurrence]}
        {el.firstSynthesized ? ' Foi obtido artificialmente antes de ser detectado na natureza.' : ''}
      </dd>

      <dt>Configuração eletrônica</dt>
      <dd>
        {ordered && config ? (
          <>
            <span className="mono sheet-config">{supConfig(ordered)}</span>
            {el.props.electronConfigurationPredicted ? <span className="sheet-predicted"> (prevista)</span> : null}
            {raw && raw !== ordered ? (
              <span className="sheet-note">
                Como aparece na fonte (PubChem): <span className="mono">{supConfig(raw)}</span>
              </span>
            ) : null}
            {hasCore ? (
              <span className="sheet-note">
                Por extenso: <span className="mono">{supConfig(fullConfiguration(config))}</span>
              </span>
            ) : null}
          </>
        ) : (
          NA
        )}
      </dd>

      <dt>Elétrons por camada</dt>
      <dd>
        {el.shells.length ? (
          <span className="mono">
            {el.shells.map((n, i) => `${SHELL_LETTERS[i]} ${n}`).join(' · ')}
            {el.props.electronConfigurationPredicted ? <span className="sheet-predicted"> (prevista)</span> : null}
          </span>
        ) : (
          NA
        )}
      </dd>
    </dl>
  );
}

function Properties({ el }: { el: ChemicalElement }) {
  const p = el.props;
  const estimated = ONLY_PREDICTED_BULK.has(el.z);
  const est = (value: number | null) => (estimated && value !== null ? <span className="sheet-predicted"> (estimativa)</span> : null);
  const sublimes = p.meltingPoint !== null && p.boilingPoint !== null && p.boilingPoint < p.meltingPoint;

  return (
    <>
      <dl className="kv sheet-kv">
        <dt>Densidade</dt>
        <dd>
          <span className="mono">{formatDensity(p.density, el.state)}</span>
          {est(p.density)}
        </dd>

        <dt>Ponto de fusão</dt>
        <dd>
          <span className="mono">{formatTemperature(p.meltingPoint)}</span>
          {est(p.meltingPoint)}
        </dd>

        <dt>Ponto de ebulição</dt>
        <dd>
          <span className="mono">{formatTemperature(p.boilingPoint)}</span>
          {est(p.boilingPoint)}
          {sublimes ? (
            <span className="sheet-note">
              Sublima à pressão ambiente (passa direto de sólido a gás); o ponto de fusão indicado foi medido sob pressão.
            </span>
          ) : null}
        </dd>

        <dt>Eletronegatividade (Pauling)</dt>
        <dd className="mono">{formatNumber(p.electronegativity, 2)}</dd>

        <dt>Raio atômico (covalente)</dt>
        <dd className="mono">{withUnit(p.radii.covalent, 'pm', 0)}</dd>

        <dt>Raio atômico (empírico)</dt>
        <dd className="mono">{withUnit(p.radii.empirical, 'pm', 0)}</dd>

        <dt>Raio de van der Waals</dt>
        <dd className="mono">{withUnit(p.radii.vanDerWaals, 'pm', 0)}</dd>

        <dt>1ª energia de ionização</dt>
        <dd className="mono">{withUnit(p.ionizationEnergy, 'eV', 3)}</dd>

        <dt>Afinidade eletrônica</dt>
        <dd className="mono">{withUnit(p.electronAffinity, 'eV', 3)}</dd>

        <dt>Estados de oxidação</dt>
        <dd className="mono">{p.oxidationStates.length ? p.oxidationStates.map((s) => s.replace('-', '−')).join(', ') : NA}</dd>
      </dl>
      {estimated ? (
        <p className="sheet-note">
          Este elemento nunca foi obtido em quantidade visível: densidade e pontos de fusão e ebulição são estimativas
          teóricas.
        </p>
      ) : null}
      <details className="sheet-details">
        <summary>O que significa cada propriedade?</summary>
        <dl className="sheet-glossary">
          <div>
            <dt>Densidade</dt>
            <dd>Massa por unidade de volume. Para gases, é dada em gramas por litro (g/L).</dd>
          </div>
          <div>
            <dt>Pontos de fusão e de ebulição</dt>
            <dd>Temperaturas em que a substância passa de sólido a líquido e de líquido a gás, à pressão de 1 atm.</dd>
          </div>
          <div>
            <dt>Eletronegatividade</dt>
            <dd>Tendência de um átomo atrair para si os elétrons de uma ligação química (escala de Pauling, sem unidade).</dd>
          </div>
          <div>
            <dt>Raios atômicos</dt>
            <dd>
              Medidas do tamanho do átomo, em picômetros (1 pm = 10⁻¹² m). O covalente é metade da distância entre dois
              átomos iguais ligados; o de van der Waals, metade da distância entre átomos vizinhos não ligados; o
              empírico é estimado a partir de distâncias medidas em cristais e moléculas.
            </dd>
          </div>
          <div>
            <dt>1ª energia de ionização</dt>
            <dd>Energia mínima para arrancar o elétron mais externo de um átomo isolado, em elétron-volts (eV).</dd>
          </div>
          <div>
            <dt>Afinidade eletrônica</dt>
            <dd>Energia liberada quando um átomo isolado recebe um elétron extra.</dd>
          </div>
          <div>
            <dt>Estados de oxidação</dt>
            <dd>Cargas aparentes que o elemento costuma assumir ao formar compostos.</dd>
          </div>
        </dl>
      </details>
      <p className="sheet-note">Fonte: PubChem (NIH), que reúne dados do NIST, do LANL e de outras referências.</p>
    </>
  );
}

function Discovery({ el }: { el: ChemicalElement }) {
  const d = el.discovery;
  return (
    <>
      <dl className="kv sheet-kv">
        <dt>Ano</dt>
        <dd>{formatYear(d.year, d.yearLabel)}</dd>

        <dt>Descoberto por</dt>
        <dd>{d.discoverers.length ? listPt(d.discoverers) : 'Desconhecido — conhecido desde a Antiguidade'}</dd>

        <dt>Local / instituição</dt>
        <dd>{d.place ?? NA}</dd>

        <dt>{d.countries.length > 1 ? 'Países' : 'País'}</dt>
        <dd>{d.countries.length ? listPt(d.countries) : NA}</dd>

        <dt>Método</dt>
        <dd>{METHOD_LABELS[d.method]}</dd>

        {d.isolated ? (
          <>
            <dt>Isolamento</dt>
            <dd>
              {d.isolated.year}, por {listPt(d.isolated.by)}
              <span className="sheet-note">Primeira obtenção do elemento puro.</span>
            </dd>
          </>
        ) : null}
      </dl>
      {d.disputed ? (
        <aside className="info-box warn sheet-dispute" aria-label="Disputa de atribuição">
          <p className="sheet-dispute-title">
            <span aria-hidden="true">⚖</span> Disputa de atribuição
          </p>
          <p>{d.disputed}</p>
        </aside>
      ) : null}
    </>
  );
}

function Nature({ el, nature }: { el: ChemicalElement; nature: ElementContent['nature'] }) {
  const labOnly = nature.where.length === 1 && nature.where[0] === 'apenas-laboratorio';
  return (
    <>
      <p className="sheet-prose">{nature.text}</p>
      {nature.where.length ? (
        <>
          <h3 className="sheet-h3">Onde é encontrado</h3>
          <ul className="sheet-where">
            {nature.where.map((w) => (
              <li key={w} className="badge sheet-where-item">
                <span aria-hidden="true">{WHERE_LABELS[w].icon}</span>
                {w === 'apenas-laboratorio' && !labOnly ? 'Produzido em laboratório' : WHERE_LABELS[w].label}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {nature.minerals?.length ? (
        <>
          <h3 className="sheet-h3">Minerais e fontes</h3>
          <ul className="chips sheet-minerals" aria-label={`Minerais e fontes: ${el.name}`}>
            {nature.minerals.map((m) => (
              <li key={m} className="chip is-static">
                {m}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
}

function Safety({ hazards }: { hazards: ElementContent['hazards'] }) {
  const level = HAZARD_LEVELS[hazards.level];
  return (
    <>
      <div className="sheet-hazard">
        <span className={`sheet-hazard-level is-${hazards.level}`}>
          Nível de risco: <strong>{level.label}</strong>
        </span>
        <span className="sheet-hazard-meter" aria-hidden="true">
          {[1, 2, 3, 4].map((step) => (
            <span key={step} className={step <= level.step ? 'is-on' : undefined} />
          ))}
        </span>
        <span className="sr-only">({level.step} de 4)</span>
      </div>
      {hazards.flags.length ? (
        <ul className="chips sheet-flags" aria-label="Classificação de riscos">
          {hazards.flags.map((f) => (
            <li key={f} className={`chip is-static sheet-flag is-${f}`}>
              <span aria-hidden="true">{HAZARD_FLAGS[f].icon}</span>
              {HAZARD_FLAGS[f].label}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="sheet-prose">{hazards.text}</p>
    </>
  );
}

function ElementLinks({ el }: { el: ChemicalElement }) {
  const links = el.props.links;
  const ciaawRoot = /^https?:\/\/(www\.)?ciaaw\.org\/?$/i;
  const items: Array<{ href: string; label: string; detail: string }> = [];
  if (links.ciaaw && !ciaawRoot.test(links.ciaaw)) {
    items.push({ href: links.ciaaw, label: `CIAAW (IUPAC) — ${el.nameEn}`, detail: 'Peso atômico, isótopos e história do nome.' });
  }
  if (links.lanl) items.push({ href: links.lanl, label: `Los Alamos National Laboratory — ${el.nameEn}`, detail: 'História, fontes e usos.' });
  if (links.nist) items.push({ href: links.nist, label: `NIST — dados atômicos (${el.symbol})`, detail: 'Dados físicos de referência.' });
  items.push({ href: links.pubchem, label: `PubChem — ${el.nameEn}`, detail: 'Propriedades, história e segurança.' });

  return (
    <ul className="sheet-sources">
      {items.map((item) => (
        <li key={item.href}>
          <ExternalLink href={item.href}>{item.label}</ExternalLink>
          <span className="sheet-source-use">{item.detail}</span>
        </li>
      ))}
    </ul>
  );
}
