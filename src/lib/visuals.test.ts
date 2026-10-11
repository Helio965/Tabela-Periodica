import { describe, expect, it } from 'vitest';
import { ELEMENTS, ELEMENT_BY_SYMBOL } from '../data/elements';
import { initialState } from '../state/store';
import type { AppState } from '../state/types';
import { computeVisuals } from './visuals';

const z = (symbol: string) => ELEMENT_BY_SYMBOL.get(symbol.toLowerCase())!.z;
const base = initialState(() => 0);
const visuals = (patch: Partial<AppState>) => computeVisuals({ ...base, ...patch });
const v = (map: ReturnType<typeof computeVisuals>, symbol: string) => map.get(z(symbol))!;

describe('computeVisuals', () => {
  it('sem foco ativo, nada fica esmaecido nem destacado', () => {
    const map = visuals({});
    expect(map.size).toBe(118);
    for (const vis of map.values()) {
      expect(vis.dim).toBe(false);
      expect(vis.emphasis).toBe(false);
      expect(vis.undiscovered).toBe(false);
      expect(vis.rank).toBeUndefined();
      expect(vis.trend).toBeUndefined();
      expect(vis.matterState).toBeUndefined();
    }
  });

  it('filtro "radioativos": Tc em destaque com selo ☢ e Fe esmaecido', () => {
    const map = visuals({ filters: ['radioativos'] });
    expect(v(map, 'Tc')).toMatchObject({ dim: false, emphasis: true, radiationBadge: true });
    expect(v(map, 'Fe')).toMatchObject({ dim: true, emphasis: false, radiationBadge: false });
    const dimmed = [...map.values()].filter((x) => x.dim).length;
    expect(dimmed).toBe(118 - ELEMENTS.filter((e) => e.radioactive).length);
  });

  it('o selo ☢ só aparece com o filtro "radioativos"', () => {
    expect(v(visuals({}), 'U').radiationBadge).toBe(false);
    expect(v(visuals({ filters: ['naturais'] }), 'U').radiationBadge).toBe(false);
  });

  it('filtros combinados (E lógico)', () => {
    const map = visuals({ filters: ['radioativos', 'naturais'] });
    expect(v(map, 'U').dim).toBe(false);
    expect(v(map, 'Og').dim).toBe(true);
    expect(v(map, 'Fe').dim).toBe(true);
  });

  it('ranking marca a posição e esmaece os demais (só no painel Explorar)', () => {
    const map = visuals({ panel: 'explore', ranking: { kind: 'lightest', size: 5 } });
    expect(v(map, 'H').rank).toBe(1);
    expect(v(map, 'He').rank).toBe(2);
    expect(v(map, 'B').rank).toBe(5);
    expect(v(map, 'B').dim).toBe(false);
    expect(v(map, 'C').rank).toBeUndefined();
    expect(v(map, 'C').dim).toBe(true);

    const heavy = visuals({ panel: 'explore', ranking: { kind: 'heaviest', size: 10 } });
    expect(v(heavy, 'Og').rank).toBe(1);
    expect([...heavy.values()].filter((x) => x.rank !== undefined)).toHaveLength(10);

    // Em outro painel, o ranking não é aplicado.
    const other = visuals({ panel: 'trends', ranking: { kind: 'lightest', size: 5 } });
    expect(v(other, 'H').rank).toBeUndefined();
    expect(v(other, 'C').dim).toBe(false);
  });

  it('linha do tempo em 1800: germânio (1886) ainda não descoberto; ferro e oxigênio já conhecidos', () => {
    const map = visuals({ panel: 'discoveries', timelineYear: 1800 });
    expect(v(map, 'Ge').undiscovered).toBe(true);
    expect(v(map, 'Og').undiscovered).toBe(true);
    expect(v(map, 'Fe').undiscovered).toBe(false);
    expect(v(map, 'O').undiscovered).toBe(false);
    // A linha do tempo só vale no painel Descobertas e com um ano escolhido.
    expect(v(visuals({ panel: 'explore', timelineYear: 1800 }), 'Ge').undiscovered).toBe(false);
    expect(v(visuals({ panel: 'discoveries', timelineYear: null }), 'Ge').undiscovered).toBe(false);
  });

  it('painel de tendências preenche intensidade e rótulo formatado', () => {
    const map = visuals({ panel: 'trends', trend: 'electronegativity' });
    expect(v(map, 'F').trend).toBe(1);
    expect(v(map, 'F').trendLabel).toBe('3,98');
    expect(v(map, 'He').trend).toBeNull();
    expect(v(map, 'He').trendLabel).toBe('—');
    for (const vis of map.values()) {
      expect(vis.trend === null || (vis.trend! >= 0 && vis.trend! <= 1)).toBe(true);
      expect(typeof vis.trendLabel).toBe('string');
    }
    const density = visuals({ panel: 'trends', trend: 'density' });
    expect(v(density, 'Os').trend).toBe(1);
    expect(v(density, 'Fe').trendLabel).toBe('7,87 g/cm³');
  });

  it('modo "Estado da matéria" calcula o estado na temperatura escolhida', () => {
    const room = visuals({ panel: 'states', temperatureK: 298.15 });
    expect(v(room, 'Hg').matterState).toBe('liquid');
    expect(v(room, 'Fe').matterState).toBe('solid');
    expect(v(room, 'O').matterState).toBe('gas');
    expect(v(room, 'Og').matterState).toBe('unknown');
    const warm = visuals({ panel: 'states', temperatureK: 303 });
    expect(v(warm, 'Ga').matterState).toBe('liquid');
  });

  it('foco de categoria, grupo e período', () => {
    const cat = visuals({ categoryFocus: 'noble-gas' });
    expect(v(cat, 'Ne').emphasis).toBe(true);
    expect(v(cat, 'Na').dim).toBe(true);

    // Destaque temporário da legenda tem prioridade sobre o foco fixado.
    const hover = visuals({ categoryFocus: 'noble-gas', legendHover: 'halogen' });
    expect(v(hover, 'Cl').dim).toBe(false);
    expect(v(hover, 'Ne').dim).toBe(true);

    const group = visuals({ groupFocus: 1 });
    expect(v(group, 'H').emphasis).toBe(true);
    expect(v(group, 'Na').emphasis).toBe(true);
    expect(v(group, 'Mg').dim).toBe(true);
    // Lantanídeos não têm grupo: ficam fora do foco de grupo.
    expect(v(group, 'Nd').dim).toBe(true);

    const period = visuals({ periodFocus: 2 });
    expect([...period.values()].filter((x) => x.emphasis)).toHaveLength(8);
  });

  it('comparação, favoritos e elementos recém-descobertos', () => {
    const map = visuals({ compare: [z('C'), z('Si')], favorites: [z('Au')], freshlyDiscovered: [z('Ga')] });
    expect(v(map, 'C').inCompare).toBe(true);
    expect(v(map, 'Ge').inCompare).toBe(false);
    expect(v(map, 'Au').favorite).toBe(true);
    expect(v(map, 'Ga').fresh).toBe(true);
    expect(v(map, 'Ge').fresh).toBe(false);
  });
});
