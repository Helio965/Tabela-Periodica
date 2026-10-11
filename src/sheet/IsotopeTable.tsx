import { useId, type ReactNode } from 'react';
import type { ChemicalElement, Isotope } from '../data/types';
import { decayLabel, formatHalfLife, formatNumber, mainDecayModes, superscript } from '../lib/format';
import { Icon } from '../components/Icon';

const MASS_FORMAT = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 6, maximumFractionDigits: 6 });

/** Explicação curta dos tipos de decaimento mais comuns. */
const DECAY_EXPLANATIONS: Record<string, string> = {
  A: 'o núcleo emite uma partícula alfa (2 prótons e 2 nêutrons, um núcleo de hélio); o número atômico diminui 2.',
  'B-': 'um nêutron se transforma em próton e um elétron é emitido; o número atômico aumenta 1.',
  'B+': 'um próton se transforma em nêutron e um pósitron é emitido; o número atômico diminui 1.',
  EC: 'o núcleo absorve um elétron da eletrosfera e um próton vira nêutron; o número atômico diminui 1.',
  IT: 'um núcleo em estado excitado libera energia como radiação gama, sem mudar de elemento.',
  SF: 'o núcleo se divide sozinho em dois núcleos menores, liberando nêutrons e energia.',
  p: 'o núcleo expele um próton.',
  n: 'o núcleo expele um nêutron.',
  '2B-': 'dois nêutrons viram prótons ao mesmo tempo, com a emissão de dois elétrons.',
};

const byMassNumber = (a: Isotope, b: Isotope) => a.massNumber - b.massNumber || Number(a.isomer) - Number(b.isomer);

const isotopeKey = (iso: Isotope) => `${iso.massNumber}${iso.isomer ? 'm' : ''}`;

/** "Urânio-235" (isômeros: "Tecnécio-99m"). */
function isotopeName(el: ChemicalElement, iso: Isotope): string {
  return `${el.name}-${iso.massNumber}${iso.isomer ? 'm' : ''}`;
}

/** "²³⁵U" (isômeros: "⁹⁹ᵐTc"). */
function isotopeNotation(el: ChemicalElement, iso: Isotope): string {
  return `${superscript(iso.massNumber)}${iso.isomer ? 'ᵐ' : ''}${el.symbol}`;
}

function halfLifeText(iso: Isotope): string {
  if (iso.stable) return 'estável';
  return iso.halfLife ? formatHalfLife(iso.halfLife) : 'não disponível';
}

/**
 * Modos de decaimento relevantes, com a porcentagem quando há mais de um.
 * Se um modo medido domina (≥ 50%), os modos sem intensidade conhecida — em
 * geral raríssimos — são omitidos.
 */
function decayModesOf(iso: Isotope) {
  const modes = mainDecayModes(iso.decayModes);
  const dominant = modes.some((m) => m.intensity !== null && m.intensity >= 50);
  return dominant ? modes.filter((m) => m.intensity !== null) : modes;
}

function decayTexts(iso: Isotope): string[] {
  if (iso.stable) return [];
  const modes = decayModesOf(iso);
  return modes.map((m) => {
    const label = decayLabel(m.mode);
    if (modes.length === 1 || m.intensity === null) return label;
    return `${label}: ${m.approx ? '≈ ' : ''}${formatNumber(m.intensity, 2)}%`;
  });
}

