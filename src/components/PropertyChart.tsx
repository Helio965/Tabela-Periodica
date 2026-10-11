import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { ELEMENTS, ONLY_PREDICTED_BULK } from '../data/elements';
import { CATEGORIES, CATEGORY_BY_ID } from '../data/categories';
import type { ChemicalElement } from '../data/types';
import { formatMass, formatNumber, superscript } from '../lib/format';
import type { TrendDef, TrendId } from '../lib/trends';
import '../panels/trends.css';

/**
 * Propriedades que, para elementos nunca obtidos em quantidade visível, são só
 * estimativas: as macroscópicas (densidade, fusão, ebulição) e a
 * eletronegatividade de Pauling, que depende de dados termoquímicos de
 * compostos que não existem para esses elementos.
 */
const ESTIMATED_FOR_PREDICTED = new Set<TrendId>(['density', 'melting', 'boiling', 'electronegativity']);

/** O valor exibido é uma estimativa teórica (não foi medido)? */
export function isEstimated(trend: TrendDef, el: ChemicalElement): boolean {
  return ESTIMATED_FOR_PREDICTED.has(trend.id) && ONLY_PREDICTED_BULK.has(el.z);
}

/** Ressalvas de pressão: valores que não correspondem ao comportamento a 1 atm. */
const PRESSURE_NOTES: Partial<Record<TrendId, Record<number, string>>> = {
  melting: {
    2: 'medido sob pressão; a 1 atm não solidifica',
    6: 'não vale a 1 atm: o grafite sublima',
    33: 'medido sob pressão; a 1 atm sublima',
  },
  boiling: {
    6: 'temperatura de sublimação a 1 atm',
    33: 'temperatura de sublimação a 1 atm',
  },
};

/** Valor formatado; a massa segue a notação da tabela ("1,0080", "[294]"). */
export function formatTrendValue(trend: TrendDef, el: ChemicalElement, value: number): string {
  return trend.id === 'mass' ? `${formatMass(el.atomicMassDisplay)} u` : trend.format(value);
}

/** Observação curta que acompanha o valor (estimativa, número de massa ou ressalva de pressão). */
export function valueNote(trend: TrendDef, el: ChemicalElement): string | undefined {
  if (isEstimated(trend, el)) return 'valor estimado (nunca medido)';
  if (trend.id === 'mass' && el.massIsMassNumber) return 'número de massa do isótopo de vida mais longa';
  return PRESSURE_NOTES[trend.id]?.[el.z];
}

/** Primeiro elemento de cada período (o período 1 começa no hidrogênio). */
const PERIOD_STARTS = [1, 3, 11, 19, 37, 55, 87];
const Z_MAX = 118;
const X_TICKS = [1, 20, 40, 60, 80, 100, 118];

interface Point {
  el: ChemicalElement;
  value: number;
  x: number;
  y: number;
  estimated: boolean;
  note?: string;
}

interface Tick {
  value: number;
  label: string;
}

// ---------------------------------------------------------------------------
// Escalas
// ---------------------------------------------------------------------------

/** Passo "redondo" (1, 2, 2,5, 5 × 10ⁿ) para cerca de `target` intervalos. */
function niceStep(range: number, target: number): number {
  const raw = range / target;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return Number((nice * mag).toPrecision(2));
}

function linearTicks(max: number, target: number): { ticks: Tick[]; top: number } {
  const step = niceStep(max, target);
  const decimals = (String(step).split('.')[1] ?? '').length;
  const top = Math.ceil(max / step - 1e-9) * step;
  const ticks: Tick[] = [];
  for (let i = 0; i * step <= top + step / 2; i++) {
    const value = Number((i * step).toFixed(decimals));
    ticks.push({ value, label: formatNumber(value, decimals) });
  }
  return { ticks, top };
}

