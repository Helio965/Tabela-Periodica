import { useEffect, useMemo, useRef } from 'react';
import { QUALITY_PRESETS } from '../lib/quality';
import type { ResolvedQuality } from '../state/types';
import '../styles/shell.css';

interface Star {
  /** Posição normalizada (0–1), para que as estrelas não "pulem" ao redimensionar. */
  x: number;
  y: number;
  /** Raio em px CSS. */
  r: number;
  alpha: number;
  color: string;
}

/** Gerador pseudoaleatório determinístico (mulberry32): o céu é sempre o mesmo. */
function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const TINTS = ['255, 255, 255', '200, 222, 255', '170, 240, 230', '255, 232, 200'];

function makeStars(count: number, seed: number): Star[] {
  const rand = seeded(seed);
  return Array.from({ length: count }, () => {
    // Muitas estrelas pequenas e poucas maiores.
    const size = rand() ** 3;
    return {
      x: rand(),
      y: rand(),
      r: 0.35 + size * 1.25,
      alpha: 0.35 + rand() * 0.65,
      color: TINTS[Math.floor(rand() * TINTS.length)],
    };
  });
}

function draw(canvas: HTMLCanvasElement, stars: Star[]) {
  const ctx = canvas.getContext('2d');
  const { clientWidth: w, clientHeight: h } = canvas;
  if (!ctx || !w || !h) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  for (const s of stars) {
    const x = s.x * w;
    const y = s.y * h;
    ctx.fillStyle = `rgba(${s.color}, ${s.alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, s.r, 0, Math.PI * 2);
    ctx.fill();
    // Halo discreto nas estrelas maiores.
    if (s.r > 1.1) {
      ctx.fillStyle = `rgba(${s.color}, ${s.alpha * 0.12})`;
      ctx.beginPath();
      ctx.arc(x, y, s.r * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function StarCanvases({ count, twinkle }: { count: number; twinkle: boolean }) {
  const baseRef = useRef<HTMLCanvasElement>(null);
  const twinkleRef = useRef<HTMLCanvasElement>(null);

  // Na qualidade alta, ~1/5 das estrelas vai para uma camada que "cintila" (só opacidade, via CSS).
  const [steady, blinking] = useMemo(() => {
    const stars = makeStars(count, 118);
    if (!twinkle) return [stars, [] as Star[]];
    return [stars.filter((_, i) => i % 5 !== 0), stars.filter((_, i) => i % 5 === 0)];
  }, [count, twinkle]);

  useEffect(() => {
    const base = baseRef.current;
    if (!base) return;
    const redraw = () => {
      draw(base, steady);
      if (twinkleRef.current) draw(twinkleRef.current, blinking);
    };
    redraw();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', redraw);
      return () => window.removeEventListener('resize', redraw);
    }
    // Redesenha só quando o tamanho muda (sem laço de animação).
    let raf = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(redraw);
    });
    observer.observe(base);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [steady, blinking]);

  return (
    <div className="starfield" aria-hidden="true">
      <canvas ref={baseRef} className="starfield-layer" />
      {twinkle ? <canvas ref={twinkleRef} className="starfield-layer is-twinkle" /> : null}
    </div>
  );
}

/**
 * Céu estrelado decorativo atrás dos cartões. Desenhado uma única vez por
 * redimensionamento; nada é desenhado na qualidade baixa.
 */
export function Starfield({ quality }: { quality: ResolvedQuality }) {
  const count = QUALITY_PRESETS[quality].stars;
  if (count <= 0) return null;
  return <StarCanvases count={count} twinkle={quality === 'high'} />;
}
