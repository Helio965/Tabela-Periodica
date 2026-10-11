import { useEffect, useId, useMemo, useState } from 'react';
import type { PanelProps } from '../components/SidePanel';
import { ElementRow } from '../components/ElementRow';
import { ELEMENTS, getElement, ONLY_PREDICTED_BULK, STATE_REFERENCE } from '../data/elements';
import type { ChemicalElement, StateOfMatter } from '../data/types';
import { formatNumber, formatTemperature, kelvinToCelsius } from '../lib/format';
import { STATE_LABELS, stateAt, sublimesAtOneAtm } from '../lib/temperature';
import { useStore } from '../state/store';
import './trends.css';

const MAX_K = 6000;
const LIST_LIMIT = 12;

const PRESETS: Array<{ label: string; kelvin: number }> = [
  { label: 'Zero absoluto (0 K)', kelvin: 0 },
  { label: 'Nitrogênio líquido (77 K)', kelvin: 77 },
  { label: '0 °C', kelvin: 273.15 },
  { label: `${STATE_REFERENCE.celsius} °C (padrão)`, kelvin: STATE_REFERENCE.kelvin },
  { label: '100 °C', kelvin: 373.15 },
  { label: `${formatNumber(1000)} °C`, kelvin: 1273.15 },
  { label: `Superfície do Sol (≈ ${formatNumber(5800)} K)`, kelvin: 5800 },
];

/** Mesmos símbolos dos cartões (ElementCard), para não depender só da cor. */
const STATE_ORDER: Array<{ id: StateOfMatter; glyph: string; plural: string }> = [
  { id: 'solid', glyph: '■', plural: 'Sólidos' },
  { id: 'liquid', glyph: '≈', plural: 'Líquidos' },
  { id: 'gas', glyph: '○', plural: 'Gasosos' },
  { id: 'unknown', glyph: '?', plural: 'Desconhecidos' },
];

/** "84 sólidos", "1 líquido" */
const stateCountLabel = (id: StateOfMatter, n: number) =>
  n === 1 ? STATE_LABELS[id] : (STATE_ORDER.find((s) => s.id === id)?.plural ?? STATE_LABELS[id]);

/** "58,8 °C" com espaço não separável, para o número não se separar da unidade ao quebrar a linha. */
const celsius = (k: number) => `${formatNumber(kelvinToCelsius(k), 1)}\u00a0°C`;
const HELIUM = getElement(2);
const CARBON = getElement(6);
const ARSENIC = getElement(33);

/** Nomes dos elementos sem estado conhecido: "astato, frâncio e todos a partir do férmio (Z = 100)". */
function predictedNames(): string {
  const zs = [...ONLY_PREDICTED_BULK].sort((a, b) => a - b);
  let tail = ELEMENTS.length;
  while (ONLY_PREDICTED_BULK.has(tail - 1)) tail--;
  const name = (z: number) => ELEMENTS[z - 1].name.toLowerCase();
  const loose = zs.filter((z) => z < tail).map(name);
  return `${loose.join(', ')} e todos a partir do ${name(tail)} (Z = ${tail})`;
}
const PREDICTED_NAMES = predictedNames();

