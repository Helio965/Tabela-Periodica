import { useId, useMemo, useState, type CSSProperties } from 'react';
import { PANEL_TITLES, type PanelProps } from '../components/SidePanel';
import { Icon } from '../components/Icon';
import { CATEGORY_BY_ID } from '../data/categories';
import { getElement } from '../data/elements';
import { LEARN_TOPICS, focusActions, isFocusActive, type LearnTopic, type TableFocus } from '../data/learn';
import { announce } from '../lib/announce';
import { FILTER_BY_ID } from '../lib/filters';
import { normalize } from '../lib/text';
import { TREND_BY_ID } from '../lib/trends';
import { useStore } from '../state/store';
import './learn.css';

// ---------------------------------------------------------------------------
// Componentes compartilhados com o painel "História da Tabela Periódica"
// ---------------------------------------------------------------------------

/** Descrição curta do destaque, usada no botão e nos anúncios. */
function describeFocus(focus: TableFocus): string {
  switch (focus.kind) {
    case 'group':
      return `grupo ${focus.group}`;
    case 'period':
      return `período ${focus.period}`;
    case 'category':
      return CATEGORY_BY_ID[focus.category].label.toLowerCase();
    case 'filter':
      return `filtro "${FILTER_BY_ID[focus.filter].label}"`;
    case 'trend':
      return TREND_BY_ID[focus.trend].label.toLowerCase();
    case 'panel':
      return PANEL_TITLES[focus.panel];
  }
}

const isSmallScreen = () => typeof window !== 'undefined' && Boolean(window.matchMedia?.('(max-width: 900px)').matches);

/**
 * Botão "Ver na tabela": aplica um destaque (grupo, período, categoria ou
 * filtro) a partir de uma seleção limpa, ou leva a outro modo (tendências,
 * história). Clicar de novo remove o destaque.
 */
export function FocusButton({ focus }: { focus: TableFocus }) {
  const { state, dispatch } = useStore();
  const description = describeFocus(focus);
  const navigates = focus.kind === 'trend' || focus.kind === 'panel';
  const active = isFocusActive(focus, state);

  const onClick = () => {
    if (active) {
      dispatch({ type: 'clearFocus' });
      announce('Destaque removido');
      return;
    }
    for (const action of focusActions(focus)) dispatch(action);
    if (navigates) return;
    announce(`Em destaque na tabela: ${description}`);
    // No celular o painel cobre parte da tabela: recolhe a gaveta para mostrar o destaque.
    if (isSmallScreen()) dispatch({ type: 'togglePanel', open: false });
  };

  if (navigates) {
    const text = focus.kind === 'trend' ? 'Ver a tendência na tabela' : `Abrir "${description}"`;
    return (
      <button type="button" className="btn btn-sm learn-focus-btn" onClick={onClick}>
        <Icon name={focus.kind === 'trend' ? 'atom' : 'book'} size={16} />
        <span>
          {text}
          {focus.kind === 'trend' ? <span className="learn-focus-desc"> · {description}</span> : null}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`btn btn-sm learn-focus-btn${active ? ' btn-primary' : ''}`}
      aria-pressed={active}
      onClick={onClick}
    >
      <Icon name={active ? 'reset' : 'cube'} size={16} />
      <span>
        {active ? 'Remover destaque' : 'Ver na tabela'}
        <span className="learn-focus-desc"> · {description}</span>
      </span>
    </button>
  );
}

interface ElementChipsProps extends PanelProps {
  zs: number[];
  label: string;
}

