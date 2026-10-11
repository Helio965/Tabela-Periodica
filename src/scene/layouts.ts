import type { ChemicalElement } from '../data/types';
import { ELEMENTS } from '../data/elements';
import { chronological, discoveryYear } from '../lib/timeline';
import type { LayoutId } from '../state/types';

/** Dimensões de um cartão no espaço da cena (px CSS). */
export const CARD_W = 110;
export const CARD_H = 132;
const SX = 122; // espaçamento horizontal na tabela
const SY = 146; // espaçamento vertical na tabela

export type Vec3 = [number, number, number];

export interface Placement {
  position: Vec3;
  /** Ponto para onde o cartão deve "olhar"; `null` = de frente para +Z. */
  lookAt: Vec3 | null;
}

export type LabelKind = 'group' | 'period' | 'series' | 'placeholder' | 'block' | 'axis';

export interface LabelPlacement extends Placement {
  id: string;
  kind: LabelKind;
  text: string;
  /** Texto auxiliar menor (ex.: "Lantanídeos"). */
  sub?: string;
  /** Grupo/período representado, para os rótulos clicáveis. */
  value?: number;
}

export interface CameraPreset {
  position: Vec3;
  target: Vec3;
  /**
   * Largura e altura aproximadas do conteúdo, para enquadrar. `depth` é quanto
   * o conteúdo avança do alvo em direção à câmera (ex.: o raio do cilindro):
   * os cartões da frente ficam mais perto e, portanto, maiores na tela.
   */
  bounds: { width: number; height: number; depth?: number };
}

export interface LayoutResult {
  placements: Map<number, Placement>;
  labels: LabelPlacement[];
  camera: CameraPreset;
}

// ---------------------------------------------------------------------------
// Tabela (formato IUPAC de 18 colunas)
// ---------------------------------------------------------------------------
const tableRowY = (row: number) => (row <= 7 ? row - 1 : row - 1.5);
const TABLE_CENTER_Y = (tableRowY(10) + 0) / 2;

export function tableXY(col: number, row: number): [number, number] {
  return [(col - 9.5) * SX, -(tableRowY(row) - TABLE_CENTER_Y) * SY];
}

function tableLayout(elements: ChemicalElement[]): LayoutResult {
  const placements = new Map<number, Placement>();
  for (const el of elements) {
    const [x, y] = tableXY(el.gridColumn, el.gridRow);
    placements.set(el.z, { position: [x, y, 0], lookAt: null });
  }
  const labels: LabelPlacement[] = [];
  // Número do grupo acima da célula mais alta de cada coluna.
  for (let g = 1; g <= 18; g++) {
    const top = elements.filter((e) => e.group === g).reduce((a, b) => (a.gridRow < b.gridRow ? a : b));
    const [x, y] = tableXY(g, top.gridRow);
    labels.push({ id: `g${g}`, kind: 'group', text: String(g), value: g, position: [x, y + SY * 0.62, 0], lookAt: null });
  }
  for (let p = 1; p <= 7; p++) {
    const [x, y] = tableXY(1, p);
    labels.push({ id: `p${p}`, kind: 'period', text: String(p), value: p, position: [x - SX * 0.72, y, 0], lookAt: null });
  }
  const [lx, ly] = tableXY(3, 6);
  const [ax, ay] = tableXY(3, 7);
  labels.push({ id: 'ph-la', kind: 'placeholder', text: '57–71', sub: 'Lantanídeos', position: [lx, ly, 0], lookAt: null });
  labels.push({ id: 'ph-ac', kind: 'placeholder', text: '89–103', sub: 'Actinídeos', position: [ax, ay, 0], lookAt: null });
  const [s1x, s1y] = tableXY(1.4, 9);
  const [s2x, s2y] = tableXY(1.4, 10);
  labels.push({ id: 'series-la', kind: 'series', text: 'Lantanídeos', position: [s1x, s1y, 0], lookAt: null });
  labels.push({ id: 'series-ac', kind: 'series', text: 'Actinídeos', position: [s2x, s2y, 0], lookAt: null });

  return {
    placements,
    labels,
    camera: { position: [0, 0, 2600], target: [0, 0, 0], bounds: { width: 19.6 * SX, height: 10.6 * SY } },
  };
}

// ---------------------------------------------------------------------------
// Esfera (distribuição de Fibonacci, cartões voltados para fora)
// ---------------------------------------------------------------------------
function sphereLayout(elements: ChemicalElement[]): LayoutResult {
  const n = elements.length;
  const r = 620;
  const placements = new Map<number, Placement>();
  elements.forEach((el, i) => {
    const phi = Math.acos(-1 + (2 * i + 1) / n);
    const theta = Math.sqrt(n * Math.PI) * phi;
    const x = r * Math.cos(theta) * Math.sin(phi);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(theta) * Math.sin(phi);
    placements.set(el.z, { position: [x, y, z], lookAt: [x * 2, y * 2, z * 2] });
  });
  return { placements, labels: [], camera: { position: [0, 0, 2300], target: [0, 0, 0], bounds: { width: 1500, height: 1500 } } };
}

