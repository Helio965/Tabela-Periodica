#!/usr/bin/env node
/**
 * Verifica se os links externos usados no projeto respondem.
 *
 * Coleta URLs de:
 *  - src/data/sources.ts e src/data/history.ts (fontes citadas)
 *  - src/data/generated/properties.json (páginas de cada elemento no
 *    CIAAW, LANL, NIST e PubChem)
 *
 * Alguns sites científicos (iupac.org, rsc.org, iaea.org) bloqueiam acessos
 * automatizados com um desafio do Cloudflare (HTTP 403 com "Just a moment").
 * Esses casos são reportados como "protegido" — o link existe para pessoas,
 * mas não pode ser verificado por robôs.
 *
 * Uso: npm run check:links            (todos)
 *      npm run check:links -- --quick (só as fontes citadas)
 */
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { join } from 'node:path';

const ROOT = process.cwd();
const quick = process.argv.includes('--quick');

async function collect() {
  const urls = new Set();
  for (const file of ['src/data/sources.ts', 'src/data/history.ts']) {
    try {
      const text = await readFile(join(ROOT, file), 'utf8');
      for (const m of text.matchAll(/https?:\/\/[^\s'"`)<>]+/g)) urls.add(m[0].replace(/[.,;]$/, ''));
    } catch {
      /* arquivo opcional */
    }
  }
  if (!quick) {
    const props = JSON.parse(await readFile(join(ROOT, 'src/data/generated/properties.json'), 'utf8'));
    for (const p of props) for (const url of Object.values(p.links)) urls.add(url);
  }
  return [...urls];
}

const run = promisify(execFile);

/** Usa o curl (que respeita as configurações de proxy do sistema). */
async function curl(url, withBody) {
  const args = ['-sS', '-L', '--max-time', '30', '-A', 'Mozilla/5.0 (X11; Linux x86_64) link-checker', '-w', '\n%{http_code} %{url_effective}'];
  if (!withBody) args.push('-o', '/dev/null');
  args.push(url);
  const { stdout } = await run('curl', args, { maxBuffer: 20 * 1024 * 1024 });
  const lines = stdout.trimEnd().split('\n');
  const [status, final] = lines.pop().split(' ');
  return { status: Number(status), final, body: lines.join('\n') };
}

async function check(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await curl(url, false);
      if (res.status >= 200 && res.status < 400) return { url, status: res.status, result: 'ok', final: res.final };
      if (res.status === 403) {
        const again = await curl(url, true);
        if (/Just a moment|cf-chl|challenge-platform|cloudflare/i.test(again.body)) return { url, status: 403, result: 'protegido' };
      }
      if ((res.status >= 500 || res.status === 0) && attempt < 3) continue;
      return { url, status: res.status, result: 'quebrado' };
    } catch (err) {
      if (attempt === 3) return { url, status: 0, result: 'erro', error: err.message };
    }
  }
}

async function main() {
  const urls = await collect();
  console.log(`Verificando ${urls.length} links…`);
  const results = [];
  const queue = [...urls];
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (queue.length) {
        const url = queue.shift();
        results.push(await check(url));
      }
    }),
  );
  const by = (r) => results.filter((x) => x.result === r);
  for (const r of by('protegido')) console.log(`🛡  protegido (Cloudflare): ${r.url}`);
  for (const r of [...by('quebrado'), ...by('erro')]) console.log(`✗  ${r.status || r.error}: ${r.url}`);
  console.log(`\nOK: ${by('ok').length} · protegidos: ${by('protegido').length} · quebrados/erros: ${by('quebrado').length + by('erro').length}`);
  if (by('quebrado').length + by('erro').length > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
