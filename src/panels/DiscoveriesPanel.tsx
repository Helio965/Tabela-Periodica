import { useMemo, useState, type ChangeEvent, type CSSProperties, type SyntheticEvent } from 'react';
import type { PanelProps } from '../components/SidePanel';
import { ElementRow } from '../components/ElementRow';
import { Icon } from '../components/Icon';
import { ELEMENTS } from '../data/elements';
import type { ChemicalElement } from '../data/types';
import {
  chronological,
  ERAS,
  eraOf,
  groupDiscoveries,
  knownBy,
  TIMELINE_END,
  TIMELINE_START,
  type Era,
  type GroupBy,
} from '../lib/timeline';
import { useStore } from '../state/store';
import { ANTIQUITY_STEP, elementsOfStep, SPEEDS, timelineLabel, useEvolution, type Speed } from './useEvolution';
import './discoveries.css';

// ---------------------------------------------------------------------------
// Dados derivados (calculados uma única vez: os elementos não mudam em tempo de execução)
// ---------------------------------------------------------------------------

const TOTAL = ELEMENTS.length;
/** Extensão do controle deslizante, em anos (Antiguidade → hoje). */
const SPAN = TIMELINE_END - ANTIQUITY_STEP;
/** Quantos grupos e itens mostrar antes de pedir "Mostrar mais". */
const GROUP_LIMIT = 12;
const ITEM_LIMIT = 10;

/** Posição relativa (0–1) de um ano no controle deslizante. */
const fractionOf = (year: number) => Math.min(1, Math.max(0, (year - ANTIQUITY_STEP) / SPAN));

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const GROUP_OPTIONS: Array<{ id: GroupBy; label: string }> = [
  { id: 'ano', label: 'Ano' },
  { id: 'descobridor', label: 'Descobridor' },
  { id: 'pais', label: 'País' },
  { id: 'periodo', label: 'Período histórico' },
  { id: 'metodo', label: 'Método' },
];

interface Tick {
  year: number;
  label: string;
  /** Ação descrita para leitores de tela. */
  aria: string;
  /** Linha superior (anos) ou inferior (extremos), para os rótulos não se sobreporem. */
  row: 'years' | 'ends';
  align: 'start' | 'center' | 'end';
}

const TICKS: Tick[] = [
  { year: TIMELINE_START, label: '1600', aria: 'Ir para 1600', row: 'years', align: 'start' },
  { year: 1700, label: '1700', aria: 'Ir para 1700', row: 'years', align: 'center' },
  { year: 1800, label: '1800', aria: 'Ir para 1800', row: 'years', align: 'center' },
  { year: 1900, label: '1900', aria: 'Ir para 1900', row: 'years', align: 'center' },
  { year: 2000, label: '2000', aria: 'Ir para 2000', row: 'years', align: 'center' },
  { year: ANTIQUITY_STEP, label: 'Antiguidade', aria: 'Ir para a Antiguidade', row: 'ends', align: 'start' },
  { year: TIMELINE_END, label: 'Hoje', aria: `Ir para hoje (${TIMELINE_END})`, row: 'ends', align: 'end' },
];

interface Decade {
  start: number;
  count: number;
}

/** Descobertas por década, de 1600 até a década atual (décadas vazias incluídas). */
const DECADES: Decade[] = (() => {
  const counts = new Map<number, number>();
  for (const el of ELEMENTS) {
    const y = el.discovery.year;
    if (y === null || y < TIMELINE_START) continue;
    const d = Math.floor(y / 10) * 10;
    counts.set(d, (counts.get(d) ?? 0) + 1);
  }
  const list: Decade[] = [];
  for (let d = TIMELINE_START; d <= TIMELINE_END; d += 10) list.push({ start: d, count: counts.get(d) ?? 0 });
  return list;
})();
const PEAK = DECADES.reduce((best, d) => (d.count > best.count ? d : best), DECADES[0]);
const HIST_H = 56;

const ERA_BY_ID = new Map(ERAS.map((era) => [era.id, era]));
const ERA_COUNTS = new Map(ERAS.map((era) => [era.id, ELEMENTS.filter((el) => eraOf(el).id === era.id).length]));
const ERA_MAX = Math.max(...ERA_COUNTS.values());

const ANCIENT = knownBy(ANTIQUITY_STEP);
const DISPUTED = chronological(ELEMENTS.filter((el) => el.discovery.disputed));

// ---------------------------------------------------------------------------
// Textos auxiliares
// ---------------------------------------------------------------------------

