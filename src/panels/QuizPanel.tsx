import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import type { PanelProps } from '../components/SidePanel';
import type { ChemicalElement } from '../data/types';
import { ELEMENTS } from '../data/elements';
import { CATEGORY_BY_ID } from '../data/categories';
import { makeQuestion, type QuizQuestion } from '../lib/quiz';
import { formatMass } from '../lib/format';
import { announce } from '../lib/announce';
import { Icon } from '../components/Icon';
import './compare.css';

type Difficulty = 'all' | 'easy' | 'natural';

const POOLS: Record<Difficulty, ChemicalElement[]> = {
  all: ELEMENTS,
  easy: ELEMENTS.filter((e) => e.z <= 36),
  natural: ELEMENTS.filter((e) => e.natural),
};

const DIFFICULTIES: Array<{ id: Difficulty; label: string; description: string }> = [
  { id: 'all', label: 'Todos', description: `Qualquer um dos ${POOLS.all.length} elementos.` },
  {
    id: 'easy',
    label: '1–36 (fáceis)',
    description: `Só os ${POOLS.easy.length} primeiros elementos (Z de 1 a 36, períodos 1 a 4), os mais conhecidos.`,
  },
  {
    id: 'natural',
    label: 'Naturais',
    description: `Só os ${POOLS.natural.length} elementos que ocorrem na natureza, mesmo que em traços.`,
  },
];

const MAX_CLUES = 4;
/** Quantas respostas recentes evitar repetir. */
const RECENT_MEMORY = 8;

/** 1 pista = 4 pontos; cada pista extra vale 1 ponto a menos (mínimo 1). */
const pointsFor = (cluesShown: number) => Math.max(1, MAX_CLUES - (cluesShown - 1));
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * As pistas já escondem o nome em português; aqui também escondemos o nome em
 * inglês (ex.: "neon" entregaria o neônio).
 */
function maskEnglishName(clue: string, el: ChemicalElement): string {
  if (el.nameEn.length < 3) return clue;
  const escaped = el.nameEn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return clue.replace(new RegExp(`\\b${escaped}\\b`, 'gi'), '▢▢▢');
}

function newQuestion(pool: ChemicalElement[], recent: number[]): QuizQuestion {
  const avoid = recent.slice(0, Math.min(RECENT_MEMORY, Math.floor(pool.length / 3)));
  let q = makeQuestion(Math.random, pool);
  for (let i = 0; i < 20 && avoid.includes(q.answer.z); i++) q = makeQuestion(Math.random, pool);
  return { ...q, clues: q.clues.map((c) => maskEnglishName(c, q.answer)) };
}

interface Score {
  points: number;
  answered: number;
  correct: number;
  streak: number;
  best: number;
}

const EMPTY_SCORE: Score = { points: 0, answered: 0, correct: 0, streak: 0, best: 0 };

