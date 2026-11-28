import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
// Static checks on the built site (public/), the folder Pages serves.
for (const page of ['index', 'discover', 'portal', 'thanks', 'privacy', '404', 'pricing']) {
  const html = await readFile(`public/${page}.html`, 'utf8');
  assert.match(html, /<title>/); assert.match(html, /viewport/);
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) { const url = match[1]; if (/^(https?:|mailto:|\/)/.test(url)) continue; await access('public/' + url.split('#')[0]); }
}
const home = await readFile('public/index.html', 'utf8');
assert.match(home, /id="spry-inquiry"/); assert.match(home, /action="\/api\/inquiry"/); assert.doesNotMatch(home, /data-netlify/); assert.match(home, /\$10,000/);
assert.match(await readFile('public/portal.html', 'utf8'), /Illustrative demo only/);
for (const f of ['client.html', 'founder.html']) assert.equal(await readFile(`public/${f}`, 'utf8'), await readFile(f, 'utf8'), `${f} must ship unchanged`);
console.log('Static page, local link, form configuration and demo disclosure checks passed.');