/** Remove explicações entre parênteses: "Lord Rayleigh (John William Strutt)" → "Lord Rayleigh". */
const shortName = (name: string) => name.replace(/\s*\([^)]*\)/g, '').trim();

/** Descobridores em forma curta: "A", "A e B" ou "A e mais N". */
function discoverersShort(el: ChemicalElement): string {
  const names = el.discovery.discoverers.map(shortName);
  if (names.length === 0) return 'não disponível';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} e ${names[1]}`;
  return `${names[0]} e mais ${names.length - 1}`;
}

/** Texto acessível do controle deslizante, ex.: "1869: 63 elementos conhecidos". */
function valueText(year: number): string {
  const label = year <= ANTIQUITY_STEP ? 'Antiguidade e Idade Média' : year >= TIMELINE_END ? `Hoje (${TIMELINE_END})` : String(year);
  return `${label}: ${plural(knownBy(year).length, 'elemento conhecido', 'elementos conhecidos')}`;
}

function eraRange(era: Era): string {
  if (!Number.isFinite(era.from)) return `até ${era.to}`;
  if (!Number.isFinite(era.to)) return `${era.from} até hoje`;
  return `${era.from}–${era.to}`;
}

/** Ano para onde a linha do tempo vai ao escolher uma era (seu último ano). */
const eraTarget = (era: Era) => (Number.isFinite(era.to) ? era.to : TIMELINE_END);

// ---------------------------------------------------------------------------
// Componentes internos
// ---------------------------------------------------------------------------

type RowHandlers = Pick<PanelProps, 'openElement' | 'pointElement'>;

/** Coluna do ano em cada linha (Antiguidade abreviada para caber). */
function YearLead({ el }: { el: ChemicalElement }) {
  if (el.discovery.year === null) return <abbr title={el.discovery.yearLabel ?? 'Antiguidade'}>Antig.</abbr>;
  return <>{el.discovery.yearLabel ?? el.discovery.year}</>;
}

/** Lista de descobertas com limite e botão para expandir. */
function DiscoveryList({
  elements,
  limit = ITEM_LIMIT,
  openElement,
  pointElement,
}: { elements: ChemicalElement[]; limit?: number } & RowHandlers) {
  const [expanded, setExpanded] = useState(false);
  // Não vale a pena esconder só um ou dois itens.
  const collapsible = elements.length > limit + 2;
  const shown = collapsible && !expanded ? elements.slice(0, limit) : elements;
  return (
    <>
      <ul className="element-list disc-list">
        {shown.map((el) => (
          <li key={el.z}>
            <ElementRow
              element={el}
              lead={<YearLead el={el} />}
              value={discoverersShort(el)}
              onClick={openElement}
              onHover={pointElement}
            />
          </li>
        ))}
      </ul>
      {collapsible ? (
        <button type="button" className="btn btn-ghost btn-sm disc-more" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
          <Icon name="chevronDown" className="disc-more-icon" />
          {expanded ? 'Mostrar menos' : `Mostrar mais ${plural(elements.length - limit, 'elemento', 'elementos')}`}
        </button>
      ) : null}
    </>
  );
}

/** Histograma de descobertas por década, alinhado ao controle deslizante. */
function Histogram({ year }: { year: number | null }) {
  const label = `Histograma de descobertas por década desde ${TIMELINE_START}. O maior número foi na década de ${PEAK.start}, com ${plural(
    PEAK.count,
    'elemento',
    'elementos',
  )}.`;
  return (
    <svg
      className="disc-hist"
      viewBox={`0 0 ${SPAN} ${HIST_H}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
    >
      {DECADES.map((d) => {
        const x = d.start - ANTIQUITY_STEP + 1;
        const w = Math.max(1, Math.min(8, SPAN - x - 1));
        const h = d.count === 0 ? 1.2 : Math.max(3, (d.count / PEAK.count) * (HIST_H - 6));
        const reached = year === null || d.start <= year;
        const current = year !== null && year >= d.start && year < d.start + 10;
        const cls = ['disc-bar', reached ? 'is-reached' : '', current ? 'is-current' : '', d.count === 0 ? 'is-empty' : '']
          .filter(Boolean)
          .join(' ');
        return (
          <rect key={d.start} className={cls} x={x} y={HIST_H - h} width={w} height={h}>
            <title>{`Década de ${d.start}: ${plural(d.count, 'elemento descoberto', 'elementos descobertos')}`}</title>
          </rect>
        );
      })}
    </svg>
  );
}

