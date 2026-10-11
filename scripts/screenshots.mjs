#!/usr/bin/env node
/**
 * Gera as capturas de tela do README (docs/screenshots/*.png).
 *
 * Uso: com o app rodando (npm run dev ou npm run preview),
 *   BASE_URL=http://localhost:5173 npm run screenshots
 * Para usar um Chromium já instalado no sistema, defina CHROMIUM_PATH.
 */
import { mkdir } from 'node:fs/promises';
import { chromium, devices } from 'playwright';

const BASE = (process.env.BASE_URL || 'http://localhost:5173').replace(/\/$/, '');
const OUT = 'docs/screenshots';
const DESKTOP = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });

/** Abre uma página nova, espera os cartões pararem e recolhe o "Elemento em destaque". */
async function open(hash = '', context = DESKTOP) {
  const ctx = await browser.newContext({ ...context, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${hash}`);
  await page.waitForSelector('.scene .element-card');
  await page.waitForTimeout(3200);
  // Com a ficha aberta esses botões ficam sob a sobreposição: os cliques são opcionais.
  for (const name of ['Recolher o elemento em destaque', 'Dispensar dica']) {
    await page.getByRole('button', { name }).click({ timeout: 1500 }).catch(() => {});
  }
  return page;
}

async function layout(page, name) {
  await page.locator('.stb-layout', { hasText: new RegExp(`^${name}$`, 'i') }).click();
  await page.waitForTimeout(3200);
}

async function save(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`✓ ${OUT}/${name}.png`);
  await page.context().close();
}

await mkdir(OUT, { recursive: true });

// 1. Tabela no formato IUPAC
await save(await open(), 'tabela');

// 2. Esfera
{
  const page = await open();
  await layout(page, 'Esfera');
  await save(page, 'esfera');
}

// 3. Ficha do urânio (estrutura atômica)
{
  const page = await open('#/elemento/uranio');
  await page.getByRole('dialog').getByRole('button', { name: /^Átomo$/ }).first().click();
  await page.waitForTimeout(1200);
  await save(page, 'ficha-uranio');
}

// 4. Radioativos + ranking dos mais pesados
{
  const page = await open();
  await page.getByRole('button', { name: /^Radioativos\b/ }).click();
  await page.getByRole('button', { name: 'Mais pesados' }).click();
  await page.getByRole('button', { name: 'Top 10' }).click();
  await page.waitForTimeout(800);
  await save(page, 'radioativos');
}

// 5. Descobertas: a tabela em 1869, ano da tabela de Mendeleev
{
  const page = await open('#/modo/descobertas');
  await page.getByRole('slider', { name: 'Ano da linha do tempo' }).fill('1869');
  await page.waitForTimeout(1500);
  await save(page, 'descobertas');
}

// 6. Tendências: eletronegatividade
{
  const page = await open('#/modo/tendencias');
  await page.waitForTimeout(800);
  await save(page, 'tendencias');
}

// 7. Celular
{
  const page = await open('', { ...devices['Pixel 7'] });
  await save(page, 'celular');
}

await browser.close();
