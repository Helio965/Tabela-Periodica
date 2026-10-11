import { useId, useState, type CSSProperties } from 'react';
import type { PanelProps } from '../components/SidePanel';
import { ElementRow } from '../components/ElementRow';
import { Icon } from '../components/Icon';
import { CATEGORIES, CATEGORY_BY_ID } from '../data/categories';
import { ELEMENTS, ELEMENT_BY_Z } from '../data/elements';
import { SHELL_LETTERS } from '../data/elements/shells';
import type { ChemicalElement } from '../data/types';
import { FILTERS, FILTER_BY_ID, applyFilters, type FilterDef } from '../lib/filters';
import { formatHalfLife, formatMass } from '../lib/format';
import { rankByMass, type RankingKind, type RankingSize } from '../lib/ranking';
import { computeVisuals } from '../lib/visuals';
import { useStore } from '../state/store';
import type { AppState } from '../state/types';
import './explore.css';

// ---------------------------------------------------------------------------
// Dados derivados (calculados uma única vez, a partir da camada de dados)
// ---------------------------------------------------------------------------

const TOTAL = ELEMENTS.length;

/** Filtros agrupados pela seção, na ordem em que aparecem em FILTERS. */
const FILTER_SECTIONS: Array<{ section: FilterDef['section']; filters: FilterDef[] }> = [];
for (const f of FILTERS) {
  const group = FILTER_SECTIONS.find((s) => s.section === f.section);
  if (group) group.filters.push(f);
  else FILTER_SECTIONS.push({ section: f.section, filters: [f] });
}

/** Quantos elementos cada filtro seleciona sozinho. */
const FILTER_COUNTS = new Map(FILTERS.map((f) => [f.id, applyFilters(ELEMENTS, [f.id]).length]));

const CATEGORY_COUNTS = new Map(CATEGORIES.map((c) => [c.id, ELEMENTS.filter((el) => el.category === c.id).length]));
const PREDICTED_CATEGORY_COUNT = ELEMENTS.filter((el) => el.categoryPredicted).length;

const RADIOACTIVE = ELEMENTS.filter((el) => el.radioactive);
const VERY_WEAK = ELEMENTS.filter((el) => el.radioactivity === 'very-weak');

/** Meia-vida de um isótopo específico (dados NUBASE2020), ou `null` se ausente. */
function halfLifeOf(z: number, massNumber: number): string | null {
  const el = ELEMENT_BY_Z.get(z);
  const iso = el?.isotopes.find((i) => i.massNumber === massNumber && !i.isomer && i.halfLife);
  if (!el || !iso) return null;
  return `${el.name.toLowerCase()}-${massNumber} (${formatHalfLife(iso.halfLife)})`;
}

/** Exemplos de meia-vida, do curtíssimo ao longuíssimo — sempre lidos dos dados. */
const HALF_LIFE_EXAMPLES = [halfLifeOf(6, 14), halfLifeOf(92, 238), halfLifeOf(118, 294)].filter(
  (x): x is string => x !== null,
);

/** Elementos cuja "massa" exibida é o número de massa do isótopo de vida mais longa. */
const MASS_NUMBER_ELEMENTS = ELEMENTS.filter((el) => el.massIsMassNumber);
const ALL_SYNTHETIC_USE_MASS_NUMBER = ELEMENTS.filter((el) => el.occurrence === 'synthetic').every((el) => el.massIsMassNumber);

const GROUPS = Array.from({ length: 18 }, (_, i) => i + 1);
const PERIODS = Array.from({ length: 7 }, (_, i) => i + 1);

/** Nomes didáticos das famílias (grupos 3 a 12 são os metais de transição). */
const GROUP_NAMES: Record<number, string> = {
  1: 'hidrogênio e metais alcalinos',
  2: 'metais alcalino-terrosos',
  13: 'família do boro',
  14: 'família do carbono',
  15: 'família do nitrogênio',
  16: 'calcogênios (família do oxigênio)',
  17: 'halogênios',
  18: 'gases nobres',
};

const GROUP_NOTES: Record<number, string> = {
  1: 'O hidrogênio fica no grupo 1 por ter um único elétron de valência, mas não é um metal alcalino.',
  3: 'Nesta tabela, lantanídeos e actinídeos aparecem nas duas linhas separadas abaixo (bloco f) e não são atribuídos a um grupo.',
  18: 'O hélio fica no grupo 18 por ter a camada completa, embora tenha apenas 2 elétrons.',
};

