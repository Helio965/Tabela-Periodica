import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { PanelProps } from '../components/SidePanel';
import type { ChemicalElement } from '../data/types';
import { useStore } from '../state/store';
import { ELEMENT_BY_SYMBOL, ONLY_PREDICTED_BULK, getElement } from '../data/elements';
import { CATEGORY_BY_ID } from '../data/categories';
import { compareRows, extremes, MAX_COMPARE, MIN_COMPARE, type CompareRow } from '../lib/compare';
import { superscript } from '../lib/format';
import { announce } from '../lib/announce';
import { ElementPicker } from '../components/ElementPicker';
import { Icon } from '../components/Icon';
import './compare.css';

interface Preset {
  id: string;
  label: string;
  symbols: string[];
  /** O que observar nessa comparação (fatos conferidos com os dados da tabela). */
  tip: string;
}

const PRESETS: Preset[] = [
  {
    id: 'grupo-14',
    label: 'Grupo 14',
    symbols: ['C', 'Si', 'Ge', 'Sn'],
    tip: 'Descendo o grupo, o raio atômico cresce e o caráter metálico aumenta: o carbono é um não metal, silício e germânio são semimetais e o estanho é um metal.',
  },
  {
    id: 'halogenios',
    label: 'Halogênios',
    symbols: ['F', 'Cl', 'Br', 'I'],
    tip: 'Descendo o grupo, o raio atômico aumenta e a eletronegatividade diminui. A 25 °C, flúor e cloro são gases, o bromo é líquido e o iodo é sólido.',
  },
  {
    id: 'alcalinos',
    label: 'Metais alcalinos',
    symbols: ['Li', 'Na', 'K', 'Rb'],
    tip: 'Descendo o grupo, a 1ª energia de ionização e o ponto de fusão diminuem: o elétron de valência sai com mais facilidade e a reatividade aumenta. Repare que a densidade não segue a regra à risca: o potássio é menos denso que o sódio.',
  },
  {
    id: 'gases-nobres',
    label: 'Gases nobres',
    symbols: ['He', 'Ne', 'Ar', 'Kr'],
    tip: 'Todos são gases a 25 °C. Descendo o grupo, o raio atômico e o ponto de ebulição aumentam e a energia de ionização diminui. Hélio, neônio e argônio não têm eletronegatividade de Pauling tabelada, pois quase não formam compostos (já o Kr forma alguns, como o KrF₂).',
  },
];

const zOf = (symbols: string[]) => symbols.flatMap((s) => ELEMENT_BY_SYMBOL.get(s.toLowerCase())?.z ?? []);
const sameSet = (a: number[], b: number[]) => a.length === b.length && a.every((z) => b.includes(z));