/** Atalhos para os elementos citados: o foco/hover aponta o elemento na cena e o clique abre a ficha. */
export function ElementChips({ zs, label, openElement, pointElement }: ElementChipsProps) {
  const labelId = useId();
  return (
    <div className="learn-elements">
      <span className="learn-elements-label" id={labelId}>
        {label}
      </span>
      <ul className="chips learn-chip-list" aria-labelledby={labelId}>
        {zs.map((z) => {
          const el = getElement(z);
          return (
            <li key={z}>
              <button
                type="button"
                className="chip learn-el-chip"
                style={{ '--chip-color': CATEGORY_BY_ID[el.category].color } as CSSProperties}
                aria-label={`${el.name} (${el.symbol}), número atômico ${el.z}: abrir ficha`}
                onClick={() => openElement(z)}
                onPointerEnter={() => pointElement(z)}
                onPointerLeave={() => pointElement(null)}
                onFocus={() => pointElement(z)}
                onBlur={() => pointElement(null)}
              >
                <span className="dot" aria-hidden="true" />
                <strong>{el.symbol}</strong>
                <span>{el.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Busca
// ---------------------------------------------------------------------------

/** Texto pesquisável de cada tópico (sem acentos), incluindo nomes e símbolos dos elementos citados. */
const SEARCH_INDEX = new Map(
  LEARN_TOPICS.map((t) => {
    const elements = (t.related ?? []).map((z) => `${getElement(z).name} ${getElement(z).symbol}`);
    return [t.id, normalize([t.question, ...t.answer, t.example ?? '', ...elements].join(' '))];
  }),
);

function searchTopics(query: string): LearnTopic[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return LEARN_TOPICS;
  return LEARN_TOPICS.filter((t) => terms.every((term) => SEARCH_INDEX.get(t.id)?.includes(term)));
}

const NUMBER_OF = new Map(LEARN_TOPICS.map((t, i) => [t.id, i + 1]));

// ---------------------------------------------------------------------------
// Painel
// ---------------------------------------------------------------------------

export default function LearnPanel({ openElement, pointElement }: PanelProps) {
  const uid = useId();
  const [query, setQuery] = useState('');
  // Fora da busca, só abre o que a pessoa escolher; durante a busca, os resultados aparecem abertos.
  const [opened, setOpened] = useState<Set<string>>(() => new Set([LEARN_TOPICS[0].id]));
  const [closedInSearch, setClosedInSearch] = useState<Set<string>>(() => new Set());

  const searching = query.trim() !== '';
  const visible = useMemo(() => searchTopics(query), [query]);
  const isOpen = (id: string) => (searching ? !closedInSearch.has(id) : opened.has(id));
  const allOpen = visible.length > 0 && visible.every((t) => isOpen(t.id));

  const toggle = (id: string) => {
    const flip = (set: Set<string>) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    };
    if (searching) setClosedInSearch(flip);
    else setOpened(flip);
  };

  const setAll = (open: boolean) => {
    if (searching) setClosedInSearch(open ? new Set() : new Set(visible.map((t) => t.id)));
    else setOpened(open ? new Set(LEARN_TOPICS.map((t) => t.id)) : new Set());
  };

  const changeQuery = (value: string) => {
    setQuery(value);
    setClosedInSearch(new Set());
  };

  const searchId = `${uid}-busca`;

  return (
    <div className="learn">
      <p className="panel-lead">
        Respostas curtas para as dúvidas mais comuns sobre a tabela periódica. Use &quot;Ver na tabela&quot; para destacar os elementos de cada
        explicação e clique em um elemento para abrir a ficha completa.
      </p>

      <div className="learn-toolbar">
        <div className="field learn-search">
          <label htmlFor={searchId}>Buscar nas perguntas</label>
          <div className="learn-search-box">
            <Icon name="search" size={16} className="learn-search-icon" />
            <input
              id={searchId}
              className="input"
              type="search"
              value={query}
              placeholder="Ex.: isótopo, meia-vida, grupo"
              autoComplete="off"
              onChange={(e) => changeQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && query) {
                  e.preventDefault();
                  changeQuery('');
                }
              }}
            />
          </div>
        </div>
        <div className="learn-toolbar-row">
          <p className="muted small learn-count" role="status" aria-live="polite">
            {searching
              ? `${visible.length} de ${LEARN_TOPICS.length} perguntas encontradas`
              : `${LEARN_TOPICS.length} perguntas`}
          </p>
          {visible.length > 0 ? (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAll(!allOpen)}>
              {allOpen ? 'Recolher todas' : 'Abrir todas'}
            </button>
          ) : null}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="info-box learn-empty">
          <p>
            Nenhuma pergunta menciona &quot;{query.trim()}&quot;. Tente outra palavra, como &quot;massa&quot;, &quot;elétron&quot; ou
            &quot;Mendeleev&quot;.
          </p>
          <button type="button" className="btn btn-sm" onClick={() => changeQuery('')}>
            <Icon name="close" size={16} />
            Limpar busca
          </button>
        </div>
      ) : (
        <ul className="learn-list">
          {visible.map((topic) => {
            const open = isOpen(topic.id);
            const buttonId = `${uid}-q-${topic.id}`;
            const answerId = `${uid}-a-${topic.id}`;
            return (
              <li key={topic.id} className={`learn-item${open ? ' is-open' : ''}`}>
                <h3 className="learn-q">
                  <button type="button" id={buttonId} aria-expanded={open} aria-controls={answerId} onClick={() => toggle(topic.id)}>
                    <span className="learn-num" aria-hidden="true">
                      {NUMBER_OF.get(topic.id)}
                    </span>
                    <span className="learn-q-text">{topic.question}</span>
                    <Icon name="chevronDown" className="learn-chevron" />
                  </button>
                </h3>
                <div id={answerId} className="learn-answer" hidden={!open}>
                  {topic.answer.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {topic.example ? (
                    <div className="learn-example">
                      <span className="learn-example-label">Exemplo</span>
                      <p>{topic.example}</p>
                    </div>
                  ) : null}
                  {topic.related?.length ? (
                    <ElementChips zs={topic.related} label="Elementos citados" openElement={openElement} pointElement={pointElement} />
                  ) : null}
                  {topic.focus ? (
                    <div className="learn-actions">
                      <FocusButton focus={topic.focus} />
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
