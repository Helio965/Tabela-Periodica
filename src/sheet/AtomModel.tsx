import { useId, useMemo, useState, type CSSProperties } from 'react';
import type { ChemicalElement } from '../data/types';
import { SHELL_LETTERS } from '../data/elements/shells';
import { formatNumber } from '../lib/format';
import { Icon } from '../components/Icon';

/** Acima deste número de núcleons o núcleo é desenhado de forma representativa. */
const MAX_NUCLEONS = 64;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
/** Raio máximo (em unidades do SVG) da camada mais externa. */
const OUTER_LIMIT = 186;

type IsotopeReason = 'abundante' | 'referencia' | 'primeiro';

interface Illustrated {
  massNumber: number;
  reason: IsotopeReason;
  abundance: number | null;
}

/**
 * Isótopo usado no desenho: o natural mais abundante; se não houver, o de
 * referência do CIAAW (vida mais longa); por fim, o primeiro da lista.
 */
function illustratedIsotope(el: ChemicalElement): Illustrated | null {
  const ground = el.isotopes.filter((i) => !i.isomer);
  const natural = ground.filter((i) => i.abundance !== null && i.abundance > 0);
  if (natural.length) {
    const best = natural.reduce((a, b) => ((b.abundance ?? 0) > (a.abundance ?? 0) ? b : a));
    return { massNumber: best.massNumber, reason: 'abundante', abundance: best.abundance };
  }
  const ref = el.props.atomicWeight.referenceIsotope;
  if (ref) return { massNumber: ref.massNumber, reason: 'referencia', abundance: null };
  const first = ground[0] ?? el.isotopes[0];
  return first ? { massNumber: first.massNumber, reason: 'primeiro', abundance: null } : null;
}

interface Nucleon {
  x: number;
  y: number;
  proton: boolean;
}

/** Distribui os núcleons numa espiral (filotaxia), formando um aglomerado compacto. */
function layoutNucleus(protons: number, neutrons: number) {
  const total = protons + neutrons;
  const drawn = Math.min(total, MAX_NUCLEONS);
  const representative = total > MAX_NUCLEONS;
  const drawnProtons = representative ? Math.max(1, Math.round((protons / total) * drawn)) : protons;
  const r = drawn <= 4 ? 9 : drawn <= 12 ? 7.5 : drawn <= 30 ? 6.5 : 5.6;
  const spacing = r * 0.92;
  const nucleons: Nucleon[] = [];
  for (let i = 0; i < drawn; i++) {
    const dist = drawn === 1 ? 0 : spacing * Math.sqrt(i + 0.5);
    const angle = i * GOLDEN_ANGLE;
    // Prótons e nêutrons intercalados de modo uniforme (algoritmo de Bresenham).
    const proton = Math.floor(((i + 1) * drawnProtons) / drawn) - Math.floor((i * drawnProtons) / drawn) === 1;
    nucleons.push({ x: dist * Math.cos(angle), y: dist * Math.sin(angle), proton });
  }
  const radius = (drawn === 1 ? 0 : spacing * Math.sqrt(drawn - 0.5)) + r;
  // Os de fora são desenhados primeiro, para que os centrais fiquem "por cima".
  return { nucleons: nucleons.reverse(), r, radius, drawn, drawnProtons, representative };
}

function shellRadii(count: number, nucleusRadius: number): number[] {
  if (count === 0) return [];
  const start = Math.max(nucleusRadius + 20, 44);
  if (count === 1) return [start + 30];
  const step = Math.min(30, (OUTER_LIMIT - start) / (count - 1));
  return Array.from({ length: count }, (_, i) => start + i * step);
}

const plural = (n: number, one: string, many: string) => `${formatNumber(n, 0)} ${n === 1 ? one : many}`;

export interface AtomModelProps {
  element: ChemicalElement;
}

/**
 * Modelo atômico educacional (camadas de Bohr) em SVG: núcleo com prótons e
 * nêutrons e elétrons distribuídos nas camadas K a Q.
 */