/** No meio de uma frase, nomes de elementos são substantivos comuns: "carbono, silício e germânio". */
const listNames = (els: ChemicalElement[]) => {
  const names = els.map((e) => e.name.toLocaleLowerCase('pt-BR'));
  return names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`;
};
const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase('pt-BR') + text.slice(1);

/** Hifens opcionais (soft hyphen) para rótulos longos caberem na coluna fixa da tabela. */
const breakable = (label: string) => label.replace('Eletronegatividade', 'Eletro\u00adnegatividade');

/**
 * Espaço não separável antes das unidades curtas: "1.538 °C" nunca quebra entre o
 * número e "°C". Densidades ("0,534 g/cm³") podem quebrar antes da unidade; senão
 * não cabem nas colunas estreitas e invadem a célula vizinha.
 */
const keepUnits = (value: string) => value.replace(/ (°C|K\)|pm|eV)/g, '\u00a0$1');

/** "[Ar] 3d10 4s2" → "[Ar] 3d¹⁰ 4s²" (os elétrons de cada subnível em sobrescrito). */
const prettyConfig = (config: string) => config.replace(/(\d)([spdf])(\d+)/g, (_, n: string, l: string, e: string) => `${n}${l}${superscript(e)}`);

export default function ComparePanel({ openElement, pointElement }: PanelProps) {
  const { state, dispatch } = useStore();
  const pickerId = useId();
  const chipsRef = useRef<HTMLUListElement>(null);
  const fullRef = useRef<HTMLParagraphElement>(null);
  const manualLinkRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  /**
   * Para onde levar o foco depois que a seleção mudar: índice do chip vizinho
   * ao removido, ou o aviso de limite (o campo de busca fica desativado).
   */
  const pendingFocus = useRef<number | 'full' | null>(null);
  const [manualLink, setManualLink] = useState<string | null>(null);
  /** A tabela é mais larga que o painel? Há colunas escondidas à direita? */
  const [scrollState, setScrollState] = useState({ overflow: false, moreRight: false });

  const elements = useMemo(() => state.compare.map(getElement), [state.compare]);
  const hasTable = elements.length >= MIN_COMPARE;
  const rows = useMemo(() => (elements.length >= MIN_COMPARE ? compareRows(elements) : []), [elements]);
  const full = elements.length >= MAX_COMPARE;
  const activePreset = PRESETS.find((p) => sameSet(zOf(p.symbols), state.compare));

  useEffect(() => {
    const target = pendingFocus.current;
    if (target === null) return;
    pendingFocus.current = null;
    if (target === 'full') {
      fullRef.current?.focus();
      return;
    }
    const buttons = chipsRef.current?.querySelectorAll<HTMLButtonElement>('button');
    (buttons?.length ? buttons[Math.min(target, buttons.length - 1)] : document.getElementById(pickerId))?.focus();
  }, [state.compare, pickerId]);

  // O link copiado manualmente deixa de valer se a seleção mudar.
  useEffect(() => setManualLink(null), [state.compare]);

  // Se a cópia automática falhar, o campo com o link recebe o foco já selecionado.
  useEffect(() => {
    if (manualLink) manualLinkRef.current?.focus();
  }, [manualLink]);

  // Ao fechar o painel, remove o destaque deixado por hover/foco nos chips ou cabeçalhos.
  useEffect(() => () => pointElement(null), [pointElement]);

  // Indica visualmente quando há colunas fora da área visível (rolagem horizontal).
  useEffect(() => {
    const box = scrollRef.current;
    if (!hasTable || !box) return;
    const update = () => {
      const overflow = box.scrollWidth - box.clientWidth > 1;
      const moreRight = overflow && box.scrollLeft + box.clientWidth < box.scrollWidth - 1;
      setScrollState((s) => (s.overflow === overflow && s.moreRight === moreRight ? s : { overflow, moreRight }));
    };
    update();
    box.addEventListener('scroll', update, { passive: true });
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(box);
    const table = box.querySelector('table');
    if (table) observer?.observe(table);
    return () => {
      box.removeEventListener('scroll', update);
      observer?.disconnect();
    };
  }, [hasTable]);

  function add(z: number) {
    const el = getElement(z);
    if (full) {
      announce(`Compare no máximo ${MAX_COMPARE} elementos`);
      return;
    }
    // Com o 4º elemento o campo é desativado; o foco vai para o aviso de limite.
    if (elements.length + 1 >= MAX_COMPARE) pendingFocus.current = 'full';
    dispatch({ type: 'toggleCompare', z });
    announce(`${el.name} adicionado à comparação`);
  }

  function remove(z: number, index: number) {
    pendingFocus.current = index;
    // O botão removido não recebe "pointerleave": limpa o destaque aqui.
    pointElement(null);
    dispatch({ type: 'toggleCompare', z });
    announce(`${getElement(z).name} removido da comparação`);
  }

  function clear() {
    pendingFocus.current = 0;
    pointElement(null);
    dispatch({ type: 'setCompare', z: [] });
    announce('Comparação limpa');
  }

  function applyPreset(p: Preset) {
    pointElement(null);
    dispatch({ type: 'setCompare', z: zOf(p.symbols) });
    announce(`Comparando ${p.label}: ${p.symbols.join(', ')}`);
  }

  async function copyLink() {
    const symbols = elements.map((e) => e.symbol.toLowerCase()).join(',');
    const url = `${window.location.origin}${window.location.pathname}#/comparar/${symbols}`;
    try {
      await navigator.clipboard.writeText(url);
      setManualLink(null);
      announce('Link da comparação copiado');
    } catch {
      // Sem acesso à área de transferência (permissão negada ou contexto inseguro): mostra o link para cópia manual.
      setManualLink(url);
      announce('Não foi possível copiar automaticamente. Copie o link exibido no painel.');
    }
  }

  return (
    <div className="cmp-panel">
      <p className="panel-lead">
        Escolha de 2 a 4 elementos — pelo campo abaixo ou clicando nos cartões enquanto este painel estiver aberto. Os valores
        aparecem lado a lado, com o maior e o menor de cada propriedade destacados.
      </p>

      <section className="panel-section" aria-labelledby={`${pickerId}-sel`}>
        <ElementPicker
          id={pickerId}
          label="Adicionar elemento"
          placeholder={full ? 'Limite de 4 elementos atingido' : 'Nome, símbolo ou número atômico'}
          excludeZ={state.compare}
          disabled={full}
          onPick={add}
        />
        {full ? (
          <p className="info-box cmp-full" role="note" ref={fullRef} tabIndex={-1}>
            Você já escolheu {MAX_COMPARE} elementos, o máximo. Remova um deles para adicionar outro.
          </p>
        ) : null}

        <div className="cmp-selected-head">
          <h3 className="section-title" id={`${pickerId}-sel`}>
            Selecionados ({elements.length} de {MAX_COMPARE})
          </h3>
          {elements.length ? (
            <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>
              <Icon name="reset" size={16} />
              Limpar
            </button>
          ) : null}
        </div>
        {elements.length ? (
          <ul className="chips cmp-chips" ref={chipsRef}>
            {elements.map((el, i) => (
              <li key={el.z}>
                <button
                  type="button"
                  className="chip cmp-chip"
                  style={{ '--chip-color': CATEGORY_BY_ID[el.category].color } as CSSProperties}
                  aria-label={`Remover ${el.name} da comparação`}
                  onClick={() => remove(el.z, i)}
                  onPointerEnter={() => pointElement(el.z)}
                  onPointerLeave={() => pointElement(null)}
                  onFocus={() => pointElement(el.z)}
                  onBlur={() => pointElement(null)}
                >
                  <span className="dot" aria-hidden="true" />
                  <strong className="cmp-chip-sym">{el.symbol}</strong>
                  <span>{el.name}</span>
                  <Icon name="close" size={14} className="cmp-chip-x" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted small">Nenhum elemento escolhido ainda. Experimente uma das comparações prontas abaixo.</p>
        )}
      </section>

      <section className="panel-section" aria-labelledby={`${pickerId}-presets`}>
        <h3 className="section-title" id={`${pickerId}-presets`}>
          Comparações prontas
        </h3>
        <div className="chips">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="chip"
              aria-pressed={activePreset?.id === p.id}
              aria-label={`${p.label}: ${p.symbols.join(', ')}`}
              onClick={() => applyPreset(p)}
            >
              {p.label}: <span className="mono">{p.symbols.join(', ')}</span>
            </button>
          ))}
        </div>
        {activePreset ? (
          <p className="info-box cmp-tip">
            <strong>O que observar: </strong>
            {activePreset.tip}
          </p>
        ) : null}
      </section>

      {elements.length === 1 ? (
        <p className="info-box">Escolha pelo menos mais um elemento para ver a comparação.</p>
      ) : null}

      {hasTable ? (
        <section className="panel-section" aria-labelledby={`${pickerId}-table`}>
          <h3 className="section-title" id={`${pickerId}-table`}>
            Comparação
          </h3>
          {scrollState.overflow ? (
            <p className="cmp-scroll-hint small muted" aria-hidden="true">
              Role a tabela para o lado para ver todas as colunas
              <Icon name="chevronRight" size={14} />
            </p>
          ) : null}
          <div className={`cmp-scroll-wrap${scrollState.moreRight ? ' has-more' : ''}`}>
            <div
              ref={scrollRef}
              className="table-scroll cmp-scroll"
              role="region"
              aria-label={
                scrollState.overflow
                  ? 'Tabela de comparação (role horizontalmente para ver todas as colunas)'
                  : 'Tabela de comparação'
              }
              tabIndex={0}
            >
              <table className="data-table cmp-table" style={{ '--cmp-cols': elements.length } as CSSProperties}>
                <caption className="sr-only">Comparação entre {listNames(elements)}</caption>
                <thead>
                  <tr>
                    <th scope="col" className="cmp-prop">
                      Propriedade
                    </th>
                    {elements.map((el) => (
                      <th scope="col" key={el.z} className="cmp-head">
                        <button
                          type="button"
                          className="cmp-tile"
                          style={{ '--cat': CATEGORY_BY_ID[el.category].color } as CSSProperties}
                          onClick={() => openElement(el.z)}
                          onPointerEnter={() => pointElement(el.z)}
                          onPointerLeave={() => pointElement(null)}
                          onFocus={() => pointElement(el.z)}
                          onBlur={() => pointElement(null)}
                          aria-label={`${el.name} (${el.symbol}): abrir ficha`}
                          title={`Abrir ficha de ${el.name}`}
                        >
                          <span className="cmp-tile-z">{el.z}</span>
                          <span className="cmp-tile-sym">{el.symbol}</span>
                          <span className="cmp-tile-name">{el.name}</span>
                          <span className="cmp-tile-code">{CATEGORY_BY_ID[el.category].code}</span>
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <CompareTableRow key={row.key} row={row} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <CompareNotes elements={elements} />

          <div className="cmp-actions">
            <button type="button" className="btn btn-primary" onClick={copyLink}>
              <Icon name="link" size={16} />
              Copiar link da comparação
            </button>
            <button type="button" className="btn btn-ghost" onClick={clear}>
              Limpar
            </button>
          </div>
          {manualLink ? (
            <label className="field cmp-manual-link">
              Copie este link:
              <input
                ref={manualLinkRef}
                className="input mono"
                readOnly
                value={manualLink}
                onFocus={(e) => e.currentTarget.select()}
              />
            </label>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

/** Uma linha da tabela: valores, selos "maior"/"menor" e barras proporcionais. */
function CompareTableRow({ row }: { row: CompareRow }) {
  const ext = row.numeric ? extremes(row.numeric) : null;
  // Valores empatados no extremo recebem o mesmo selo (ex.: K e Rb, ambos com 0,82).
  const maxValue = ext ? row.numeric?.[ext.max] ?? null : null;
  const minValue = ext ? row.numeric?.[ext.min] ?? null : null;
  const valid = row.numeric?.filter((v): v is number => v !== null) ?? [];
  const max = valid.length ? Math.max(...valid) : 0;
  const isConfig = row.key === 'config';

  return (
    <tr>
      <th scope="row" className="cmp-prop">
        {breakable(row.label)}
      </th>
      {row.values.map((value, i) => {
        const n = row.numeric?.[i] ?? null;
        const pct = n !== null && max > 0 && n >= 0 ? (n / max) * 100 : null;
        const isMax = n !== null && n === maxValue;
        const isMin = n !== null && n === minValue;
        const missing = value === 'não disponível';
        const classes = ['cmp-cell'];
        if (isMax) classes.push('is-max');
        if (isMin) classes.push('is-min');
        if (missing) classes.push('is-missing');
        if (isConfig) classes.push('is-config');
        return (
          <td key={i} className={classes.join(' ')}>
            {isConfig && !missing ? (
              <>
                <span className="cmp-value mono" aria-hidden="true">
                  {prettyConfig(value)}
                </span>
                <span className="sr-only">{value}</span>
              </>
            ) : (
              <span className="cmp-value">{keepUnits(value)}</span>
            )}
            {isMax ? (
              <span className="badge cmp-badge is-max">
                <span aria-hidden="true">▲</span> maior
              </span>
            ) : null}
            {isMin ? (
              <span className="badge cmp-badge is-min">
                <span aria-hidden="true">▼</span> menor
              </span>
            ) : null}
            {pct !== null ? (
              <span className="cmp-bar" aria-hidden="true">
                <span style={{ inlineSize: `${Math.max(pct, 2)}%` }} />
              </span>
            ) : null}
          </td>
        );
      })}
    </tr>
  );
}

/** Observações que ajudam a ler a tabela corretamente (unidades, estimativas, dados ausentes). */
function CompareNotes({ elements }: { elements: ChemicalElement[] }) {
  const notes: string[] = [
    'As barras são proporcionais ao maior valor de cada linha; nas temperaturas, a proporção usa a escala kelvin (absoluta).',
  ];
  if (elements.some((e) => e.state === 'gas')) {
    notes.push('A densidade de gases aparece em g/L (1 g/cm³ = 1.000 g/L); as barras usam a mesma unidade para todos.');
  }
  const massNumber = elements.filter((e) => e.massIsMassNumber);
  if (massNumber.length) {
    notes.push(
      `Massa entre colchetes (${massNumber.map((e) => e.symbol).join(', ')}): número de massa de um isótopo de referência (em geral, o de vida mais longa), pois o elemento não tem massa atômica padrão.`,
    );
  }
  const predicted = elements.filter((e) => ONLY_PREDICTED_BULK.has(e.z));
  if (predicted.length) {
    notes.push(
      `${capitalize(listNames(predicted))}: densidade e pontos de fusão e ebulição, quando aparecem, são estimativas teóricas — ${predicted.length === 1 ? 'o elemento nunca foi obtido' : 'esses elementos nunca foram obtidos'} em quantidade visível.`,
    );
  }
  const predictedConfig = elements.filter((e) => e.props.electronConfigurationPredicted);
  if (predictedConfig.length) {
    notes.push(`Configuração eletrônica prevista teoricamente (não medida): ${listNames(predictedConfig)}.`);
  }
  const noEn = elements.filter((e) => e.props.electronegativity === null);
  if (noEn.length) {
    notes.push(`Eletronegatividade “não disponível” para ${listNames(noEn)}: não há valor tabelado na escala de Pauling.`);
  }
  return (
    <ul className="cmp-notes muted small">
      {notes.map((n) => (
        <li key={n}>{n}</li>
      ))}
    </ul>
  );
}
