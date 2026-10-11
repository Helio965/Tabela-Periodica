import { describe, expect, it } from 'vitest';
import { ELEMENTS, ELEMENT_BY_SYMBOL } from '../data/elements';
import { CARD_H, CARD_W, computeLayout, LAYOUTS, longFormColumn, tableXY, type Vec3 } from './layouts';

const dist = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const sym = (s: string) => ELEMENT_BY_SYMBOL.get(s.toLowerCase())!;

/** Menor distância entre os centros de dois cartões de uma disposição. */
function minDistance(id: Parameters<typeof computeLayout>[0]): number {
  const points = [...computeLayout(id).placements.values()].map((p) => p.position);
  let min = Infinity;
  for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) min = Math.min(min, dist(points[i], points[j]));
  return min;
}

describe('disposições 3D', () => {
  it.each(LAYOUTS.map((l) => l.id))('"%s" posiciona os 118 elementos com coordenadas finitas', (id) => {
    const { placements, camera } = computeLayout(id);
    expect(placements.size).toBe(118);
    for (const el of ELEMENTS) {
      const p = placements.get(el.z);
      expect(p, `Z=${el.z}`).toBeDefined();
      for (const v of [...p!.position, ...(p!.lookAt ?? [])]) expect(Number.isFinite(v)).toBe(true);
    }
    expect(camera.bounds.width).toBeGreaterThan(0);
    expect(camera.bounds.height).toBeGreaterThan(0);
  });

  it.each(['table', 'layers', 'grid', 'timeline'] as const)('"%s" não sobrepõe cartões que ficam no mesmo plano', (id) => {
    const placements = [...computeLayout(id).placements.values()].map((p) => p.position);
    for (let i = 0; i < placements.length; i++) {
      for (let j = i + 1; j < placements.length; j++) {
        const [a, b] = [placements[i], placements[j]];
        if (a[2] !== b[2]) continue;
        const overlap = Math.abs(a[0] - b[0]) < CARD_W && Math.abs(a[1] - b[1]) < CARD_H;
        expect(overlap, `cartões ${i} e ${j} sobrepostos em "${id}"`).toBe(false);
      }
    }
  });

  it.each(['sphere', 'cylinder', 'helix'] as const)('"%s" mantém os cartões afastados (sem colisão)', (id) => {
    expect(minDistance(id)).toBeGreaterThan(CARD_W);
  });

  it('a tabela segue o formato IUPAC de 18 colunas', () => {
    const pos = computeLayout('table').placements;
    const at = (s: string) => pos.get(sym(s).z)!.position;
    expect(at('H').slice(0, 2)).toEqual(tableXY(1, 1));
    expect(at('He').slice(0, 2)).toEqual(tableXY(18, 1));
    expect(at('Fe').slice(0, 2)).toEqual(tableXY(8, 4));
    expect(at('Og').slice(0, 2)).toEqual(tableXY(18, 7));
    // Lantanídeos e actinídeos em linhas separadas, abaixo da tabela principal.
    expect(at('La')[1]).toBeLessThan(at('Fr')[1]);
    expect(at('Ce')[1]).toBe(at('Lu')[1]);
    expect(at('Th')[1]).toBe(at('Lr')[1]);
    // Todos os cartões de frente para o observador.
    for (const p of pos.values()) expect(p.lookAt).toBeNull();
  });

  it('a tabela tem rótulos clicáveis para os 18 grupos e 7 períodos, e os marcadores 57–71 / 89–103', () => {
    const { labels } = computeLayout('table');
    expect(labels.filter((l) => l.kind === 'group').map((l) => l.value)).toEqual(Array.from({ length: 18 }, (_, i) => i + 1));
    expect(labels.filter((l) => l.kind === 'period').map((l) => l.value)).toEqual(Array.from({ length: 7 }, (_, i) => i + 1));
    expect(labels.filter((l) => l.kind === 'placeholder').map((l) => l.text)).toEqual(['57–71', '89–103']);
  });

  it('o cilindro usa a tabela longa de 32 colunas (bloco f entre os grupos 2 e 3)', () => {
    expect(longFormColumn(sym('H'))).toBe(1);
    expect(longFormColumn(sym('Ba'))).toBe(2);
    expect(longFormColumn(sym('La'))).toBe(3);
    expect(longFormColumn(sym('Lu'))).toBe(17);
    expect(longFormColumn(sym('Sc'))).toBe(17);
    expect(longFormColumn(sym('Hf'))).toBe(18);
    expect(longFormColumn(sym('Og'))).toBe(32);
    // Cada elemento do período 6 ocupa uma coluna diferente da tabela longa.
    const period6 = ELEMENTS.filter((e) => e.period === 6).map(longFormColumn);
    expect(new Set(period6).size).toBe(32);
  });

  it('nas camadas, cada bloco (s, p, d, f) fica em uma profundidade diferente', () => {
    const pos = computeLayout('layers').placements;
    const depthOf = (s: string) => pos.get(sym(s).z)!.position[2];
    const depths = new Set(['Na', 'Fe', 'Cl', 'U'].map(depthOf));
    expect(depths.size).toBe(4);
    expect(depthOf('Na')).toBe(depthOf('H'));
    expect(depthOf('U')).toBe(depthOf('Ce'));
  });

  it('a linha do tempo coloca os elementos antigos à esquerda e os sintéticos recentes à direita', () => {
    const pos = computeLayout('timeline').placements;
    const x = (s: string) => pos.get(sym(s).z)!.position[0];
    expect(x('Au')).toBeLessThan(x('O'));
    expect(x('O')).toBeLessThan(x('Ga'));
    expect(x('Ga')).toBeLessThan(x('Pu'));
    expect(x('Pu')).toBeLessThan(x('Og'));
  });
});
