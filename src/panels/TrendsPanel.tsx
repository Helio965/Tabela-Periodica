import { useMemo, useRef, type KeyboardEvent } from 'react';
import type { PanelProps } from '../components/SidePanel';
import { ElementRow } from '../components/ElementRow';
import { PropertyChart, valueNote } from '../components/PropertyChart';
import { ELEMENTS } from '../data/elements';
import type { ChemicalElement } from '../data/types';
import { TREND_BY_ID, TRENDS, trendScale, type TrendId } from '../lib/trends';
import { useStore } from '../state/store';
import './trends.css';

/** Mesma fórmula de cor usada nos cartões (.element-card.has-trend em scene.css). */
const trendColor = (t: number) => `hsl(${(255 - t * 200).toFixed(1)} 68% ${(20 + t * 32).toFixed(1)}%)`;
const GRADIENT = `linear-gradient(to right, ${Array.from({ length: 11 }, (_, i) => `${trendColor(i / 10)} ${i * 10}%`).join(', ')})`;

interface Ranked {
  el: ChemicalElement;
  value: number;
}

export default function TrendsPanel({ openElement, pointElement }: PanelProps) {
  const { state, dispatch } = useStore();
  const trend = TREND_BY_ID[state.trend];
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const { scale, ranked, missing } = useMemo(() => {
    const scale = trendScale(trend.id);
    // Mesmo critério da escala de cores: só valores positivos contam.
    const ranked: Ranked[] = ELEMENTS.map((el) => ({ el, value: trend.value(el) }))
      .filter((r): r is Ranked => r.value !== null && r.value > 0)
      .sort((a, b) => b.value - a.value || a.el.z - b.el.z);
    const missing = [...scale.intensity.values()].filter((v) => v === null).length;
    return { scale, ranked, missing };
  }, [trend]);

  const highest = ranked.slice(0, 3);
  const lowest = ranked.slice(-3).reverse();

  const select = (id: TrendId) => dispatch({ type: 'setTrend', trend: id });

  // Grupo de opções com semântica de rádio: setas mudam a seleção (padrão ARIA).
  function onOptionKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (event.key in keys) next = (index + keys[event.key] + TRENDS.length) % TRENDS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = TRENDS.length - 1;
    if (next === null) return;
    event.preventDefault();
    select(TRENDS[next].id);
    optionRefs.current[next]?.focus();
  }

  const row = (r: Ranked, i: number) => (
    <li key={r.el.z}>
      <ElementRow
        element={r.el}
        lead={i + 1}
        value={trend.format(r.value)}
        detail={valueNote(trend, r.el)}
        onClick={openElement}
        onHover={pointElement}
      />
    </li>
  );

  return (
    <div className="trends-panel">
      <p className="panel-lead">
        Escolha uma propriedade: a tabela é colorida conforme o valor de cada elemento, revelando os padrões que se repetem
        ao longo dos períodos e grupos.
      </p>

      <section className="panel-section" aria-labelledby="trend-options-title">
        <h3 className="section-title" id="trend-options-title">
          Propriedade
        </h3>
        <div className="trend-options" role="radiogroup" aria-labelledby="trend-options-title">
          {TRENDS.map((t, i) => {
            const checked = t.id === trend.id;
            return (
              <button
                key={t.id}
                ref={(node) => {
                  optionRefs.current[i] = node;
                }}
                type="button"
                role="radio"
                aria-checked={checked}
                aria-label={`${t.label} (${t.unit})`}
                tabIndex={checked ? 0 : -1}
                className="trend-option"
                onClick={() => select(t.id)}
                onKeyDown={(e) => onOptionKey(e, i)}
              >
                <span>{t.label}</span>
                <span className="trend-option-unit">{t.unit}</span>
              </button>
            );
          })}
        </div>
        <p className="info-box trend-explanation">{trend.explanation}</p>
      </section>

      <section className="panel-section" aria-labelledby="trend-scale-title">
        <h3 className="section-title" id="trend-scale-title">
          Escala de cores
        </h3>
        <div
          className="trend-gradient"
          style={{ background: GRADIENT }}
          role="img"
          aria-label={`Escala de cores: do azul-violeta escuro (menor valor, ${trend.format(scale.min)}) ao amarelo claro (maior valor, ${trend.format(scale.max)})`}
        />
        <div className="trend-scale-labels">
          <span>
            <span className="muted small">menor</span>
            <strong className="mono">{trend.format(scale.min)}</strong>
          </span>
          <span className="is-end">
            <span className="muted small">maior</span>
            <strong className="mono">{trend.format(scale.max)}</strong>
          </span>
        </div>
        {trend.log ? (
          <p className="small muted trend-note">
            Escala logarítmica: cada passo igual na cor multiplica o valor, em vez de somar. Assim, gases muito leves e
            metais muito densos cabem na mesma escala.
          </p>
        ) : null}
        <div className="trend-nodata">
          <span className="trend-nodata-swatch" aria-hidden="true" />
          <span>
            Sem dado{' '}
            <span className="muted small">
              ({missing} {missing === 1 ? 'elemento' : 'elementos'})
            </span>
          </span>
        </div>
      </section>

      <section className="panel-section" aria-labelledby="trend-high-title">
        <h3 className="section-title" id="trend-high-title">
          Maiores valores
        </h3>
        <ol className="element-list">{highest.map(row)}</ol>
      </section>

      <section className="panel-section" aria-labelledby="trend-low-title">
        <h3 className="section-title" id="trend-low-title">
          Menores valores
        </h3>
        <ol className="element-list">{lowest.map(row)}</ol>
      </section>

      <section className="panel-section" aria-labelledby="trend-chart-title">
        <h3 className="section-title" id="trend-chart-title">
          {trend.label} × número atômico
        </h3>
        <PropertyChart trend={trend} onPoint={pointElement} onOpen={openElement} />
      </section>
    </div>
  );
}
