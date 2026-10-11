import { useCallback, useEffect, useMemo, useState } from 'react';
import { ELEMENTS } from '../data/elements';
import type { ChemicalElement } from '../data/types';
import { announce } from '../lib/announce';
import { discoveryYears, knownBy, TIMELINE_END, TIMELINE_START } from '../lib/timeline';
import { useStore } from '../state/store';

/** Posição mais à esquerda da linha do tempo: tudo o que era conhecido antes de 1600. */
export const ANTIQUITY_STEP = TIMELINE_START - 1;

export type Speed = 'lenta' | 'normal' | 'rapida';

export const SPEEDS: Array<{ id: Speed; label: string; ms: number }> = [
  { id: 'lenta', label: 'Lenta', ms: 1700 },
  { id: 'normal', label: 'Normal', ms: 900 },
  { id: 'rapida', label: 'Rápida', ms: 420 },
];

const SPEED_MS = Object.fromEntries(SPEEDS.map((s) => [s.id, s.ms])) as Record<Speed, number>;

/** Rótulo legível de uma posição da linha do tempo (`null` = hoje, todos os elementos). */
export function timelineLabel(year: number | null): string {
  if (year === null || year >= TIMELINE_END) return 'Hoje';
  if (year < TIMELINE_START) return 'Antiguidade';
  return String(year);
}

/** Elementos que "surgem" em um passo da reprodução. */
export function elementsOfStep(step: number): ChemicalElement[] {
  if (step < TIMELINE_START) return knownBy(step);
  return ELEMENTS.filter((el) => el.discovery.year === step);
}

/** Mensagem curta lida por leitores de tela e exibida no aviso flutuante. */
export function stepMessage(step: number): string {
  const found = elementsOfStep(step);
  if (step < TIMELINE_START) return `Antiguidade e Idade Média: ${found.length} elementos já conhecidos`;
  return `${step}: ${found.map((el) => el.name).join(', ')}`;
}

// A velocidade escolhida sobrevive à troca de painel durante a sessão.
let rememberedSpeed: Speed = 'normal';

export interface Evolution {
  /** Passos da reprodução: Antiguidade + cada ano em que houve descoberta. */
  steps: number[];
  playing: boolean;
  speed: Speed;
  setSpeed: (speed: Speed) => void;
  /** Último passo já alcançado no ano atual (`null` quando todos os elementos estão visíveis). */
  currentStep: number | null;
  prevStep: number | null;
  nextStep: number | null;
  /** Não há mais passos à frente: "reproduzir" recomeça do início. */
  atEnd: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  goPrev: () => void;
  goNext: () => void;
  /** Vai a um passo, marcando os elementos recém-surgidos e anunciando-os. */
  goToStep: (step: number) => void;
}

/**
 * Controla a reprodução da "evolução da tabela": avança ano a ano pelas
 * descobertas, atualizando o estado global (ano da linha do tempo e elementos
 * recém-descobertos) e anunciando cada passo.
 */
export function useEvolution(): Evolution {
  const { state, dispatch } = useStore();
  const [speed, setSpeedState] = useState<Speed>(rememberedSpeed);
  const steps = useMemo(() => [ANTIQUITY_STEP, ...discoveryYears()], []);
  const year = state.timelineYear;
  const playing = state.playing;

  const setSpeed = useCallback((next: Speed) => {
    rememberedSpeed = next;
    setSpeedState(next);
  }, []);

  // Navegação relativa ao ano atual (que pode não coincidir com um passo, se veio do controle deslizante).
  const { currentStep, prevStep, nextStep } = useMemo(() => {
    if (year === null) return { currentStep: null, prevStep: steps[steps.length - 1], nextStep: null };
    const before = steps.filter((s) => s < year);
    return {
      currentStep: [...before, ...steps.filter((s) => s === year)].pop() ?? null,
      prevStep: before.pop() ?? null,
      nextStep: steps.find((s) => s > year) ?? null,
    };
  }, [steps, year]);

  const goToStep = useCallback(
    (step: number) => {
      dispatch({ type: 'setTimelineYear', year: step });
      dispatch({ type: 'setFresh', z: elementsOfStep(step).map((el) => el.z) });
      announce(stepMessage(step));
    },
    [dispatch],
  );

  const pause = useCallback(() => dispatch({ type: 'setPlaying', playing: false }), [dispatch]);

  const play = useCallback(() => {
    // A partir do fim (ou com todos visíveis), recomeça da Antiguidade.
    if (nextStep === null) goToStep(steps[0]);
    dispatch({ type: 'setPlaying', playing: true });
  }, [dispatch, goToStep, nextStep, steps]);

  const toggle = useCallback(() => (playing ? pause() : play()), [pause, play, playing]);

  const goPrev = useCallback(() => {
    if (prevStep !== null) goToStep(prevStep);
  }, [goToStep, prevStep]);

  const goNext = useCallback(() => {
    if (nextStep !== null) goToStep(nextStep);
  }, [goToStep, nextStep]);

  // Relógio da reprodução: um único temporizador, refeito a cada passo e sempre limpo.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (nextStep === null) {
        dispatch({ type: 'setPlaying', playing: false });
        announce(`Fim da evolução: ${knownBy(TIMELINE_END).length} elementos conhecidos hoje`);
      } else {
        goToStep(nextStep);
      }
    }, SPEED_MS[speed]);
    return () => window.clearTimeout(timer);
  }, [playing, nextStep, speed, goToStep, dispatch]);

  return {
    steps,
    playing,
    speed,
    setSpeed,
    currentStep,
    prevStep,
    nextStep,
    atEnd: nextStep === null,
    play,
    pause,
    toggle,
    goPrev,
    goNext,
    goToStep,
  };
}