const groupName = (g: number) => GROUP_NAMES[g] ?? 'metais de transição (bloco d)';

const RANKING_KINDS: Array<{ kind: RankingKind; label: string }> = [
  { kind: 'lightest', label: 'Mais leves' },
  { kind: 'heaviest', label: 'Mais pesados' },
];
const RANKING_SIZES: RankingSize[] = [5, 10, 20];

const joinPt = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Quantos elementos continuam destacados (sem contar o destaque temporário da legenda). */
function countHighlighted(state: AppState): number {
  let n = 0;
  for (const v of computeVisuals({ ...state, legendHover: null }).values()) if (!v.dim) n++;
  return n;
}

/** Descrição textual do que está ativo (para não depender só do visual da tabela). */
function describeSelection(state: AppState): string[] {
  const parts: string[] = [];
  if (state.filters.length) parts.push(state.filters.map((id) => FILTER_BY_ID[id].label).join(' + '));
  if (state.categoryFocus) parts.push(`categoria ${CATEGORY_BY_ID[state.categoryFocus].label.toLowerCase()}`);
  if (state.groupFocus !== null) parts.push(`grupo ${state.groupFocus}`);
  if (state.periodFocus !== null) parts.push(`período ${state.periodFocus}`);
  if (state.ranking) {
    const kind = state.ranking.kind === 'lightest' ? 'mais leves' : 'mais pesados';
    parts.push(`top ${state.ranking.size} ${kind}`);
  }
  return parts;
}

// ---------------------------------------------------------------------------
// Painel
// ---------------------------------------------------------------------------