/** "protactínio, berquélio e califórnio" (nomes de elementos são minúsculos no meio da frase). */
function joinNames(list: ChemicalElement[]): string {
  const names = list.map((e) => e.name.toLowerCase());
  return names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`;
}

export default function StatesPanel({ openElement, pointElement }: PanelProps) {
  const { state, dispatch } = useStore();
  const kelvin = state.temperatureK;
  const sliderId = useId();
  const [expanded, setExpanded] = useState<Record<'liquid' | 'gas', boolean>>({ liquid: false, gas: false });

  const groups = useMemo(() => {
    const g: Record<StateOfMatter, ChemicalElement[]> = { solid: [], liquid: [], gas: [], unknown: [] };
    for (const e of ELEMENTS) g[stateAt(e, kelvin)].push(e);
    return g;
  }, [kelvin]);

  // Resumo para leitores de tela, anunciado só quando o controle para de mexer
  // (começa igual ao resumo atual para não ser lido ao abrir o painel).
  const summary = `A ${formatTemperature(kelvin)}: ${STATE_ORDER.map((s) => {
    const n = groups[s.id].length;
    return `${n} ${stateCountLabel(s.id, n).toLowerCase()}`;
  }).join(', ')}.`;
  const [liveSummary, setLiveSummary] = useState(summary);
  useEffect(() => {
    const id = window.setTimeout(() => setLiveSummary(summary), 700);
    return () => window.clearTimeout(id);
  }, [summary]);

  const setTemperature = (k: number) => dispatch({ type: 'setTemperature', kelvin: Math.min(MAX_K, Math.max(0, k)) });

  const unknownForLackOfData = groups.unknown.filter((e) => e.state !== 'unknown');

  const renderList = (kind: 'liquid' | 'gas') => {
    const list = groups[kind];
    if (list.length === 0) {
      return <p className="muted small">Nenhum elemento {kind === 'liquid' ? 'líquido' : 'gasoso'} nesta temperatura.</p>;
    }
    const shown = expanded[kind] ? list : list.slice(0, LIST_LIMIT);
    return (
      <>
        <ul className="element-list">
          {shown.map((e) => {
            const { meltingPoint: mp, boilingPoint: bp } = e.props;
            let value = '';
            let detail: string | undefined;
            if (kind === 'liquid') {
              value = bp !== null ? `ferve a ${celsius(bp)}` : '';
              // Hélio: líquido até o zero absoluto a 1 atm (o ponto de fusão dos dados vale sob pressão).
              if (stateAt(e, 0) === 'liquid') detail = 'não solidifica a 1 atm';
              else if (mp !== null) detail = `funde a ${celsius(mp)}`;
            } else if (bp !== null) {
              value = `${sublimesAtOneAtm(e) ? 'sublima' : 'ferve'} a ${celsius(bp)}`;
            }
            return (
              <li key={e.z}>
                <ElementRow element={e} value={value} detail={detail} onClick={openElement} onHover={pointElement} />
              </li>
            );
          })}
        </ul>
        {list.length > LIST_LIMIT ? (
          <button
            type="button"
            className="btn btn-ghost btn-sm states-more"
            aria-expanded={expanded[kind]}
            onClick={() => setExpanded((x) => ({ ...x, [kind]: !x[kind] }))}
          >
            {expanded[kind] ? 'Mostrar menos' : `Mostrar todos (${list.length})`}
          </button>
        ) : null}
      </>
    );
  };

  return (
    <div className="states-panel">
      <p className="panel-lead">
        Na tabela, o estado físico padrão de cada elemento é o que ele tem a {STATE_REFERENCE.celsius} °C e{' '}
        {STATE_REFERENCE.pressure}. Mude a temperatura para ver quem derrete, ferve ou continua sólido — sempre à pressão de
        1 atm.
      </p>

      <section className="panel-section" aria-labelledby="states-temp-title">
        <h3 className="section-title" id="states-temp-title">
          Temperatura
        </h3>
        <p className="states-readout">
          <span className="states-readout-c">{formatNumber(kelvinToCelsius(kelvin), 2)} °C</span>
          <span className="states-readout-k mono">{formatNumber(kelvin, 2)} K</span>
        </p>
        <label className="field" htmlFor={sliderId}>
          <span className="sr-only">Temperatura em kelvin (0 a {formatNumber(MAX_K)} K)</span>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={MAX_K}
            step={1}
            value={kelvin}
            aria-valuetext={formatTemperature(kelvin)}
            onChange={(e) => setTemperature(Number(e.target.value))}
          />
        </label>
        <div className="states-scale small muted" aria-hidden="true">
          <span>0 K</span>
          <span>{formatNumber(MAX_K / 2)} K</span>
          <span>{formatNumber(MAX_K)} K</span>
        </div>
        <div className="chips states-presets" role="group" aria-label="Temperaturas de referência">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              className="chip"
              aria-pressed={Math.abs(kelvin - p.kelvin) < 0.01}
              onClick={() => setTemperature(p.kelvin)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      <section className="panel-section" aria-labelledby="states-count-title">
        <h3 className="section-title" id="states-count-title">
          Elementos em cada estado
        </h3>
        <ul className="states-counts">
          {STATE_ORDER.map((s) => (
            <li key={s.id} className="states-count">
              <span className={`state-swatch state-swatch-${s.id}`} aria-hidden="true">
                {s.glyph}
              </span>
              <span className="states-count-text">
                <strong className="states-count-n mono">{groups[s.id].length}</strong>
                <span className="states-count-label">{stateCountLabel(s.id, groups[s.id].length)}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="sr-only" aria-live="polite">
          {liveSummary}
        </p>
      </section>

      <section className="panel-section" aria-labelledby="states-liquid-title">
        <h3 className="section-title" id="states-liquid-title">
          Líquidos nesta temperatura ({groups.liquid.length})
        </h3>
        {renderList('liquid')}
      </section>

      <section className="panel-section" aria-labelledby="states-gas-title">
        <h3 className="section-title" id="states-gas-title">
          Gasosos nesta temperatura ({groups.gas.length})
        </h3>
        {renderList('gas')}
      </section>

      <section className="panel-section" aria-labelledby="states-notes-title">
        <h3 className="section-title" id="states-notes-title">
          Para entender
        </h3>
        <ul className="states-notes small">
          <li>
            <strong>Hélio:</strong> é o único elemento que não solidifica à pressão de 1 atm, nem perto do zero absoluto; por
            isso aparece líquido até 0 K. O ponto de fusão registrado nos dados,{' '}
            {formatTemperature(HELIUM.props.meltingPoint)}, foi medido sob pressão.
          </li>
          <li>
            <strong>Arsênio e carbono:</strong> a 1 atm eles sublimam, passando direto de sólido a gás, e nunca aparecem
            como líquidos aqui. O arsênio sublima a {formatTemperature(ARSENIC.props.boilingPoint)}; seu ponto de fusão,{' '}
            {formatTemperature(ARSENIC.props.meltingPoint)}, só é alcançado sob pressão. O carbono (grafite) sublima a{' '}
            {formatTemperature(CARBON.props.boilingPoint)}; carbono líquido só existe sob pressão elevada, então o ponto de
            fusão listado nos dados, {formatTemperature(CARBON.props.meltingPoint)}, não vale a 1 atm.
          </li>
          <li>
            <strong>Desconhecido:</strong> {PREDICTED_NAMES} nunca foram obtidos em quantidade visível, então seu estado
            físico real não é conhecido (existem apenas previsões teóricas).
            {unknownForLackOfData.length > 0
              ? ` Nesta temperatura, ${joinNames(unknownForLackOfData)} também ${unknownForLackOfData.length === 1 ? 'aparece' : 'aparecem'} como desconhecido${unknownForLackOfData.length === 1 ? '' : 's'} por falta de dados (as fontes usadas não trazem a temperatura de ebulição).`
              : null}
          </li>
          <li>
            <strong>Pressão:</strong> todas as temperaturas de fusão e ebulição usadas aqui valem para 1 atm. Em outras
            pressões elas mudam — no alto de uma montanha, por exemplo, a água ferve abaixo de 100 °C.
          </li>
        </ul>
      </section>
    </div>
  );
}