// ---------------------------------------------------------------------------
// Cilindro: a tabela "longa" de 32 colunas enrolada — ao terminar um
// período, a sequência recomeça do outro lado, ilustrando a periodicidade.
// ---------------------------------------------------------------------------
export function longFormColumn(el: ChemicalElement): number {
  if (el.block === 'f') return el.gridColumn; // 3–17
  if (el.group === null) return el.gridColumn;
  if (el.group <= 2) return el.group;
  if (el.group === 3) return 17;
  return el.group + 14; // grupos 4–18 → colunas 18–32
}

function cylinderLayout(elements: ChemicalElement[]): LayoutResult {
  const cols = 32;
  const r = (cols * 132) / (2 * Math.PI);
  const placements = new Map<number, Placement>();
  for (const el of elements) {
    const theta = ((longFormColumn(el) - 1) / cols) * Math.PI * 2;
    const x = r * Math.sin(theta);
    const z = r * Math.cos(theta);
    const y = -(el.period - 4) * 160;
    placements.set(el.z, { position: [x, y, z], lookAt: [x * 2, y, z * 2] });
  }
  const labels: LabelPlacement[] = [];
  for (let p = 1; p <= 7; p++) {
    labels.push({ id: `cyl-p${p}`, kind: 'axis', text: `Período ${p}`, position: [0, -(p - 4) * 160, 0], lookAt: null });
  }
  return { placements, labels, camera: { position: [0, 380, 2500], target: [0, 0, 0], bounds: { width: 2 * r + CARD_W, height: 6 * 160 + CARD_H, depth: r } } };
}

// ---------------------------------------------------------------------------
// Espiral (hélice crescente em número atômico)
// ---------------------------------------------------------------------------
function helixLayout(elements: ChemicalElement[]): LayoutResult {
  const r = 760;
  const n = elements.length;
  const placements = new Map<number, Placement>();
  elements.forEach((el, i) => {
    const theta = i * 0.24 + Math.PI;
    const y = -(i * 9.5) + 560;
    const x = r * Math.sin(theta);
    const z = r * Math.cos(theta);
    placements.set(el.z, { position: [x, y, z], lookAt: [x * 2, y, z * 2] });
  });
  return { placements, labels: [], camera: { position: [0, 200, 2600], target: [0, 0, 0], bounds: { width: 2 * r + CARD_W, height: (n - 1) * 9.5 + CARD_H, depth: r } } };
}

// ---------------------------------------------------------------------------
// Camadas: vista "explodida" da tabela, com cada bloco (s, p, d, f) em um
// plano de profundidade diferente.
// ---------------------------------------------------------------------------
export const BLOCK_DEPTH: Record<string, number> = { s: 540, d: 180, p: -180, f: -540 };

function layersLayout(elements: ChemicalElement[]): LayoutResult {
  const placements = new Map<number, Placement>();
  for (const el of elements) {
    const [x, y] = tableXY(el.gridColumn, el.gridRow);
    placements.set(el.z, { position: [x, y, BLOCK_DEPTH[el.block]], lookAt: null });
  }
  const labels: LabelPlacement[] = [
    { id: 'blk-s', kind: 'block', text: 'Bloco s', sub: 'orbitais s', position: [tableXY(1.5, 1)[0], tableXY(1, 1)[1] + SY * 0.9, BLOCK_DEPTH.s], lookAt: null },
    { id: 'blk-d', kind: 'block', text: 'Bloco d', sub: 'orbitais d', position: [tableXY(7.5, 4)[0], tableXY(1, 4)[1] + SY * 0.9, BLOCK_DEPTH.d], lookAt: null },
    { id: 'blk-p', kind: 'block', text: 'Bloco p', sub: 'orbitais p', position: [tableXY(15.5, 2)[0], tableXY(1, 2)[1] + SY * 0.9, BLOCK_DEPTH.p], lookAt: null },
    { id: 'blk-f', kind: 'block', text: 'Bloco f', sub: 'orbitais f', position: [tableXY(10, 9)[0], tableXY(1, 9)[1] + SY * 0.9, BLOCK_DEPTH.f], lookAt: null },
  ];
  return {
    placements,
    labels,
    camera: { position: [1700, 900, 2300], target: [0, -80, 0], bounds: { width: 19.6 * SX, height: 10.6 * SY } },
  };
}

