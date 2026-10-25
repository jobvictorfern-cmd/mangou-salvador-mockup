import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';
import {execFileSync} from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'IDs duplicados');
let references = 0;
for (const [, value] of html.matchAll(/\b(?:href|src|poster|data-src)="([^"]+)"/g)) {
  if (/^(?:https?:|mailto:|tel:)/.test(value)) continue;
  if (value.startsWith('#')) assert.ok(ids.includes(value.slice(1)), 'Âncora ausente: ' + value);
  else assert.ok(existsSync(resolve(root, value.split(/[?#]/)[0])), 'Arquivo ausente: ' + value);
  references++;
}
for (const [, value] of html.matchAll(/\baria-(?:controls|labelledby|describedby)="([^"]+)"/g)) {
  for (const id of value.split(/\s+/)) assert.ok(ids.includes(id), 'Referência ARIA ausente: ' + id);
}
for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
  assert.ok(/\balt="[^"]*"/.test(tag), 'Imagem sem alt');
  assert.ok(/\bwidth="\d+"/.test(tag) && /\bheight="\d+"/.test(tag), 'Imagem sem dimensões');
}
for (const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
  assert.ok(/\brel="[^"]*\bnoopener\b/.test(tag), 'Link externo sem noopener');
}
assert.equal((html.match(/class="flavor(?:\s[^"]*)?"/g) || []).length, 6, 'Seis sabores devem permanecer disponíveis');
for (const id of ['inicio', 'sabores', 'experiencia', 'onde', 'historia', 'galeria']) {
  assert.ok(ids.includes(id), 'Seção obrigatória ausente: ' + id);
}
assert.ok(html.includes('Consulte os ingredientes com a Mangou no Instagram.'), 'Dengo deve continuar sem receita inventada');
assert.ok(!/<(?:video|source|dialog)\b/.test(html), 'O filme e seu diálogo foram removidos da LP');
assert.ok(!/<iframe\b/.test(html), 'A LP não depende de incorporações externas');
assert.ok(!/cup-3d\.js/.test(html), 'A prévia 3D deve permanecer separada');
for (const [, value] of readFileSync(resolve(root, 'styles.css'), 'utf8').matchAll(/url\(['"]?([^'")]+)['"]?\)/g)) {
  assert.ok(existsSync(resolve(root, value)), 'Ativo CSS ausente: ' + value);
}
execFileSync(process.execPath, ['--check', resolve(root, 'script.js')], {stdio: 'inherit'});
execFileSync(process.execPath, ['--check', resolve(root, 'hero-parallax.js')], {stdio: 'inherit'});
console.log('OK: ' + references + ' referências locais, IDs, ARIA, seis sabores, imagens, ausência do filme e sintaxe JS.');