/** Explorador agrupado (ano, descobridor, país, período, método). */
function GroupExplorer({ by, openElement, pointElement }: { by: GroupBy } & RowHandlers) {
  const groups = useMemo(() => groupDiscoveries(by), [by]);
  const [showAll, setShowAll] = useState(false);
  // Conteúdo dos grupos só é montado quando aberto (listas longas ficam leves).
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set());
  const max = Math.max(...groups.map((g) => g.elements.length));
  const collapsible = groups.length > GROUP_LIMIT + 3;
  const visible = collapsible && !showAll ? groups.slice(0, GROUP_LIMIT) : groups;

  const onToggle = (key: string) => (event: SyntheticEvent<HTMLDetailsElement>) => {
    const isOpen = event.currentTarget.open;
    setOpen((prev) => {
      if (prev.has(key) === isOpen) return prev;
      const next = new Set(prev);
      if (isOpen) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  return (
    <>
      <p className="muted small disc-groups-count">
        {plural(groups.length, 'grupo', 'grupos')}
        {by === 'descobridor' || by === 'pais'
          ? ' · uma descoberta compartilhada aparece em mais de um grupo'
          : null}
      </p>
      <div className="disc-groups">
        {visible.map((g) => {
          const n = g.elements.length;
          const era = by === 'periodo' ? ERA_BY_ID.get(g.key) : undefined;
          return (
            <details key={g.key} className="disc-group" onToggle={onToggle(g.key)}>
              <summary>
                <span className="disc-group-main">
                  <span className="disc-group-label">{g.label}</span>
                  {era ? <span className="muted small"> · {eraRange(era)}</span> : null}
                  <span className="disc-group-bar" aria-hidden="true">
                    <span style={{ '--w': n / max } as CSSProperties} />
                  </span>
                </span>
                <span className="badge disc-group-count">{plural(n, 'elemento', 'elementos')}</span>
                <Icon name="chevronDown" className="disc-group-chevron" />
              </summary>
              {open.has(g.key) ? (
                <div className="disc-group-body">
                  <DiscoveryList elements={g.elements} openElement={openElement} pointElement={pointElement} />
                </div>
              ) : null}
            </details>
          );
        })}
      </div>
      {collapsible ? (
        <button type="button" className="btn btn-sm disc-more" aria-expanded={showAll} onClick={() => setShowAll((v) => !v)}>
          <Icon name="chevronDown" className="disc-more-icon" />
          {showAll ? `Mostrar só os ${GROUP_LIMIT} primeiros grupos` : `Mostrar todos os ${groups.length} grupos`}
        </button>
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------
// Painel
// ---------------------------------------------------------------------------

export default function DiscoveriesPanel({ openElement, pointElement }: PanelProps) {
  const { state, dispatch } = useStore();
  const evo = useEvolution();
  const year = state.timelineYear;
  const sliderValue = year ?? TIMELINE_END;
  const known = year === null ? TOTAL : knownBy(year).length;
  const fraction = fractionOf(sliderValue);

  const setYear = (next: number | null) => {
    if (evo.playing) evo.pause();
    dispatch({ type: 'setTimelineYear', year: next });
    // Movimento manual: nenhum cartão "recém-descoberto" deve continuar piscando.
    if (state.freshlyDiscovered.length) dispatch({ type: 'setFresh', z: [] });
  };

  const onSlide = (event: ChangeEvent<HTMLInputElement>) => setYear(Number(event.target.value));

  const latest = evo.currentStep !== null ? elementsOfStep(evo.currentStep) : [];
  const stepIndex = evo.currentStep !== null ? evo.steps.indexOf(evo.currentStep) + 1 : null;

  let playLabel = 'Ver evolução da tabela';
  if (evo.playing) playLabel = 'Pausar';
  else if (year !== null && evo.atEnd) playLabel = 'Recomeçar do início';
  else if (year !== null) playLabel = 'Continuar';

  let heroEyebrow = 'Ano';
  if (year === null) heroEyebrow = 'Tabela completa';
  else if (year <= ANTIQUITY_STEP) heroEyebrow = `Antes de ${TIMELINE_START}`;
  else if (year >= TIMELINE_END) heroEyebrow = `Ano de ${TIMELINE_END}`;

  return (
    <div className="disc-panel">
      <p className="panel-lead">
        Veja como a tabela periódica foi sendo preenchida: dos metais usados desde a Antiguidade aos elementos superpesados
        criados em aceleradores. Os cartões ainda não descobertos no ano escolhido ficam apagados na cena.
      </p>

      {/* Ano atual e quantidade de elementos conhecidos */}
      <div className={`disc-hero${evo.playing ? ' is-playing' : ''}`} style={{ '--f': known / TOTAL } as CSSProperties}>
        <span className="disc-hero-eyebrow">{heroEyebrow}</span>
        <span className="disc-hero-year" key={timelineLabel(year)}>
          {timelineLabel(year)}
        </span>
        <span className="disc-hero-count">
          <strong>{known}</strong> {known === 1 ? 'elemento conhecido' : 'elementos conhecidos'}
          <span className="muted"> de {TOTAL}</span>
        </span>
        <span className="disc-hero-meter" aria-hidden="true">
          <span />
        </span>
      </div>

      {/* Linha do tempo: histograma + controle deslizante + marcos */}
      <section className="panel-section" aria-labelledby="disc-timeline-title">
        <h3 className="section-title" id="disc-timeline-title">
          Linha do tempo
        </h3>
        <div className="disc-timeline" style={{ '--f': fraction } as CSSProperties}>
          <Histogram year={year} />
          <div className="disc-slider">
            <input
              type="range"
              className="disc-range"
              id="disc-year"
              min={ANTIQUITY_STEP}
              max={TIMELINE_END}
              step={1}
              value={sliderValue}
              onChange={onSlide}
              aria-label="Ano da linha do tempo"
              aria-valuetext={valueText(sliderValue)}
            />
          </div>
          <div className="disc-ticks">
            {TICKS.map((t) => (
              <button
                key={t.year}
                type="button"
                className={`disc-tick row-${t.row} align-${t.align}${sliderValue >= t.year ? ' is-reached' : ''}`}
                style={{ '--t': fractionOf(t.year) } as CSSProperties}
                aria-label={t.aria}
                onClick={() => setYear(t.year)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="disc-timeline-actions">
          <button type="button" className="btn btn-sm" onClick={() => setYear(null)} disabled={year === null}>
            Mostrar todos
          </button>
          <span className="muted small">Use as setas do teclado para mudar ano a ano.</span>
        </div>
      </section>

      {/* Reprodução automática */}
      <section className="panel-section" aria-labelledby="disc-play-title">
        <h3 className="section-title" id="disc-play-title">
          Evolução da tabela
        </h3>
        <div className="disc-player">
          <button
            type="button"
            className="btn btn-icon disc-step"
            onClick={evo.goPrev}
            disabled={evo.prevStep === null}
            title="Voltar à descoberta anterior"
            aria-label={evo.prevStep === null ? 'Voltar' : `Voltar para ${timelineLabel(evo.prevStep)}`}
          >
            <Icon name="prev" />
          </button>
          <button
            type="button"
            className={`btn btn-primary disc-play${evo.playing ? ' is-playing' : ''}`}
            onClick={evo.toggle}
          >
            <Icon name={evo.playing ? 'pause' : 'play'} />
            {playLabel}
          </button>
          <button
            type="button"
            className="btn btn-icon disc-step"
            onClick={evo.goNext}
            disabled={evo.nextStep === null}
            title="Avançar para a próxima descoberta"
            aria-label={evo.nextStep === null ? 'Avançar' : `Avançar para ${timelineLabel(evo.nextStep)}`}
          >
            <Icon name="next" />
          </button>
          <label className="disc-speed">
            <span>Velocidade</span>
            <select className="select" value={evo.speed} onChange={(e) => evo.setSpeed(e.target.value as Speed)}>
              {SPEEDS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="muted small disc-player-status">
          {stepIndex === null
            ? `${evo.steps.length} etapas: a Antiguidade e cada ano em que houve uma descoberta.`
            : `Etapa ${stepIndex} de ${evo.steps.length}${evo.playing ? ' · reproduzindo' : ''}`}
        </p>

        <div className="disc-views" role="group" aria-label="Disposição dos cartões na cena">
          <button
            type="button"
            className="btn btn-sm"
            aria-pressed={state.layout === 'timeline'}
            onClick={() => dispatch({ type: 'setLayout', layout: 'timeline' })}
          >
            <Icon name="cube" size={16} />
            Ver na linha do tempo 3D
          </button>
          <button
            type="button"
            className="btn btn-sm"
            aria-pressed={state.layout === 'table'}
            onClick={() => dispatch({ type: 'setLayout', layout: 'table' })}
          >
            Ver na tabela
          </button>
        </div>
      </section>

      {/* Descobertas mais recentes até o ano escolhido */}
      {year !== null && evo.currentStep !== null && latest.length ? (
        <section className="panel-section" aria-labelledby="disc-latest-title">
          <h3 className="section-title" id="disc-latest-title">
            {evo.currentStep <= ANTIQUITY_STEP ? 'Conhecidos antes de 1600' : `Descobertos em ${evo.currentStep}`}
          </h3>
          {evo.currentStep !== year && year < TIMELINE_END ? (
            <p className="muted small">Descoberta mais recente até {timelineLabel(year)}.</p>
          ) : null}
          <div className="disc-latest" key={evo.currentStep}>
            <DiscoveryList elements={latest} limit={12} openElement={openElement} pointElement={pointElement} />
          </div>
        </section>
      ) : null}

      {/* Resumo por era */}
      <section className="panel-section" aria-labelledby="disc-eras-title">
        <h3 className="section-title" id="disc-eras-title">
          Descobertas por período
        </h3>
        <ul className="disc-eras">
          {ERAS.map((era) => {
            const count = ERA_COUNTS.get(era.id) ?? 0;
            const current = year !== null && year >= era.from && year <= era.to;
            return (
              <li key={era.id}>
                <button
                  type="button"
                  className={`disc-era${current ? ' is-current' : ''}`}
                  style={{ '--w': count / ERA_MAX } as CSSProperties}
                  aria-label={`${era.label} (${eraRange(era)}): ${plural(count, 'elemento', 'elementos')}. Mostrar a tabela até ${
                    eraTarget(era) >= TIMELINE_END ? 'hoje' : eraTarget(era)
                  }.`}
                  aria-current={current ? 'step' : undefined}
                  onClick={() => setYear(eraTarget(era))}
                >
                  <span className="disc-era-label">{era.label}</span>
                  <span className="disc-era-range">{eraRange(era)}</span>
                  <span className="disc-era-count">{count}</span>
                  <span className="disc-era-bar" aria-hidden="true">
                    <span />
                  </span>
                  {current ? <span className="disc-era-here">Você está aqui</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Explorador agrupado */}
      <section className="panel-section" aria-labelledby="disc-groups-title">
        <h3 className="section-title" id="disc-groups-title">
          Explorar descobertas
        </h3>
        <div className="seg disc-groupby" role="group" aria-label="Agrupar descobertas por">
          {GROUP_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              aria-pressed={state.discoveriesGroupBy === o.id}
              onClick={() => dispatch({ type: 'setGroupBy', groupBy: o.id })}
            >
              {o.label}
            </button>
          ))}
        </div>
        <GroupExplorer
          key={state.discoveriesGroupBy}
          by={state.discoveriesGroupBy}
          openElement={openElement}
          pointElement={pointElement}
        />
      </section>

      {/* Disputas de atribuição */}
      <section className="panel-section" aria-labelledby="disc-disputes-title">
        <h3 className="section-title" id="disc-disputes-title">
          Quem descobriu primeiro?
        </h3>
        <div className="info-box">
          <p>
            <strong>Nem toda descoberta tem data e autoria indiscutíveis.</strong> Houve descobertas simultâneas e independentes,
            elementos identificados anos antes de serem isolados puros e disputas de prioridade entre laboratórios.
          </p>
          <p>
            Aqui usamos um ano de referência para cada elemento. Em {DISPUTED.length} dos {TOTAL} elementos há divergências
            registradas; abra a ficha do elemento para ler os detalhes.
          </p>
          <details className="disc-disputes">
            <summary>
              <Icon name="chevronDown" className="disc-group-chevron" />
              Ver os {DISPUTED.length} elementos com divergências
            </summary>
            <DiscoveryList elements={DISPUTED} openElement={openElement} pointElement={pointElement} />
          </details>
        </div>
      </section>

      {/* Conhecidos desde a Antiguidade */}
      <section className="panel-section" aria-labelledby="disc-ancient-title">
        <h3 className="section-title" id="disc-ancient-title">
          Conhecidos desde a Antiguidade
        </h3>
        <p className="muted small">
          Estes {ANCIENT.length} elementos já eram conhecidos antes de 1600, muito antes da química moderna. Para a maioria não há
          descobridor identificado: eram usados desde a pré-história ou a Antiguidade.
        </p>
        <DiscoveryList elements={ANCIENT} limit={ANCIENT.length} openElement={openElement} pointElement={pointElement} />
      </section>
    </div>
  );
}
