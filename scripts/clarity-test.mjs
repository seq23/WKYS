// The Clarity loader: loads on public pages, never on /founder, /client or /portal, does nothing
// with no id, and a blocked or failed clarity.ms never throws into the page.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const src = await readFile('assets/clarity.js', 'utf8');
function run(pathname, code = src) {
  const added = [];
  const window = {};
  const document = { createElement: () => ({}), head: { appendChild: el => added.push(el) } };
  vm.runInNewContext(code, { window, document, location: { pathname }, encodeURIComponent });
  return { added, window };
}
const id = src.match(/const CLARITY_ID = '([^']*)'/)[1];
assert.match(id, /^[a-z0-9]{8,12}$/, 'CLARITY_ID is not a Clarity project id');
for (const p of ['/', '/pricing', '/ai-for-search-funds']) {
  const { added, window } = run(p);
  assert.equal(added.length, 1, `${p}: loader should add one script`);
  assert.equal(added[0].src, 'https://www.clarity.ms/tag/' + id);
  assert.equal(added[0].async, true);
  assert.doesNotThrow(() => added[0].onerror(), 'a failed clarity.ms load must not throw');
  assert.equal(typeof window.clarity, 'function', 'queue stub missing: calls before load would throw');
}
for (const p of ['/founder', '/founder.html', '/client', '/client.html', '/portal', '/portal.html']) assert.equal(run(p).added.length, 0, `${p}: Clarity must never load here`);
assert.equal(run('/', src.replace(/const CLARITY_ID = '[^']*'/, "const CLARITY_ID = ''")).added.length, 0, 'no id: nothing should load');
console.log('Clarity loader tests passed (public pages, never the apps or portal, empty id, failed load).');