/** Rótulo de uma potência de 10: números comuns perto de 1, notação 10ⁿ nos extremos. */
function decadeLabel(exp: number): string {
  if (exp >= -3 && exp <= 4) return formatNumber(10 ** exp, Math.max(0, -exp));
  return `10${superscript(exp)}`;
}

function logTicks(lo: number, hi: number): Tick[] {
  const every = hi - lo > 7 ? 2 : 1;
  const ticks: Tick[] = [];
  for (let e = lo; e <= hi; e += every) ticks.push({ value: 10 ** e, label: decadeLabel(e) });
  return ticks;
}

// ---------------------------------------------------------------------------
// Tamanho responsivo: o SVG é desenhado na largura real do contêiner para que
// o texto não encolha em telas pequenas.
// ---------------------------------------------------------------------------
function useWidth(fallback = 340) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(fallback);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => {
      const w = Math.round(node.getBoundingClientRect().width);
      if (w > 0) setWidth(w);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

export interface PropertyChartProps {
  trend: TrendDef;
  /** Hover em um ponto (destaque temporário na tabela). */
  onPoint?: (z: number | null) => void;
  /** Clique em um ponto (abre a ficha do elemento). */
  onOpen?: (z: number) => void;
  height?: number;
}

/**
 * Gráfico de dispersão/linha da propriedade em função do número atômico.
 * Pontos coloridos pela categoria; lacunas onde não há dado; linhas verticais
 * marcam o início de cada período. Feito em SVG puro, sem bibliotecas.
 */
export function PropertyChart({ trend, onPoint, onOpen, height = 248 }: PropertyChartProps) {
  const [wrapRef, width] = useWidth();
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const hoverRef = useRef<number | null>(null);
  const onPointRef = useRef(onPoint);
  useEffect(() => {
    hoverRef.current = hover;
    onPointRef.current = onPoint;
  });
  // Ao desmontar (troca de painel), não deixa um elemento "preso" em destaque na cena.
  useEffect(
    () => () => {
      if (hoverRef.current !== null) onPointRef.current?.(null);
    },
    [],
  );
  const lastPointer = useRef<{ type: string; wasShown: boolean }>({ type: 'mouse', wasShown: false });

  const chart = useMemo(() => {
    const data = ELEMENTS.map((el) => ({ el, value: trend.value(el) })).filter(
      (d): d is { el: ChemicalElement; value: number } =>
        d.value !== null && Number.isFinite(d.value) && (!trend.log || d.value > 0),
    );
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Eixo y: logarítmico em décadas inteiras ou linear a partir de zero.
    let ticks: Tick[];
    let toUnit: (v: number) => number;
    if (trend.log) {
      const lo = Math.floor(Math.log10(min));
      const hi = Math.ceil(Math.log10(max));
      ticks = logTicks(lo, hi);
      toUnit = (v) => (Math.log10(v) - lo) / (hi - lo || 1);
    } else {
      const lin = linearTicks(max, 4);
      ticks = lin.ticks;
      toUnit = (v) => v / (lin.top || 1);
    }

    const longest = Math.max(...ticks.map((t) => t.label.length));
    // A margem esquerda também precisa caber o rótulo "Período" (≈ 44 px).
    const margin = { top: 40, right: 12, bottom: 40, left: Math.max(52, Math.round(longest * 6.8 + 12)) };
    const plotW = Math.max(120, width - margin.left - margin.right);
    const plotH = Math.max(100, height - margin.top - margin.bottom);
    // Cada Z ocupa uma "faixa"; o ponto fica no centro dela.
    const x = (z: number) => margin.left + ((z - 0.5) / Z_MAX) * plotW;
    const y = (v: number) => margin.top + (1 - toUnit(v)) * plotH;

    const points: Point[] = data.map(({ el, value }) => ({
      el,
      value,
      x: x(el.z),
      y: y(value),
      estimated: isEstimated(trend, el),
      note: valueNote(trend, el),
    }));
    const byZ = new Map(points.map((p) => [p.el.z, p]));

    // Linha neutra entre números atômicos consecutivos; interrompida onde falta dado.
    let path = '';
    for (let z = 1; z <= Z_MAX; z++) {
      const p = byZ.get(z);
      if (!p) continue;
      path += `${byZ.has(z - 1) ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }

    const periods = PERIOD_STARTS.map((start, i) => {
      const end = (PERIOD_STARTS[i + 1] ?? Z_MAX + 1) - 1;
      return { n: i + 1, start, xStart: x(start - 0.5), xMid: (x(start) + x(end)) / 2 };
    });

    const sorted = [...points].sort((a, b) => b.value - a.value || a.el.z - b.el.z);
    return {
      points,
      byZ,
      path,
      periods,
      margin,
      plotW,
      plotH,
      yTicks: ticks.map((t) => ({ ...t, y: y(t.value) })),
      xTicks: X_TICKS.map((z) => ({ z, x: x(z) })),
      highest: sorted[0],
      lowest: sorted[sorted.length - 1],
      missing: ELEMENTS.length - points.length,
      hasEstimated: points.some((p) => p.estimated),
      radius: Math.min(4, Math.max(2.5, (plotW / Z_MAX) * 0.85)),
    };
  }, [trend, width, height]);

  const { margin, plotW, plotH, byZ } = chart;
  const hovered = hover !== null ? byZ.get(hover) ?? null : null;

  function updateHover(z: number | null) {
    if (z === hover) return;
    setHover(z);
    onPoint?.(z);
  }

  // Troca de propriedade: se o elemento destacado não tem dado na nova, solta o destaque.
  useEffect(() => {
    if (hover !== null && !byZ.has(hover)) {
      setHover(null);
      onPointRef.current?.(null);
    }
  }, [byZ, hover]);

  // No toque não existe "pointerleave": um toque fora do gráfico fecha o balão.
  useEffect(() => {
    if (hover === null) return;
    const onDocumentDown = (event: PointerEvent) => {
      if (event.target instanceof Node && svgRef.current?.contains(event.target)) return;
      setHover(null);
      onPointRef.current?.(null);
    };
    document.addEventListener('pointerdown', onDocumentDown);
    return () => document.removeEventListener('pointerdown', onDocumentDown);
  }, [hover]);

  // Posição do balão: centrado acima do ponto, mas sempre dentro da área do gráfico
  // (medido depois de renderizar, pois a largura depende do texto).
  useLayoutEffect(() => {
    const tip = tooltipRef.current;
    if (!tip || !hovered) return;
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    const left = Math.min(Math.max(0, hovered.x - w / 2), Math.max(0, width - w));
    const above = hovered.y - h - 12;
    const top = above >= 0 ? above : hovered.y + 14;
    tip.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
  }, [hovered, width]);

  /** Elemento com dado mais próximo (na horizontal) do ponteiro. */
  function nearest(clientX: number, svg: SVGSVGElement): number | null {
    const rect = svg.getBoundingClientRect();
    const px = clientX - rect.left;
    if (px < margin.left - 6 || px > margin.left + plotW + 6) return null;
    const zFloat = ((px - margin.left) / plotW) * Z_MAX + 0.5;
    const z0 = Math.min(Z_MAX, Math.max(1, Math.round(zFloat)));
    for (let d = 0; d <= 3; d++) {
      const candidates = [z0 - d, z0 + d].filter((z) => byZ.has(z));
      if (candidates.length) {
        return candidates.sort((a, b) => Math.abs(a - zFloat) - Math.abs(b - zFloat))[0];
      }
    }
    return null;
  }

  function handleMove(event: ReactPointerEvent<SVGSVGElement>) {
    updateHover(nearest(event.clientX, event.currentTarget));
  }

  function handleDown(event: ReactPointerEvent<SVGSVGElement>) {
    const z = nearest(event.clientX, event.currentTarget);
    lastPointer.current = { type: event.pointerType, wasShown: z !== null && z === hover };
    updateHover(z);
  }

  function handleClick(event: ReactMouseEvent<SVGSVGElement>) {
    const z = nearest(event.clientX, event.currentTarget);
    if (z === null) return;
    // No toque, o primeiro toque mostra o valor; o segundo (no mesmo ponto) abre a ficha.
    if (lastPointer.current.type === 'touch' && !lastPointer.current.wasShown) return;
    onOpen?.(z);
  }

  function handleLeave(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.pointerType === 'touch') return;
    updateHover(null);
  }

  // Pontos e tabela só mudam com a propriedade/tamanho, não a cada movimento do mouse.
  const marks = useMemo(
    () =>
      chart.points.map((p) => (
        <circle
          key={p.el.z}
          className={p.estimated ? 'pc-point is-estimated' : 'pc-point'}
          cx={p.x}
          cy={p.y}
          r={chart.radius}
          style={{ '--pc-color': CATEGORY_BY_ID[p.el.category].color } as CSSProperties}
        />
      )),
    [chart],
  );

  const tableRows = useMemo(
    () =>
      ELEMENTS.map((el) => {
        const p = chart.byZ.get(el.z);
        return (
          <tr key={el.z}>
            <td className="mono">{el.z}</td>
            <td>
              <button type="button" className="pc-link" onClick={() => onOpen?.(el.z)}>
                {el.name} ({el.symbol})
              </button>
            </td>
            <td className={p ? 'mono' : 'muted'}>
              {p ? formatTrendValue(trend, el, p.value) : 'não disponível'}
              {p?.note ? <span className="pc-table-note muted small">{p.note}</span> : null}
            </td>
          </tr>
        );
      }),
    [chart, trend, onOpen],
  );

  const unitTitle = `${trend.label} (${trend.unit}${trend.log ? ', escala logarítmica' : ''})`;
  const description =
    chart.highest && chart.lowest
      ? `Valores de ${trend.label.toLowerCase()} para os números atômicos de 1 a ${Z_MAX}. ` +
        `Maior valor: ${chart.highest.el.name}, ${formatTrendValue(trend, chart.highest.el, chart.highest.value)}. ` +
        `Menor valor: ${chart.lowest.el.name}, ${formatTrendValue(trend, chart.lowest.el, chart.lowest.value)}. ` +
        (chart.missing > 0 ? `${chart.missing} elementos sem dado aparecem como lacunas.` : '')
      : 'Sem dados para esta propriedade.';

  return (
    <figure className="property-chart">
      <div className="pc-plot" ref={wrapRef}>
        <svg
          ref={svgRef}
          className="pc-svg"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
          onPointerMove={handleMove}
          onPointerDown={handleDown}
          onPointerLeave={handleLeave}
          onClick={handleClick}
          style={{ cursor: hovered ? 'pointer' : 'default' }}
        >
          <title id={titleId}>{`${trend.label} em função do número atômico`}</title>
          <desc id={descId}>{description}</desc>

          {/* Título do eixo y (horizontal, mais fácil de ler) */}
          <text className="pc-axis-title" x={0} y={12}>
            {unitTitle}
          </text>

          {/* Grade horizontal e rótulos do eixo y */}
          <g aria-hidden="true">
            {chart.yTicks.map((t) => (
              <g key={t.value}>
                <line className="pc-grid" x1={margin.left} x2={margin.left + plotW} y1={t.y} y2={t.y} />
                <text className="pc-tick" x={margin.left - 6} y={t.y} textAnchor="end" dominantBaseline="middle">
                  {t.label}
                </text>
              </g>
            ))}
          </g>

          {/* Separadores e números dos períodos */}
          <g aria-hidden="true">
            <text className="pc-period-title" x={margin.left - 6} y={30} textAnchor="end">
              Período
            </text>
            {chart.periods.map((p) => (
              <g key={p.n}>
                {p.start > 1 ? (
                  <line className="pc-period-line" x1={p.xStart} x2={p.xStart} y1={margin.top - 6} y2={margin.top + plotH} />
                ) : null}
                <text className="pc-period-label" x={p.xMid} y={30} textAnchor="middle">
                  {p.n}
                </text>
              </g>
            ))}
          </g>

          {/* Eixo x */}
          <g aria-hidden="true">
            <line className="pc-axis" x1={margin.left} x2={margin.left + plotW} y1={margin.top + plotH} y2={margin.top + plotH} />
            {chart.xTicks.map((t) => (
              <g key={t.z}>
                <line className="pc-axis" x1={t.x} x2={t.x} y1={margin.top + plotH} y2={margin.top + plotH + 4} />
                <text className="pc-tick" x={t.x} y={margin.top + plotH + 16} textAnchor="middle">
                  {t.z}
                </text>
              </g>
            ))}
            <text className="pc-axis-title" x={margin.left + plotW / 2} y={height - 4} textAnchor="middle">
              Número atômico (Z)
            </text>
          </g>

          {/* Mira vertical do ponto sob o ponteiro */}
          {hovered ? (
            <line className="pc-crosshair" x1={hovered.x} x2={hovered.x} y1={margin.top} y2={margin.top + plotH} aria-hidden="true" />
          ) : null}

          {/* Dados */}
          <g aria-hidden="true">
            <path className="pc-line" d={chart.path} />
            {marks}
            {hovered ? (
              <circle
                className="pc-point-hover"
                cx={hovered.x}
                cy={hovered.y}
                r={chart.radius + 2.5}
                style={{ '--pc-color': CATEGORY_BY_ID[hovered.el.category].color } as CSSProperties}
              />
            ) : null}
          </g>
        </svg>

        {hovered ? (
          <div className="pc-tooltip" ref={tooltipRef} aria-hidden="true">
            <strong className="pc-tt-value">{formatTrendValue(trend, hovered.el, hovered.value)}</strong>
            <span className="pc-tt-name">
              <span className="pc-tt-key" style={{ '--pc-color': CATEGORY_BY_ID[hovered.el.category].color } as CSSProperties} />
              {hovered.el.name} ({hovered.el.symbol}) · Z = {hovered.el.z}
            </span>
            <span className="pc-tt-cat">{CATEGORY_BY_ID[hovered.el.category].label}</span>
            {hovered.note ? <span className="pc-tt-note">{hovered.note}</span> : null}
          </div>
        ) : null}
      </div>

      <figcaption className="pc-caption">
        <ul className="pc-legend" aria-label="Cores das categorias">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <span className="pc-legend-dot" style={{ '--pc-color': c.color } as CSSProperties} aria-hidden="true" />
              {c.label}
            </li>
          ))}
          {chart.hasEstimated ? (
            <li>
              <span className="pc-legend-dot is-estimated" aria-hidden="true" />
              Valor estimado (nunca medido)
            </li>
          ) : null}
        </ul>
        <p className="muted small">
          {chart.missing > 0
            ? `${chart.missing} ${chart.missing === 1 ? 'elemento sem dado não aparece' : 'elementos sem dado não aparecem'} (lacunas na linha). `
            : ''}
          Passe o mouse ou toque em um ponto para ver o valor; clique (ou toque de novo) para abrir a ficha. A tabela abaixo
          traz todos os valores.
        </p>
      </figcaption>

      <details className="pc-table">
        <summary>Ver todos os valores em tabela</summary>
        <div className="table-scroll pc-table-scroll">
          <table className="data-table">
            <caption className="sr-only">{`${unitTitle} de cada elemento`}</caption>
            <thead>
              <tr>
                <th scope="col">Z</th>
                <th scope="col">Elemento</th>
                <th scope="col">Valor</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
