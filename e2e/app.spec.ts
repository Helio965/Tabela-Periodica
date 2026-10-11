import { expect, test, type Page } from '@playwright/test';

/**
 * Testes de ponta a ponta: rodam no build de produção, em um navegador real,
 * no desktop e no celular (veja playwright.config.ts).
 */

const card = (page: Page, z: number) => page.locator(`.scene .element-card[data-z="${z}"]`);
const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 900;

/** Espera os cartões terminarem de voar até as posições (a animação inicial leva ~2 s). */
async function settle(page: Page) {
  await expect(page.locator('.scene .element-card')).toHaveCount(118);
  const host = card(page, 1).locator('xpath=..');
  let previous = '';
  await expect
    .poll(
      async () => {
        const now = await host.evaluate((el) => (el as HTMLElement).style.transform);
        const stable = now === previous;
        previous = now;
        return stable;
      },
      { intervals: [400], timeout: 15_000 },
    )
    .toBe(true);
}

/** No celular o painel é uma gaveta que começa recolhida. */
async function openPanel(page: Page) {
  if (!isMobile(page)) return;
  const grip = page.locator('.side-panel-grip');
  if ((await grip.getAttribute('aria-expanded')) !== 'true') await grip.click();
}

let errors: string[] = [];

test.beforeEach(async ({ page }) => {
  errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
});

test.afterEach(() => {
  expect(errors, `Erros no console:\n${errors.join('\n')}`).toEqual([]);
});

test('mostra os 118 elementos com número, símbolo, nome e massa', async ({ page }) => {
  await page.goto('/');
  await settle(page);
  const h = card(page, 1);
  await expect(h).toContainText('H');
  await expect(h).toContainText('Hidrogênio');
  await expect(h).toContainText('1,0080');
  await expect(h).toHaveAttribute('aria-label', /Hidrogênio, símbolo H, número atômico 1/);
  // Elementos sem isótopos estáveis mostram o número de massa entre colchetes.
  await expect(card(page, 118)).toContainText('[294]');
  // Números dos grupos e dos períodos são clicáveis.
  await expect(page.locator('.scene-label', { hasText: /^18$/ }).first()).toBeAttached();
});