// ---------------------------------------------------------------------------
// Grade 3D (5 × 5 × N)
// ---------------------------------------------------------------------------
function gridLayout(elements: ChemicalElement[]): LayoutResult {
  const placements = new Map<number, Placement>();
  const layers = Math.ceil(elements.length / 25);
  const [gx, gy, gz] = [260, 230, 620];
  elements.forEach((el, i) => {
    const x = ((i % 5) - 2) * gx;
    const y = (2 - (Math.floor(i / 5) % 5)) * gy;
    // A primeira camada (H…Mn) fica na frente; as seguintes, cada vez mais ao fundo.
    const z = ((layers - 1) / 2 - Math.floor(i / 25)) * gz;
    placements.set(el.z, { position: [x, y, z], lookAt: null });
  });
  return {
    placements,
    labels: [],
    camera: {
      // Quase de frente: as camadas de trás aparecem pelos vãos, como num túnel.
      position: [260, 180, 3600],
      target: [0, 0, 400],
      bounds: { width: 4 * gx + CARD_W + 500, height: 4 * gy + CARD_H + 260, depth: ((layers - 1) / 2) * gz - 400 },
    },
  };
}

// ---------------------------------------------------------------------------
// Linha do tempo: colunas por época de descoberta
// ---------------------------------------------------------------------------
export interface TimeBucket {
  id: string;
  label: string;
  from: number;
  to: number;
}

export function timeBuckets(): TimeBucket[] {
  const buckets: TimeBucket[] = [
    { id: 'ant', label: 'Antiguidade', from: Number.NEGATIVE_INFINITY, to: 999 },
    { id: 'med', label: 'até 1699', from: 1000, to: 1699 },
  ];
  for (let start = 1700; start < 2030; start += start < 1950 ? 10 : 25) {
    const end = start < 1950 ? start + 9 : start + 24;
    buckets.push({ id: `b${start}`, label: `${start}–${String(Math.min(end, 2026)).slice(2)}`, from: start, to: end });
  }
  return buckets;
}

export function bucketOf(el: ChemicalElement, buckets: TimeBucket[] = timeBuckets()): TimeBucket {
  const y = discoveryYear(el);
  return buckets.find((b) => y >= b.from && y <= b.to) ?? buckets[buckets.length - 1];
}

function timelineLayout(elements: ChemicalElement[]): LayoutResult {
  const buckets = timeBuckets().filter((b) => elements.some((el) => bucketOf(el).id === b.id));
  const colW = 128;
  const rowH = 146;
  const placements = new Map<number, Placement>();
  const counts = new Map<string, number>();
  for (const el of chronological(elements)) {
    const b = bucketOf(el);
    const col = buckets.findIndex((x) => x.id === b.id);
    const k = counts.get(b.id) ?? 0;
    counts.set(b.id, k + 1);
    const x = (col - (buckets.length - 1) / 2) * colW;
    const y = -500 + k * rowH;
    placements.set(el.z, { position: [x, y, 0], lookAt: null });
  }
  const maxStack = Math.max(...counts.values());
  const labels: LabelPlacement[] = buckets.map((b, col) => ({
    id: `tl-${b.id}`,
    kind: 'axis',
    text: b.label,
    position: [(col - (buckets.length - 1) / 2) * colW, -500 - rowH * 0.75, 0],
    lookAt: null,
  }));
  const width = buckets.length * colW + 100;
  const height = maxStack * rowH + 200;
  const centerY = -500 + (maxStack * rowH) / 2 - rowH;
  return { placements, labels, camera: { position: [0, centerY, 2600], target: [0, centerY, 0], bounds: { width, height } } };
}

const BUILDERS: Record<LayoutId, (els: ChemicalElement[]) => LayoutResult> = {
  table: tableLayout,
  sphere: sphereLayout,
  cylinder: cylinderLayout,
  helix: helixLayout,
  layers: layersLayout,
  grid: gridLayout,
  timeline: timelineLayout,
};

const cache = new Map<LayoutId, LayoutResult>();

export function computeLayout(id: LayoutId, elements: ChemicalElement[] = ELEMENTS): LayoutResult {
  if (elements === ELEMENTS && cache.has(id)) return cache.get(id)!;
  const result = BUILDERS[id](elements);
  if (elements === ELEMENTS) cache.set(id, result);
  return result;
}

export const LAYOUTS: Array<{ id: LayoutId; label: string; description: string }> = [
  { id: 'table', label: 'Tabela', description: 'Tabela periódica tradicional, no formato da IUPAC.' },
  { id: 'sphere', label: 'Esfera', description: 'Os 118 elementos distribuídos uniformemente sobre uma esfera.' },
  { id: 'cylinder', label: 'Cilindro', description: 'A tabela longa (32 colunas) enrolada: ao fim de cada período a sequência recomeça — a periodicidade em forma de anel.' },
  { id: 'helix', label: 'Espiral', description: 'Uma hélice em ordem crescente de número atômico.' },
  { id: 'layers', label: 'Camadas', description: 'Vista "explodida": cada bloco (s, p, d, f) em um plano de profundidade.' },
  { id: 'grid', label: 'Grade 3D', description: 'Cubo de camadas 5 × 5 em ordem de número atômico.' },
  { id: 'timeline', label: 'Linha do tempo', description: 'Elementos organizados pela época em que foram identificados.' },
];