function IsotopeRow({ element: el, iso }: { element: ChemicalElement; iso: Isotope }) {
  const decays = decayTexts(iso);
  return (
    <tr className={iso.stable ? 'is-stable' : 'is-radioactive'}>
      <th scope="row">
        <span className="iso-name">{isotopeName(el, iso)}</span>
        <span className="iso-notation" aria-hidden="true">
          {' · '}
          {isotopeNotation(el, iso)}
        </span>
      </th>
      <td className="mono">
        {iso.mass !== null ? MASS_FORMAT.format(iso.mass) : 'não disponível'}
        {iso.mass !== null && iso.massEstimated ? <span className="iso-estimated"> (estimada)</span> : null}
      </td>
      <td className="mono">
        {iso.abundance !== null ? (
          `${formatNumber(iso.abundance, 6)}%`
        ) : (
          <>
            <span aria-hidden="true">—</span>
            <span className="sr-only">sem abundância natural de referência</span>
          </>
        )}
      </td>
      <td>
        {iso.stable ? (
          <span className="badge ok">
            <span aria-hidden="true">✓</span> Estável
          </span>
        ) : (
          <span className="badge rad">
            <span aria-hidden="true">☢</span> Radioativo
          </span>
        )}
      </td>
      <td>{iso.stable ? <span className="muted">estável</span> : halfLifeText(iso)}</td>
      <td>
        {iso.stable ? (
          <>
            <span aria-hidden="true">—</span>
            <span className="sr-only">não decai</span>
          </>
        ) : decays.length ? (
          <ul className="iso-decays">
            {decays.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        ) : (
          'não disponível'
        )}
      </td>
    </tr>
  );
}

export interface IsotopeTableProps {
  element: ChemicalElement;
}

/** Tabela dos principais isótopos, separando estáveis e radioativos. */
export function IsotopeTable({ element: el }: IsotopeTableProps) {
  const captionId = useId();
  const isotopes = [...el.isotopes].sort(byMassNumber);
  const stable = isotopes.filter((i) => i.stable);
  const radioactive = isotopes.filter((i) => !i.stable);
  const stableCount = el.props.stableIsotopeCount;
  const hasIsomer = isotopes.some((i) => i.isomer);
  const longest = longestLived(el);

  return (
    <div className="iso">
      <p className="sheet-prose">
        Isótopos são átomos do mesmo elemento — todos com {el.z} {el.z === 1 ? 'próton' : 'prótons'} no núcleo — que
        diferem no número de nêutrons e, por isso, na massa.
      </p>
      {stableCount > 0 ? (
        <p className="iso-summary">
          <span className="badge ok">
            <span aria-hidden="true">✓</span> {stableCount} {stableCount === 1 ? 'isótopo estável' : 'isótopos estáveis'}
          </span>
          {radioactive.length ? (
            <span className="badge rad">
              <span aria-hidden="true">☢</span> {radioactive.length}{' '}
              {radioactive.length === 1 ? 'radioativo listado' : 'radioativos listados'}
            </span>
          ) : null}
        </p>
      ) : (
        <div className="info-box warn iso-none">
          <strong>Nenhum isótopo estável.</strong> Todos os isótopos conhecidos deste elemento são radioativos: com o
          tempo, seus núcleos se transformam em núcleos de outros elementos.
          {el.radioactivity === 'very-weak' && longest?.halfLife ? (
            <>
              {' '}
              Porém seu isótopo de vida mais longa, {isotopeName(el, longest)}, decai com meia-vida de{' '}
              {formatHalfLife(longest.halfLife)} — tão longa que, na prática, o elemento se comporta como estável.
            </>
          ) : null}
        </div>
      )}

      {isotopes.length ? (
        <div className="table-scroll iso-scroll" role="region" aria-labelledby={captionId} tabIndex={0} data-keep-arrows="">
          <table className="data-table iso-table">
            <caption id={captionId} className="sr-only">
              Principais isótopos: {el.name}
            </caption>
            <thead>
              <tr>
                <th scope="col">Isótopo</th>
                <th scope="col">Massa (u)</th>
                <th scope="col">Abundância natural</th>
                <th scope="col">Estabilidade</th>
                <th scope="col">Meia-vida</th>
                <th scope="col">Decaimento</th>
              </tr>
            </thead>
            {stable.length ? (
              <tbody className="iso-group">
                <tr className="iso-group-row is-stable">
                  <th colSpan={6} scope="rowgroup">
                    <span aria-hidden="true">✓</span> Isótopos estáveis ({stable.length})
                  </th>
                </tr>
                {stable.map((iso) => (
                  <IsotopeRow key={isotopeKey(iso)} element={el} iso={iso} />
                ))}
              </tbody>
            ) : null}
            {radioactive.length ? (
              <tbody className="iso-group">
                <tr className="iso-group-row is-radioactive">
                  <th colSpan={6} scope="rowgroup">
                    <span aria-hidden="true">☢</span> Isótopos radioativos ({radioactive.length})
                  </th>
                </tr>
                {radioactive.map((iso) => (
                  <IsotopeRow key={isotopeKey(iso)} element={el} iso={iso} />
                ))}
              </tbody>
            ) : null}
          </table>
        </div>
      ) : (
        <p className="muted">Dados de isótopos não disponíveis.</p>
      )}

      <p className="sheet-note">
        A tabela reúne os isótopos naturais, os de maior interesse e os de vida mais longa — não todos os já observados.
        Massas, meias-vidas e decaimentos: NUBASE2020; abundâncias: NIST. O traço (—) indica isótopo sem abundância
        natural de referência.
        {hasIsomer ? ' A letra “m” indica um isômero nuclear: o mesmo núcleo num estado excitado de vida longa.' : ''}
      </p>
    </div>
  );
}

/** Isótopo (não isômero) de meia-vida mais longa. */
function longestLived(el: ChemicalElement): Isotope | null {
  const candidates = el.isotopes.filter((i) => !i.stable && i.halfLife && !i.isomer);
  if (!candidates.length) return null;
  return candidates.reduce((a, b) => ((b.halfLife?.seconds ?? 0) > (a.halfLife?.seconds ?? 0) ? b : a));
}

/** Isótopos radioativos mais relevantes: os naturais e os de vida mais longa. */
function principalIsotopes(el: ChemicalElement, max = 4): Isotope[] {
  const radio = el.isotopes.filter((i) => !i.stable && i.halfLife);
  const bySeconds = (a: Isotope, b: Isotope) => (b.halfLife?.seconds ?? 0) - (a.halfLife?.seconds ?? 0);
  const natural = radio.filter((i) => i.abundance !== null).sort(bySeconds);
  const others = radio.filter((i) => i.abundance === null).sort((a, b) => Number(a.isomer) - Number(b.isomer) || bySeconds(a, b));
  return [...natural, ...others].slice(0, Math.max(max, natural.length));
}

export interface RadioactivityInfoProps {
  element: ChemicalElement;
  /** Texto sobre a ocorrência natural ou a produção artificial do elemento. */
  occurrence: string;
  /** Texto de riscos (vem do conteúdo carregado sob demanda). */
  hazards: ReactNode;
}

/** Subseção "Radioatividade" para elementos sem isótopos estáveis. */
export function RadioactivityInfo({ element: el, occurrence, hazards }: RadioactivityInfoProps) {
  const headingId = useId();
  const principal = principalIsotopes(el);
  const modes = [
    ...new Set(el.isotopes.filter((i) => !i.stable).flatMap((i) => decayModesOf(i).map((m) => m.mode))),
  ];
  const explained = modes.filter((m) => DECAY_EXPLANATIONS[m]);

  return (
    <section className="sheet-subsection radio-info" aria-labelledby={headingId}>
      <h3 id={headingId}>
        <Icon name="radiation" size={20} className="radio-icon" />
        Radioatividade
      </h3>
      <dl className="kv">
        <dt>Possui isótopos estáveis?</dt>
        <dd>
          <strong>Não.</strong>
          {el.radioactivity === 'very-weak'
            ? ' Mas a radioatividade é extremamente fraca: a meia-vida é tão longa que, na prática, o elemento se comporta como estável.'
            : ' Todos os isótopos conhecidos são radioativos.'}
        </dd>
        <dt>Ocorrência</dt>
        <dd>{occurrence}</dd>
      </dl>

      <h4>Principais isótopos e meias-vidas</h4>
      {principal.length ? (
        <ul className="radio-list">
          {principal.map((iso) => {
            const decays = decayTexts(iso);
            return (
              <li key={isotopeKey(iso)}>
                <strong>{isotopeName(el, iso)}</strong>{' '}
                <span className="muted" aria-hidden="true">
                  ({isotopeNotation(el, iso)})
                </span>
                : meia-vida de {halfLifeText(iso)}
                {decays.length ? ` · decai por ${decays.join(', ')}` : ''}
                {iso.abundance !== null ? ` · ${formatNumber(iso.abundance, 6)}% do elemento natural` : ''}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="muted">não disponível</p>
      )}

      {modes.length ? (
        <>
          <h4>Tipos de decaimento</h4>
          <ul className="chips radio-modes">
            {modes.map((m) => (
              <li key={m} className="chip is-static">
                {decayLabel(m)}
              </li>
            ))}
          </ul>
          {explained.length ? (
            <dl className="radio-glossary">
              {explained.map((m) => (
                <div key={m}>
                  <dt>{decayLabel(m)}</dt>
                  <dd>{DECAY_EXPLANATIONS[m]}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </>
      ) : null}

      <h4>Riscos</h4>
      {hazards}
      <p className="sheet-note">Conteúdo exclusivamente educativo; não contém instruções de manuseio.</p>
    </section>
  );
}