test('clicar em um elemento abre a ficha completa, com endereço próprio', async ({ page }) => {
  await page.goto('/');
  await settle(page);
  await card(page, 11).click();
  const sheet = page.getByRole('dialog', { name: /Sódio/ });
  await expect(sheet).toBeVisible();
  await expect(page).toHaveURL(/#\/elemento\/sodio$/);
  await expect(sheet).toContainText('Informações gerais');
  await expect(sheet).toContainText('Como foi descoberto?');
  await expect(sheet).toContainText('Modelo educacional simplificado');
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(page).not.toHaveURL(/elemento/);
});

test('ficha de um elemento radioativo: isótopos, meias-vidas e navegação', async ({ page }) => {
  await page.goto('/#/elemento/uranio');
  const sheet = page.getByRole('dialog', { name: /Urânio/ });
  await expect(sheet).toBeVisible();
  await expect(sheet).toContainText('Urânio-235');
  await expect(sheet).toContainText('Nenhum isótopo estável');
  await expect(sheet).toContainText('704 milhões de anos');
  await expect(sheet).toContainText('Radioatividade');
  await expect(sheet).toContainText('Disputa de atribuição');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('dialog', { name: /Neptúnio/ })).toBeVisible();
  await expect(page).toHaveURL(/#\/elemento\/neptunio$/);
});

test('pesquisa por parte do nome, sem acento, e abre a ficha', async ({ page }) => {
  await page.goto('/');
  if (isMobile(page)) await page.getByRole('button', { name: 'Buscar elemento' }).click();
  const box = page.getByRole('combobox', { name: /Buscar elemento/ });
  await box.fill('hidro');
  await expect(page.getByRole('option', { name: /Hidrogênio/ })).toBeVisible();
  await box.press('Enter');
  await expect(page.getByRole('dialog', { name: /Hidrogênio/ })).toBeVisible();
});

test('pesquisa por símbolo e por número atômico', async ({ page }) => {
  await page.goto('/');
  if (isMobile(page)) await page.getByRole('button', { name: 'Buscar elemento' }).click();
  const box = page.getByRole('combobox', { name: /Buscar elemento/ });
  await box.fill('Fe');
  await expect(page.getByRole('option').first()).toContainText('Ferro');
  await box.fill('79');
  await expect(page.getByRole('option').first()).toContainText('Ouro');
});

test('filtro de radioativos esmaece (sem remover) os demais elementos', async ({ page }) => {
  await page.goto('/');
  await settle(page);
  await openPanel(page);
  await page.getByRole('button', { name: /^Radioativos\b/ }).click();
  await expect(page.locator('.explore-count')).toContainText('38 de 118');
  await expect(card(page, 26)).toHaveClass(/is-dim/); // ferro
  await expect(card(page, 43)).not.toHaveClass(/is-dim/); // tecnécio
  await expect(page.locator('.scene .element-card')).toHaveCount(118);
  // Filtros combinados (E lógico): radioativos + naturais exclui os sintéticos.
  await page.getByRole('button', { name: /^Naturais\b/ }).click();
  await expect(card(page, 92)).not.toHaveClass(/is-dim/); // urânio
  await expect(card(page, 95)).toHaveClass(/is-dim/); // amerício
});

test('ranking dos mais leves numera os elementos na tabela', async ({ page }) => {
  await page.goto('/');
  await settle(page);
  await openPanel(page);
  await page.getByRole('button', { name: 'Mais leves' }).click();
  await page.getByRole('button', { name: 'Top 5' }).click();
  await expect(card(page, 1).locator('.ec-rank')).toHaveText('#1');
  await expect(card(page, 5).locator('.ec-rank')).toHaveText('#5');
  await expect(card(page, 6)).toHaveClass(/is-dim/);
});

test('os cartões se movem ao trocar a disposição 3D', async ({ page }) => {
  await page.goto('/');
  await settle(page);
  const host = card(page, 26).locator('xpath=..');
  const before = await host.evaluate((el) => (el as HTMLElement).style.transform);
  for (const name of ['Esfera', 'Cilindro', 'Espiral', 'Camadas', 'Grade 3D', 'Linha do tempo', 'Tabela']) {
    const button = page.locator('.stb-layout', { hasText: new RegExp(`^${name}$`, 'i') });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    if (name === 'Esfera') {
      await settle(page);
      expect(await host.evaluate((el) => (el as HTMLElement).style.transform)).not.toBe(before);
    }
  }
  // Os mesmos 118 cartões continuam na cena (não é troca de tela).
  await expect(page.locator('.scene .element-card')).toHaveCount(118);
});

test('comparação por link compartilhável', async ({ page }) => {
  await page.goto('/#/comparar/c,si,ge');
  await openPanel(page);
  const table = page.locator('table.cmp-table');
  await expect(table).toBeVisible();
  for (const name of ['Carbono', 'Silício', 'Germânio']) await expect(table).toContainText(name);
  await expect(table).toContainText('Eletronegatividade');
});

test('evolução da tabela: tocar, pausar e ver elementos ainda não descobertos', async ({ page }) => {
  await page.goto('/#/modo/descobertas');
  await settle(page);
  await openPanel(page);
  await page.getByRole('button', { name: 'Ver evolução da tabela' }).click();
  await expect(page.getByRole('button', { name: 'Pausar' })).toBeVisible();
  await expect.poll(() => page.locator('.scene .element-card.is-undiscovered').count()).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Pausar' }).click();
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeVisible();
});

test('todos os painéis abrem pelo endereço, sem erros', async ({ page }) => {
  const panels: Array<[string, RegExp]> = [
    ['explorar', /Explorar elementos/],
    ['descobertas', /Descobertas/],
    ['tendencias', /Tendências periódicas/],
    ['estados', /Estado da matéria/],
    ['comparar', /Comparar elementos/],
    ['aprender', /Aprender/],
    ['historia', /História da Tabela Periódica/],
    ['fontes', /Fontes científicas/],
    ['quiz', /Quiz/],
  ];
  await page.goto('/');
  for (const [slug, title] of panels) {
    await page.evaluate((s) => {
      window.location.hash = `#/modo/${s}`;
    }, slug);
    await expect(page.locator('#side-panel-title')).toHaveText(title);
    await expect(page.locator('.side-panel-body')).not.toContainText('Carregando…');
    if (slug === 'historia') await expect(page.locator('.side-panel-body')).toContainText('Mendeleev');
    if (slug === 'fontes') await expect(page.locator('.side-panel-body')).toContainText('NUBASE2020');
  }
});

test('navegação por teclado entre os elementos', async ({ page }) => {
  test.skip(isMobile(page), 'teclado físico: só no desktop');
  await page.goto('/');
  await settle(page);
  await card(page, 1).focus();
  await page.keyboard.press('ArrowRight');
  await expect(card(page, 2)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(card(page, 10)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: /Neônio/ })).toBeVisible();
});

test('vista em lista acessível', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Lista/ }).click();
  await expect(page.locator('.element-card.is-compact')).toHaveCount(118);
  await page.locator('.element-card.is-compact[data-z="79"]').click();
  await expect(page.getByRole('dialog', { name: /Ouro/ })).toBeVisible();
});