export function AtomModel({ element: el }: AtomModelProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [paused, setPaused] = useState(false);

  const model = useMemo(() => {
    const iso = illustratedIsotope(el);
    const protons = el.z;
    const neutrons = iso ? Math.max(0, iso.massNumber - el.z) : null;
    const nucleus = layoutNucleus(protons, neutrons ?? 0);
    const radii = shellRadii(el.shells.length, nucleus.radius);
    const extent = Math.max((radii.at(-1) ?? nucleus.radius) + 16, 110);
    return { iso, protons, neutrons, nucleus, radii, extent };
  }, [el]);

  const { iso, protons, neutrons, nucleus, radii, extent } = model;
  const shells = el.shells;
  const predicted = el.props.electronConfigurationPredicted;
  const distribution = shells.map((n, i) => `${SHELL_LETTERS[i]} ${n}`).join(', ');
  const isoLabel = iso ? `${el.symbol}-${iso.massNumber}` : null;

  const reasonText = !iso
    ? 'Não há dados de isótopos para ilustrar o número de nêutrons.'
    : iso.reason === 'abundante'
      ? `Isótopo ilustrado: o mais abundante na natureza (${formatNumber(iso.abundance, 4)}% dos átomos do elemento).`
      : iso.reason === 'referencia'
        ? 'Isótopo ilustrado: o de vida mais longa, usado como referência pelo CIAAW (o elemento não tem isótopos naturais estáveis de referência).'
        : 'Isótopo ilustrado: um dos isótopos conhecidos (não há isótopo natural de referência).';

  const desc = [
    `Núcleo com ${plural(protons, 'próton', 'prótons')}`,
    neutrons !== null ? ` e ${plural(neutrons, 'nêutron', 'nêutrons')}` : '',
    shells.length ? `; ${plural(shells.length, 'camada eletrônica', 'camadas eletrônicas')}: ${distribution}.` : '.',
  ].join('');

  const ids = { title: `${uid}-t`, desc: `${uid}-d`, proton: `${uid}-p`, neutron: `${uid}-n`, glow: `${uid}-g` };

  return (
    <div className="atom">
      <figure className="atom-figure">
        <svg
          className={`atom-svg${paused ? ' is-paused' : ''}`}
          viewBox={`${-extent} ${-extent} ${extent * 2} ${extent * 2}`}
          role="img"
          aria-labelledby={`${ids.title} ${ids.desc}`}
        >
          <title id={ids.title}>{`Modelo atômico simplificado: ${el.name}`}</title>
          <desc id={ids.desc}>{desc}</desc>
          <defs>
            <radialGradient id={ids.proton} cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#ffd3cf" />
              <stop offset="45%" stopColor="#ff7b72" />
              <stop offset="100%" stopColor="#b3261e" />
            </radialGradient>
            <radialGradient id={ids.neutron} cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#eef3ff" />
              <stop offset="45%" stopColor="#9fb3dd" />
              <stop offset="100%" stopColor="#4d5f8c" />
            </radialGradient>
            <radialGradient id={ids.glow}>
              <stop offset="0%" stopColor="var(--cat, #5eead4)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--cat, #5eead4)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle r={nucleus.radius * 2.4} fill={`url(#${ids.glow})`} />

          {radii.map((r, i) => (
            <circle key={`ring-${i}`} className="atom-ring" r={r} />
          ))}

          {radii.map((r, i) => {
            const count = shells[i];
            const offset = -Math.PI / 2 + i * 0.7;
            const style = { '--spin': `${16 + i * 7}s` } as CSSProperties;
            return (
              <g key={`orbit-${i}`} className={`atom-orbit${i % 2 ? ' is-reverse' : ''}`} style={style}>
                {Array.from({ length: count }, (_, j) => {
                  const a = offset + (j * 2 * Math.PI) / count;
                  const x = r * Math.cos(a);
                  const y = r * Math.sin(a);
                  return (
                    <g key={j}>
                      <circle className="atom-electron-glow" cx={x} cy={y} r={7.5} />
                      <circle className="atom-electron" cx={x} cy={y} r={3.8} />
                    </g>
                  );
                })}
              </g>
            );
          })}

          <g className="atom-nucleus">
            {nucleus.nucleons.map((n, i) => (
              <g key={i}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={nucleus.r}
                  fill={`url(#${n.proton ? ids.proton : ids.neutron})`}
                  stroke="rgba(4, 7, 13, 0.55)"
                  strokeWidth={0.8}
                />
                {n.proton && nucleus.r >= 7 ? (
                  <text className="atom-plus" x={n.x} y={n.y} dy="0.35em">
                    +
                  </text>
                ) : null}
              </g>
            ))}
          </g>

          {radii.map((r, i) => (
            <text key={`label-${i}`} className="atom-shell-label" x={0} y={-r} dy="0.35em">
              {SHELL_LETTERS[i]}
            </text>
          ))}
        </svg>
        <figcaption className="atom-legend">
          <span>
            <span className="atom-swatch is-proton" aria-hidden="true">
              +
            </span>
            Próton (carga +)
          </span>
          <span>
            <span className="atom-swatch is-neutron" aria-hidden="true" />
            Nêutron (sem carga)
          </span>
          <span>
            <span className="atom-swatch is-electron" aria-hidden="true" />
            Elétron (carga −)
          </span>
        </figcaption>
        <button
          type="button"
          className="btn btn-sm btn-ghost atom-toggle"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          <Icon name={paused ? 'play' : 'pause'} size={16} />
          Pausar animação
        </button>
      </figure>

      <div className="atom-info">
        <p className="atom-counts">
          <strong>{plural(protons, 'próton', 'prótons')}</strong>,{' '}
          <strong>{neutrons !== null ? plural(neutrons, 'nêutron', 'nêutrons') : 'nêutrons: não disponível'}</strong>
          {isoLabel ? (
            <>
              {' '}
              (no isótopo ilustrado: <span className="mono sheet-nowrap">{isoLabel}</span>)
            </>
          ) : null}
          , <strong>{plural(protons, 'elétron', 'elétrons')}</strong>
        </p>
        <p className="sheet-note">{reasonText}</p>

        <h3 className="atom-subtitle">Elétrons por camada{predicted ? ' (distribuição prevista)' : ''}</h3>
        {shells.length ? (
          <ol className="atom-shells" aria-label={`Distribuição por camada: ${distribution}`}>
            {shells.map((n, i) => (
              <li key={i}>
                <span className="atom-shell-letter">{SHELL_LETTERS[i]}</span>
                <span className="atom-shell-count">{n}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="muted">não disponível</p>
        )}
        <p className="sheet-note">
          Cada camada (K, L, M, N, O, P, Q) corresponde a um nível de energia; quanto mais externa, maior a energia dos
          elétrons.
        </p>

        {nucleus.representative ? (
          <p className="sheet-note">
            O núcleo foi desenhado com {nucleus.drawn} partículas representativas, na mesma proporção entre prótons e
            nêutrons; os números exatos estão acima.
          </p>
        ) : null}
        <p className="sheet-note">Fora de escala: na realidade, o núcleo é dezenas de milhares de vezes menor que o átomo.</p>
        <p className="info-box atom-warning">
          <strong>Modelo educacional simplificado:</strong> os elétrons não giram em órbitas como planetas; eles ocupam
          orbitais, regiões de probabilidade (modelo quântico).
        </p>
      </div>
    </div>
  );
}
