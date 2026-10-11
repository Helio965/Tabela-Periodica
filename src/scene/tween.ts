/** Suavizações usadas nas transições da cena. */
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
export const easeInOutExpo = (t: number) =>
  t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? 2 ** (20 * t - 10) / 2 : (2 - 2 ** (-20 * t + 10)) / 2;

export interface Tween {
  start: number;
  duration: number;
  delay: number;
  /** Recebe o progresso já suavizado (0–1). */
  update: (k: number) => void;
  done?: () => void;
}

/** Gerenciador mínimo de animações (evita depender de bibliotecas extras). */
export class TweenGroup {
  private tweens = new Set<Tween>();

  add(t: Omit<Tween, 'start'>, now: number): Tween {
    const tween = { ...t, start: now };
    this.tweens.add(tween);
    return tween;
  }

  clear() {
    this.tweens.clear();
  }

  get active() {
    return this.tweens.size > 0;
  }

  /** Avança todas as animações; retorna `true` se algo mudou. */
  tick(now: number, ease: (t: number) => number = easeInOutExpo): boolean {
    if (!this.tweens.size) return false;
    for (const t of this.tweens) {
      const elapsed = now - t.start - t.delay;
      if (elapsed < 0) continue;
      const p = Math.min(1, t.duration <= 0 ? 1 : elapsed / t.duration);
      t.update(ease(p));
      if (p >= 1) {
        this.tweens.delete(t);
        t.done?.();
      }
    }
    return true;
  }
}