export default function QuizPanel({ openElement, pointElement }: PanelProps) {
  const ids = useId();
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [question, setQuestion] = useState<QuizQuestion>(() => newQuestion(POOLS.all, []));
  const [number, setNumber] = useState(1);
  const [revealed, setRevealed] = useState(1);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState<Score>(EMPTY_SCORE);
  const [clueMessage, setClueMessage] = useState('');
  const recent = useRef<number[]>([]);
  const nextRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const focusTitle = useRef(false);

  const { answer, options, clues } = question;
  const answered = chosen !== null;
  const wasCorrect = chosen === answer.z;
  /** Pontos em jogo (ou ganhos, depois de acertar): dependem de quantas pistas foram vistas. */
  const potential = pointsFor(revealed);

  // Depois de responder, o foco vai para "Próxima pergunta"; numa nova pergunta
  // (ou ao zerar o placar, cujo botão some), para o título da pergunta.
  useEffect(() => {
    if (answered) nextRef.current?.focus();
  }, [answered]);
  useEffect(() => {
    if (!focusTitle.current) return;
    focusTitle.current = false;
    titleRef.current?.focus();
  });

  // Ao sair do quiz, remove o destaque do elemento na cena.
  useEffect(() => () => pointElement(null), [pointElement]);

  function startQuestion(pool: ChemicalElement[], moveFocus: boolean) {
    recent.current = [answer.z, ...recent.current].slice(0, RECENT_MEMORY);
    focusTitle.current = moveFocus;
    setQuestion(newQuestion(pool, recent.current));
    // Trocar uma pergunta ainda não respondida (ao mudar a dificuldade) não avança a numeração.
    if (answered) setNumber((n) => n + 1);
    setRevealed(1);
    setChosen(null);
    setClueMessage('');
    pointElement(null);
  }

  function changeDifficulty(d: Difficulty) {
    if (d === difficulty) return;
    setDifficulty(d);
    // Pergunta sem resposta é apenas trocada, sem perder pontos nem a sequência.
    startQuestion(POOLS[d], false);
    const label = DIFFICULTIES.find((x) => x.id === d)?.label ?? '';
    announce(`Dificuldade: ${label}. Nova pergunta.`);
  }

  function revealClue() {
    if (answered || revealed >= MAX_CLUES) return;
    const next = revealed + 1;
    setRevealed(next);
    setClueMessage(`Pista ${next}: ${clues[next - 1]}`);
  }

  function choose(z: number) {
    if (answered) return;
    const correct = z === answer.z;
    const pts = correct ? potential : 0;
    setChosen(z);
    setClueMessage('');
    setScore((s) => {
      const streak = correct ? s.streak + 1 : 0;
      return {
        points: s.points + pts,
        answered: s.answered + 1,
        correct: s.correct + (correct ? 1 : 0),
        streak,
        best: Math.max(s.best, streak),
      };
    });
    // Destaca a resposta na tabela.
    pointElement(answer.z);
    announce(
      correct
        ? `Correto! É ${answer.name} (${answer.symbol}). Você ganhou ${plural(pts, 'ponto', 'pontos')}.`
        : `Não foi dessa vez. A resposta certa é ${answer.name} (${answer.symbol}).`,
    );
  }

  function resetScore() {
    setScore(EMPTY_SCORE);
    // Recomeça a contagem: uma pergunta já respondida é trocada por uma nova (que será a pergunta 1).
    if (answered) startQuestion(POOLS[difficulty], true);
    else focusTitle.current = true;
    setNumber(1);
    announce('Placar zerado');
  }

  const cat = CATEGORY_BY_ID[answer.category];
  const currentDifficulty = DIFFICULTIES.find((d) => d.id === difficulty) ?? DIFFICULTIES[0];
  const shownClues = answered ? clues : clues.slice(0, revealed);

  return (
    <div className="quiz-panel">
      <p className="panel-lead">
        Descubra o elemento a partir das pistas. Acertando só com a primeira pista, você ganha 4 pontos; cada pista extra
        desconta 1 ponto (mínimo de 1 ponto por acerto).
      </p>

      <section className="panel-section" aria-labelledby={`${ids}-dif`}>
        <h3 className="section-title" id={`${ids}-dif`}>
          Dificuldade
        </h3>
        <div className="seg" role="group" aria-labelledby={`${ids}-dif`}>
          {DIFFICULTIES.map((d) => (
            <button key={d.id} type="button" aria-pressed={difficulty === d.id} onClick={() => changeDifficulty(d.id)}>
              {d.label}
            </button>
          ))}
        </div>
        <p className="muted small quiz-dif-desc">{currentDifficulty.description}</p>
      </section>

      <section className="panel-section" aria-labelledby={`${ids}-placar`}>
        <div className="quiz-score-head">
          <h3 className="section-title" id={`${ids}-placar`}>
            Placar
          </h3>
          {score.answered > 0 ? (
            <button type="button" className="btn btn-ghost btn-sm" onClick={resetScore}>
              <Icon name="reset" size={16} />
              Zerar placar
            </button>
          ) : null}
        </div>
        <dl className="quiz-score">
          <div>
            <dt>Pontos</dt>
            <dd>{score.points}</dd>
          </div>
          <div>
            <dt>Acertos</dt>
            <dd>
              {score.correct}
              <span className="quiz-score-of"> de {score.answered}</span>
            </dd>
          </div>
          <div>
            <dt>Sequência</dt>
            <dd>{score.streak}</dd>
          </div>
          <div>
            <dt>Recorde</dt>
            <dd>{score.best}</dd>
          </div>
        </dl>
      </section>

      <section className="panel-section quiz-question" aria-labelledby={`${ids}-q`}>
        <h3 id={`${ids}-q`} ref={titleRef} tabIndex={-1} className="quiz-title">
          Pergunta {number}: qual é o elemento?
        </h3>

        <ol className="quiz-clues">
          {shownClues.map((clue, i) => (
            <li key={i} className={i >= revealed ? 'is-extra' : undefined}>
              <span className="quiz-clue-n">
                Pista {i + 1}
                {i >= revealed ? <span className="quiz-clue-unused"> (não usada)</span> : null}
              </span>
              <span>{clue}</span>
            </li>
          ))}
        </ol>
        {shownClues.some((c) => c.includes('▢')) ? (
          <p className="muted small">Os quadradinhos (▢) escondem o nome ou o símbolo do elemento.</p>
        ) : null}

        {!answered ? (
          <div className="quiz-clue-actions">
            <button
              type="button"
              className="btn btn-sm"
              aria-disabled={revealed >= MAX_CLUES}
              onClick={revealClue}
            >
              <Icon name="info" size={16} />
              {revealed >= MAX_CLUES ? 'Todas as pistas já foram mostradas' : 'Mostrar outra pista'}
            </button>
            <span className="small quiz-potential">
              Acertando agora: <strong>{plural(potential, 'ponto', 'pontos')}</strong>
            </span>
          </div>
        ) : null}
        <p className="sr-only" aria-live="polite">
          {clueMessage}
        </p>

        <div className="quiz-options" role="group" aria-label="Alternativas">
          {options.map((el) => {
            const isAnswer = el.z === answer.z;
            const isChosen = el.z === chosen;
            const classes = ['quiz-option'];
            let mark: string | null = null;
            if (answered && isAnswer) {
              classes.push('is-correct');
              mark = isChosen ? 'Sua resposta: certa' : 'Resposta certa';
            } else if (answered && isChosen) {
              classes.push('is-wrong');
              mark = 'Sua resposta';
            } else if (answered) {
              classes.push('is-faded');
            }
            return (
              <button
                key={el.z}
                type="button"
                className={classes.join(' ')}
                style={{ '--cat': CATEGORY_BY_ID[el.category].color } as CSSProperties}
                aria-disabled={answered}
                aria-label={`${el.name} (${el.symbol})${mark ? ` — ${mark}` : ''}`}
                onClick={() => choose(el.z)}
              >
                <span className="quiz-sym" aria-hidden="true">
                  {el.symbol}
                </span>
                <span className="quiz-opt-text" aria-hidden="true">
                  <span className="quiz-opt-name">{el.name}</span>
                  {mark ? (
                    <span className="quiz-mark">
                      {isAnswer ? '✓' : '✗'} {mark}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {answered ? (
        <section className={`quiz-feedback ${wasCorrect ? 'is-correct' : 'is-wrong'}`} aria-labelledby={`${ids}-fb`}>
          <p className="quiz-verdict" id={`${ids}-fb`}>
            <span className="quiz-verdict-icon" aria-hidden="true">
              {wasCorrect ? '✓' : '✗'}
            </span>
            {wasCorrect
              ? `Correto! +${plural(potential, 'ponto', 'pontos')}${score.streak > 1 ? ` · ${score.streak} acertos seguidos` : ''}`
              : 'Não foi dessa vez.'}
          </p>
          <div className="quiz-reveal" style={{ '--cat': cat.color } as CSSProperties}>
            <span className="quiz-reveal-tile" aria-hidden="true">
              <span className="quiz-reveal-z">{answer.z}</span>
              <span className="quiz-reveal-sym">{answer.symbol}</span>
              <span className="quiz-reveal-code">{cat.code}</span>
            </span>
            <div>
              <p className="quiz-reveal-name">
                {wasCorrect ? '' : 'A resposta era '}
                <strong>
                  {answer.name} ({answer.symbol})
                </strong>
              </p>
              <p className="muted small">
                Número atômico {answer.z} ·{' '}
                {/* Entre colchetes não é massa atômica: é o número de massa de um isótopo de referência. */}
                {answer.massIsMassNumber
                  ? `número de massa do isótopo de referência ${formatMass(answer.atomicMassDisplay)}`
                  : `massa atômica ${formatMass(answer.atomicMassDisplay)} u`}{' '}
                · {cat.label}
              </p>
            </div>
          </div>
          <p className="small quiz-highlight">
            <strong>Curiosidade: </strong>
            {answer.highlight}
          </p>
          <div className="quiz-feedback-actions">
            <button type="button" ref={nextRef} className="btn btn-primary" onClick={() => startQuestion(POOLS[difficulty], true)}>
              Próxima pergunta
              <Icon name="chevronRight" size={16} />
            </button>
            <button type="button" className="btn" onClick={() => openElement(answer.z)}>
              <Icon name="book" size={16} />
              Abrir ficha
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