export default function ExplorePanel({ openElement, pointElement }: PanelProps) {
  const { state, dispatch } = useStore();
  const uid = useId();
  // Tamanho preferido do ranking, lembrado mesmo com o ranking desligado.
  const [preferredSize, setPreferredSize] = useState<RankingSize>(state.ranking?.size ?? 10);

  const highlighted = countHighlighted(state);
  const selection = describeSelection(state);
  const anyActive = selection.length > 0;

  const ranking = state.ranking ? rankByMass(state.ranking.kind, state.ranking.size) : null;

  const setRanking = (kind: RankingKind | null, size: RankingSize = preferredSize) => {
    setPreferredSize(size);
    dispatch({ type: 'setRanking', ranking: kind ? { kind, size } : null });
  };

  const favorites = state.favorites.map((z) => ELEMENT_BY_Z.get(z)).filter((el): el is ChemicalElement => Boolean(el));
  const recent = state.recent.map((z) => ELEMENT_BY_Z.get(z)).filter((el): el is ChemicalElement => Boolean(el));

  const ids = {
    filters: `${uid}-filtros`,
    ranking: `${uid}-ranking`,
    groups: `${uid}-grupos`,
    groupRow: `${uid}-linha-grupos`,
    periodRow: `${uid}-linha-periodos`,
    legend: `${uid}-legenda`,
    favorites: `${uid}-favoritos`,
    recent: `${uid}-recentes`,
  };

  return (
    <div className="explore">
      <p className="panel-lead">
        Filtre, destaque e ordene os {TOTAL} elementos. Tudo o que você escolher aqui aparece destacado na visualização dos elementos. Clique em um
        elemento para abrir a ficha completa.
      </p>

      <div className="explore-status">
        <p className="explore-count" role="status" aria-live="polite">
          <strong className="mono">{highlighted}</strong> de {TOTAL} elementos destacados
          {anyActive ? <span className="explore-selection">Seleção: {selection.join(' · ')}</span> : null}
        </p>
        {anyActive ? (
          <button type="button" className="btn btn-sm" onClick={() => dispatch({ type: 'clearFocus' })}>
            <Icon name="reset" size={16} />
            Limpar seleção
          </button>
        ) : null}
      </div>
      {anyActive && highlighted === 0 ? (
        <p className="info-box warn small explore-empty">
          Nenhum elemento atende a todos os critérios ao mesmo tempo. Remova um dos filtros ou destaques para ver resultados.
        </p>
      ) : null}

      {/* Filtros ------------------------------------------------------------ */}
      <section className="panel-section" aria-labelledby={ids.filters}>
        <h2 className="section-title" id={ids.filters}>
          Filtros
        </h2>
        <p className="muted small">
          Os filtros se combinam (E lógico): o elemento precisa atender a <strong>todos</strong> os filtros escolhidos. Ex.:
          Radioativos + Sólidos.
        </p>
        <div className="chips explore-all">
          <button
            type="button"
            className="chip"
            aria-pressed={state.filters.length === 0}
            onClick={() => dispatch({ type: 'setFilters', filters: [] })}
          >
            Todos
            <span className="chip-count" aria-hidden="true">
              {TOTAL}
            </span>
          </button>
        </div>
        {FILTER_SECTIONS.map(({ section, filters }) => {
          const headingId = `${uid}-secao-${section.replace(/\s+/g, '-')}`;
          return (
            <div key={section} className="explore-filter-group" role="group" aria-labelledby={headingId}>
              <h3 className="explore-subtitle" id={headingId}>
                {section}
              </h3>
              <div className="chips">
                {filters.map((f) => {
                  const count = FILTER_COUNTS.get(f.id) ?? 0;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      className={`chip${f.id === 'radioativos' ? ' chip-rad' : ''}`}
                      aria-pressed={state.filters.includes(f.id)}
                      onClick={() => dispatch({ type: 'toggleFilter', filter: f.id })}
                    >
                      {f.icon ? (
                        <span className="chip-icon" aria-hidden="true">
                          {f.icon}
                        </span>
                      ) : null}
                      {f.label}
                      <span className="chip-count" aria-hidden="true">
                        {count}
                      </span>
                      <span className="sr-only">, {plural(count, 'elemento', 'elementos')}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {state.filters.length ? (
          <div className="explore-infos">
            {state.filters.map((id) => {
              const f = FILTER_BY_ID[id];
              return (
                <div key={id} className="info-box small">
                  <strong>
                    {f.icon ? <span aria-hidden="true">{f.icon} </span> : null}
                    {f.label}:
                  </strong>{' '}
                  {f.info}
                </div>
              );
            })}
            {state.filters.includes('radioativos') ? <RadioactivityBox /> : null}
          </div>
        ) : null}
      </section>

      {/* Rankings ----------------------------------------------------------- */}
      <section className="panel-section" aria-labelledby={ids.ranking}>
        <h2 className="section-title" id={ids.ranking}>
          Ranking por massa atômica
        </h2>
        <div className="explore-controls">
          <div className="seg" role="group" aria-label="Tipo de ranking">
            <button type="button" aria-pressed={state.ranking === null} onClick={() => setRanking(null)}>
              Desligado
            </button>
            {RANKING_KINDS.map(({ kind, label }) => (
              <button
                key={kind}
                type="button"
                aria-pressed={state.ranking?.kind === kind}
                onClick={() => setRanking(kind, state.ranking?.size ?? preferredSize)}
              >
                {label}
              </button>
            ))}
          </div>
          {state.ranking ? (
            <div className="seg" role="group" aria-label="Quantidade de elementos no ranking">
              {RANKING_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-pressed={state.ranking?.size === size}
                  onClick={() => setRanking(state.ranking?.kind ?? 'lightest', size)}
                >
                  Top {size}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {ranking && state.ranking ? (
          <>
            <ol className="element-list explore-ranking" aria-label={`Os ${ranking.length} elementos ${state.ranking.kind === 'lightest' ? 'mais leves' : 'mais pesados'}`}>
              {ranking.map((el, i) => (
                <li key={el.z}>
                  <ElementRow
                    element={el}
                    lead={`${i + 1}º`}
                    value={`${formatMass(el.atomicMassDisplay)} u`}
                    detail={el.massIsMassNumber ? 'número de massa' : undefined}
                    onClick={openElement}
                    onHover={pointElement}
                  />
                </li>
              ))}
            </ol>
            <RankingNote list={ranking} kind={state.ranking.kind} />
          </>
        ) : (
          <p className="muted small explore-hint">
            Escolha “Mais leves” ou “Mais pesados” para numerar os elementos na tabela pela massa atômica.
          </p>
        )}
      </section>

      {/* Grupos e períodos -------------------------------------------------- */}
      <section className="panel-section" aria-labelledby={ids.groups}>
        <h2 className="section-title" id={ids.groups}>
          Grupos e períodos
        </h2>
        <p className="muted small">
          Destaque uma coluna (grupo) ou uma linha (período). Também é possível clicar nos números ao redor da tabela 3D.
        </p>

        <h3 className="explore-subtitle" id={ids.groupRow}>
          Grupos (colunas)
        </h3>
        <div className="explore-numbers" role="group" aria-labelledby={ids.groupRow}>
          {GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              className="explore-num"
              aria-pressed={state.groupFocus === g}
              aria-label={`Grupo ${g}`}
              onClick={() => dispatch({ type: 'toggleGroup', group: g })}
            >
              {g}
            </button>
          ))}
        </div>

        <h3 className="explore-subtitle" id={ids.periodRow}>
          Períodos (linhas)
        </h3>
        <div className="explore-numbers" role="group" aria-labelledby={ids.periodRow}>
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              className="explore-num"
              aria-pressed={state.periodFocus === p}
              aria-label={`Período ${p}`}
              onClick={() => dispatch({ type: 'togglePeriod', period: p })}
            >
              {p}
            </button>
          ))}
        </div>

        {state.groupFocus !== null ? <GroupInfo group={state.groupFocus} /> : null}
        {state.periodFocus !== null ? <PeriodInfo period={state.periodFocus} /> : null}
      </section>

      {/* Legenda completa --------------------------------------------------- */}
      <section className="panel-section" aria-labelledby={ids.legend}>
        <h2 className="section-title" id={ids.legend}>
          Categorias
        </h2>
        <p className="muted small">
          Passe o mouse (ou o foco do teclado) sobre uma categoria para destacá-la; clique para fixar o destaque. Cada categoria
          tem também uma sigla, para não depender só da cor.
        </p>
        <ul className="explore-legend">
          {CATEGORIES.map((c) => {
            const count = CATEGORY_COUNTS.get(c.id) ?? 0;
            const descId = `${uid}-cat-${c.id}`;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  className="explore-cat"
                  style={{ '--chip-color': c.color } as CSSProperties}
                  aria-pressed={state.categoryFocus === c.id}
                  aria-label={`${c.label}, sigla ${c.code}, ${plural(count, 'elemento', 'elementos')}`}
                  aria-describedby={descId}
                  onClick={() => dispatch({ type: 'toggleCategoryFocus', category: c.id })}
                  onPointerEnter={() => dispatch({ type: 'setLegendHover', category: c.id })}
                  onPointerLeave={() => dispatch({ type: 'setLegendHover', category: null })}
                  onFocus={() => dispatch({ type: 'setLegendHover', category: c.id })}
                  onBlur={() => dispatch({ type: 'setLegendHover', category: null })}
                >
                  <span className="explore-cat-head">
                    <span className="dot" aria-hidden="true" />
                    <span className="explore-cat-label">{c.label}</span>
                    <span className="explore-cat-code" aria-hidden="true">
                      {c.code}
                    </span>
                    <span className="explore-cat-count" aria-hidden="true">
                      {plural(count, 'elemento', 'elementos')}
                    </span>
                  </span>
                  <span className="explore-cat-desc" id={descId}>
                    {c.description}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="muted small explore-hint">
          As categorias seguem a convenção mais usada em materiais didáticos; a IUPAC não define oficialmente todas elas (por
          exemplo, “metais pós-transição”).
          {PREDICTED_CATEGORY_COUNT > 0
            ? ` ${plural(PREDICTED_CATEGORY_COUNT, 'elemento superpesado tem', 'elementos superpesados têm')} categoria apenas prevista pela teoria (borda tracejada nos cartões).`
            : null}
        </p>
      </section>

      {/* Favoritos e recentes ---------------------------------------------- */}
      {favorites.length ? (
        <section className="panel-section" aria-labelledby={ids.favorites}>
          <h2 className="section-title" id={ids.favorites}>
            <span aria-hidden="true">★ </span>Favoritos
          </h2>
          <ul className="element-list">
            {favorites.map((el) => (
              <li key={el.z}>
                <ElementRow
                  element={el}
                  value={`${formatMass(el.atomicMassDisplay)} u`}
                  detail={CATEGORY_BY_ID[el.category].label}
                  onClick={openElement}
                  onHover={pointElement}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {recent.length ? (
        <section className="panel-section" aria-labelledby={ids.recent}>
          <div className="explore-section-head">
            <h2 className="section-title" id={ids.recent}>
              Vistos recentemente
            </h2>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => dispatch({ type: 'hydrate', state: { recent: [] } })}
            >
              Limpar histórico
            </button>
          </div>
          <ul className="element-list">
            {recent.map((el) => (
              <li key={el.z}>
                <ElementRow
                  element={el}
                  value={`${formatMass(el.atomicMassDisplay)} u`}
                  detail={CATEGORY_BY_ID[el.category].label}
                  onClick={openElement}
                  onHover={pointElement}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Blocos auxiliares
// ---------------------------------------------------------------------------

/** Explicação didática sobre radioatividade, exibida com o filtro "Radioativos". */
function RadioactivityBox() {
  // Primeiro Z a partir do qual todos os elementos são radioativos.
  let fromZ = TOTAL + 1;
  for (let i = ELEMENTS.length - 1; i >= 0 && ELEMENTS[i].radioactive; i--) fromZ = ELEMENTS[i].z;
  const before = RADIOACTIVE.filter((el) => el.z < fromZ);
  const fromEl = ELEMENT_BY_Z.get(fromZ);

  return (
    <div className="info-box warn explore-radiation">
      <h3 className="explore-box-title">
        <span aria-hidden="true">☢ </span>O que é radioatividade?
      </h3>
      <p>
        O núcleo de alguns átomos é instável. Com o tempo, ele se transforma espontaneamente em outro núcleo e libera energia
        na forma de radiação. Os três tipos mais conhecidos são:
      </p>
      <ul className="explore-radiation-list">
        <li>
          <strong>Alfa (α):</strong> o núcleo lança 2 prótons e 2 nêutrons juntos (um núcleo de hélio). É pouco penetrante:
          uma folha de papel já a bloqueia.
        </li>
        <li>
          <strong>Beta (β):</strong> um nêutron se transforma em próton (ou o contrário) e o núcleo emite um elétron (ou um
          pósitron). Atravessa o papel, mas é barrada por uma placa fina de metal, como o alumínio.
        </li>
        <li>
          <strong>Gama (γ):</strong> onda eletromagnética de altíssima energia, sem massa e sem carga, que costuma acompanhar
          os decaimentos alfa e beta. É muito penetrante e só é atenuada por camadas espessas de materiais densos, como chumbo
          ou concreto.
        </li>
      </ul>
      <p>
        <strong>Meia-vida</strong> é o tempo necessário para que metade dos núcleos de uma amostra se transforme. Não dá para
        prever quando um núcleo isolado vai decair, mas, em uma grande quantidade de átomos, esse tempo é constante e
        característico de cada isótopo.
        {HALF_LIFE_EXAMPLES.length ? ` Exemplos (NUBASE2020): ${joinPt(HALF_LIFE_EXAMPLES)}.` : null}
      </p>
      <p>
        Nesta tabela, <strong>{plural(RADIOACTIVE.length, 'elemento é radioativo', 'elementos são radioativos')}</strong>{' '}
        por não terem nenhum isótopo estável.
        {before.length && fromEl
          ? ` Abaixo de Z = ${fromEl.z}, só ${joinPt(before.map((el) => `${el.name.toLowerCase()} (Z = ${el.z})`))} ${before.length === 1 ? 'está' : 'estão'} nessa situação; de Z = ${fromEl.z} (${fromEl.name.toLowerCase()}) em diante, todos estão.`
          : null}
        {VERY_WEAK.length
          ? ` ${joinPt(VERY_WEAK.map((el) => el.name))} ${VERY_WEAK.length === 1 ? 'tem' : 'têm'} radioatividade tão fraca que, na prática, ${VERY_WEAK.length === 1 ? 'é considerado estável' : 'são considerados estáveis'}.`
          : null}
      </p>
      <p className="explore-radiation-uses">
        A radioatividade também é muito útil: permite datar fósseis e rochas, diagnosticar e tratar doenças e gerar energia
        elétrica em usinas nucleares.
      </p>
    </div>
  );
}

/** Explica a notação entre colchetes e aponta inversões de ordem no ranking atual. */
function RankingNote({ list, kind }: { list: ChemicalElement[]; kind: RankingKind }) {
  const bracketed = list.filter((el) => el.massIsMassNumber).length;
  let mix: string;
  if (bracketed === 0) mix = 'Todos os valores deste ranking são massas atômicas padrão (médias ponderadas dos isótopos naturais).';
  else if (bracketed === list.length) mix = 'Todos os valores deste ranking são números de massa entre colchetes, e não massas atômicas médias.';
  else mix = 'Este ranking mistura os dois tipos de valor: massas atômicas padrão e números de massa entre colchetes.';

  // Primeira inversão: elemento de Z maior aparecendo antes de um de Z menor (ou o contrário nos mais pesados).
  let inversion: [ChemicalElement, ChemicalElement] | null = null;
  for (let i = 0; i + 1 < list.length && !inversion; i++) {
    const [a, b] = [list[i], list[i + 1]];
    if (kind === 'lightest' ? b.z < a.z : b.z > a.z) inversion = [a, b];
  }

  const example = MASS_NUMBER_ELEMENTS[0];
  return (
    <div className="info-box small explore-hint">
      <p>
        Massas em u (unidade de massa atômica), segundo a CIAAW. Elementos sem massa atômica padrão
        {example
          ? ` (${MASS_NUMBER_ELEMENTS.length} elementos — por exemplo, ${example.name.toLowerCase()} ${formatMass(example.atomicMassDisplay)}${ALL_SYNTHETIC_USE_MASS_NUMBER ? ' e todos os que só existem por síntese' : ''})`
          : ''}{' '}
        aparecem com o número de massa do seu isótopo de vida mais longa, entre colchetes (CIAAW/NUBASE2020).
      </p>
      <p>{mix}</p>
      {inversion ? (
        <p>
          Repare: {inversion[0].name} (Z = {inversion[0].z}) aparece antes de {inversion[1].name.toLowerCase()} (Z ={' '}
          {inversion[1].z}). A massa nem sempre acompanha o número atômico.
        </p>
      ) : null}
    </div>
  );
}

function GroupInfo({ group }: { group: number }) {
  const members = ELEMENTS.filter((el) => el.group === group);
  return (
    <div className="info-box small explore-focus-note">
      <p>
        <strong>
          Grupo {group} — {groupName(group)}
        </strong>
        : {plural(members.length, 'elemento', 'elementos')} ({members.map((el) => el.symbol).join(', ')}).
      </p>
      <p>
        Elementos do mesmo grupo têm configurações eletrônicas de valência parecidas e, por isso, costumam ter comportamento
        químico semelhante.
      </p>
      {GROUP_NOTES[group] ? <p>{GROUP_NOTES[group]}</p> : null}
    </div>
  );
}

function PeriodInfo({ period }: { period: number }) {
  const members = ELEMENTS.filter((el) => el.period === period);
  if (!members.length) return null;
  const first = members[0];
  const last = members[members.length - 1];
  const lanthanides = members.filter((el) => el.category === 'lanthanide').length;
  const actinides = members.filter((el) => el.category === 'actinide').length;
  const letters = SHELL_LETTERS.slice(0, period);
  // Exceções reais nos dados (ex.: o paládio não tem elétrons na 5ª camada).
  const exceptions = members.filter((el) => el.shells.length > 0 && el.shells.length !== period);

  return (
    <div className="info-box small explore-focus-note">
      <p>
        <strong>Período {period}</strong>: {plural(members.length, 'elemento', 'elementos')}, de {first.name.toLowerCase()} (
        {first.symbol}) a {last.name.toLowerCase()} ({last.symbol}).
        {lanthanides ? ` Inclui os ${lanthanides} lantanídeos, mostrados na linha separada abaixo da tabela.` : null}
        {actinides ? ` Inclui os ${actinides} actinídeos, mostrados na linha separada abaixo da tabela.` : null}
      </p>
      <p>
        Os átomos deste período distribuem seus elétrons em {plural(period, 'camada eletrônica', 'camadas eletrônicas')} (
        {letters.length > 1 ? `${letters[0]} a ${letters[letters.length - 1]}` : letters[0]})
        {exceptions.length
          ? `, com ${exceptions.length === 1 ? 'uma exceção' : 'exceções'}: ${joinPt(exceptions.map((el) => `${el.name.toLowerCase()} (${plural(el.shells.length, 'camada', 'camadas')})`))}.`
          : '.'}
      </p>
    </div>
  );
}
