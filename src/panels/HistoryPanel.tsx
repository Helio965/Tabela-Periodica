import { useId } from 'react';
import type { PanelProps } from '../components/SidePanel';
import { Icon } from '../components/Icon';
import { ElementRow } from '../components/ElementRow';
import { ExternalLink } from '../components/ExternalLink';
import { getElement } from '../data/elements';
import {
  HISTORY_EVENTS,
  HISTORY_SOURCES,
  MASS_INVERSIONS,
  MENDELEEV,
  MOSELEY_GAPS,
  PREDICTION_LABELS,
  type MendeleevPrediction,
  type PredictionKey,
} from '../data/history';
import { formatMass, formatYear } from '../lib/format';
import { ElementChips, FocusButton } from './LearnPanel';
import './learn.css';

const PREDICTION_ORDER = Object.keys(PREDICTION_LABELS) as PredictionKey[];

/** Cartão "previsto × observado" de uma lacuna da tabela de Mendeleev. */
function PredictionCard({ prediction: p, openElement }: { prediction: MendeleevPrediction } & Pick<PanelProps, 'openElement'>) {
  const el = getElement(p.element);
  const captionId = useId();
  const keys = PREDICTION_ORDER.filter((k) => p.predicted[k] !== undefined || p.observed[k] !== undefined);
  return (
    <article className="hist-pred" aria-labelledby={captionId}>
      <header className="hist-pred-head">
        <div>
          <h4 id={captionId} className="hist-pred-name">
            {p.name} <span aria-hidden="true">→</span>
            <span className="sr-only"> tornou-se o </span> {el.name} ({el.symbol})
          </h4>
          <p className="muted small">
            Descoberto em {p.discovery.year} por {p.discovery.by}, {p.discovery.how}.
          </p>
        </div>
        <button type="button" className="btn btn-sm" onClick={() => openElement(el.z)}>
          <Icon name="atom" size={16} />
          Ficha do {el.name.toLowerCase()}
        </button>
      </header>
      <div className="table-scroll">
        <table className="data-table hist-pred-table">
          <caption className="sr-only">
            Previsão de Mendeleev para o {p.name} comparada com o {el.name.toLowerCase()} observado
          </caption>
          <thead>
            <tr>
              <th scope="col">Propriedade</th>
              <th scope="col">Previsto (1871)</th>
              <th scope="col">Observado</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k}>
                <th scope="row">{PREDICTION_LABELS[k]}</th>
                <td>{p.predicted[k] ?? <span className="muted">—</span>}</td>
                <td>
                  {p.observed[k] ?? <span className="muted">—</span>}
                  {p.historical?.includes(k) ? (
                    <span className="hist-star" title="Medida da época da descoberta">
                      *
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {p.note ? <p className="small hist-pred-note">{p.note}</p> : null}
    </article>
  );
}

export default function HistoryPanel({ openElement, pointElement }: PanelProps) {
  return (
    <div className="history">
      <p className="panel-lead">
        Como os químicos passaram de listas de &quot;substâncias simples&quot; à tabela periódica moderna, com as previsões de Mendeleev
        e as descobertas que deram à tabela o formato atual.
      </p>

      <section className="panel-section" aria-labelledby="hist-mendeleev">
        <h3 className="section-title" id="hist-mendeleev">
          Mendeleev e a tabela de 1869
        </h3>
        {MENDELEEV.intro.map((paragraph) => (
          <p key={paragraph} className="hist-p">
            {paragraph}
          </p>
        ))}
        <ElementChips zs={[52, 53]} label="A inversão telúrio–iodo" openElement={openElement} pointElement={pointElement} />

        <h4 className="hist-subtitle">As lacunas e as previsões</h4>
        <p className="hist-p">{MENDELEEV.predictionsIntro}</p>
        <div className="hist-preds">
          {MENDELEEV.predictions.map((p) => (
            <PredictionCard key={p.name} prediction={p} openElement={openElement} />
          ))}
        </div>
        <div className="info-box warn hist-caveat">
          <p>{MENDELEEV.caveat}</p>
        </div>
        <p className="muted small hist-source-note">{MENDELEEV.source}</p>
      </section>

      <section className="panel-section" aria-labelledby="hist-timeline">
        <h3 className="section-title" id="hist-timeline">
          Linha do tempo
        </h3>
        <ol className="hist-timeline">
          {HISTORY_EVENTS.map((ev) => (
            <li key={`${ev.year}-${ev.title}`} className="hist-event">
              <span className="hist-year" aria-hidden="true">
                {ev.yearLabel ?? ev.year}
              </span>
              <div className="hist-body">
                <h4 className="hist-title">
                  <span className="sr-only">{ev.yearLabel ?? ev.year}: </span>
                  {ev.title}
                </h4>
                <p className="hist-p">{ev.text}</p>
                {ev.people?.length ? (
                  <p className="small muted hist-people">
                    <span className="hist-people-label">Pessoas:</span> {ev.people.join(' · ')}
                  </p>
                ) : null}
                {ev.related?.length ? (
                  <ElementChips zs={ev.related} label="Ver elementos" openElement={openElement} pointElement={pointElement} />
                ) : null}
                {ev.focus || ev.sourceUrl ? (
                  <div className="learn-actions hist-actions">
                    {ev.focus ? <FocusButton focus={ev.focus} /> : null}
                    {ev.sourceUrl ? <ExternalLink href={ev.sourceUrl}>Fonte</ExternalLink> : null}
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel-section" aria-labelledby="hist-moseley">
        <h3 className="section-title" id="hist-moseley">
          Contribuições posteriores: o número atômico
        </h3>
        <p className="hist-p">
          Mendeleev ordenou os elementos pela massa atômica, mas em alguns pares a química exigia a ordem inversa. Em 1913, Henry Moseley
          mostrou que a ordem verdadeira é a do <strong>número atômico</strong> (a carga do núcleo). Com os pesos atômicos atuais, estes são
          os pares vizinhos em que o elemento de maior número atômico é mais leve:
        </p>
        <ul className="element-list hist-inversions">
          {MASS_INVERSIONS.map(([a, b]) => {
            const ea = getElement(a);
            const eb = getElement(b);
            return (
              <li key={a} className="hist-inversion">
                <ElementRow element={ea} value={formatMass(ea.atomicMassDisplay)} onClick={openElement} onHover={pointElement} />
                <span className="hist-inversion-sign" aria-hidden="true">
                  &gt;
                </span>
                <ElementRow element={eb} value={formatMass(eb.atomicMassDisplay)} onClick={openElement} onHover={pointElement} />
                <span className="sr-only">
                  {ea.name} (Z = {ea.z}) tem massa maior que {eb.name} (Z = {eb.z}).
                </span>
              </li>
            );
          })}
        </ul>
        <p className="hist-p">
          A lei de Moseley também mostrou exatamente quais números atômicos ainda estavam vagos entre o alumínio e o ouro. As lacunas foram
          preenchidas nas décadas seguintes:
        </p>
        <ul className="element-list">
          {MOSELEY_GAPS.map(({ z, year }) => (
            <li key={z}>
              <ElementRow
                element={getElement(z)}
                value={`descoberto em ${formatYear(year)}`}
                onClick={openElement}
                onHover={pointElement}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="panel-section" aria-labelledby="hist-sources">
        <h3 className="section-title" id="hist-sources">
          Fontes desta seção
        </h3>
        <ul className="src-list">
          {HISTORY_SOURCES.map((s) => (
            <li key={s.id} className="src-item">
              <p className="src-title">{s.url ? <ExternalLink href={s.url}>{s.title}</ExternalLink> : <strong>{s.title}</strong>}</p>
              <p className="small muted">{s.publisher}</p>
              {s.citation ? <p className="small mono src-citation">{s.citation}</p> : null}
              <p className="small src-used">{s.usedFor}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
