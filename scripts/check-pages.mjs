// Checks the built site in public/ (run `npm run build` first). Fails on: a page missing its own
// title, description, canonical, social tags or parsing JSON-LD; a duplicate title or description;
// "SPRY" used alone outside home sections 02-04; sections 02-04 changed at all; a wrong or old
// price; a page whose inquiry form differs from the home page's; Clarity on a signed-in page;
// a sitemap URL with no page behind it; an internal link to nothing.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { SITE, OFFERS, PAGES } from '../site/data.mjs';
import { LANDING } from '../site/pages/index.mjs';

const dir = process.argv[2] || 'public';
const read = f => readFile(`${dir}/${f}`, 'utf8');
const fail = [];
const check = (ok, msg) => { if (!ok) fail.push(msg); };

// Sections 02-04 (#approach through #experiences) are frozen by her ruling, 28 Nov 2026:
// "page 02-04 are fine as is". This hash is of that markup on main at eab2093.
const FROZEN_SHA256 = 'e065f8a974359d7cc153e6d4aa345eff16bcfafc05c632e85a6bfbc3e1dcb692';
export function frozenRegion(html) {
  const a = html.indexOf('<section class="section intro" id="approach">');
  const e = html.indexOf('<section class="section" id="experiences">');
  if (a < 0 || e < 0) return null;
  const end = html.indexOf('</section>', e) + '</section>'.length;
  return html.slice(a, end);
}

const indexable = [...PAGES.filter(p => p.path && !p.noindex).map(p => ({ file: p.file, path: p.path })), ...LANDING.map(p => ({ file: p.slug + '.html', path: '/' + p.slug }))];
const formPages = ['index.html', ...LANDING.map(p => p.slug + '.html')];
const questions = existsSync(`${dir}/questions`) ? (await readdir(`${dir}/questions`)).map(d => `questions/${d}/index.html`).filter(f => existsSync(`${dir}/${f}`)) : [];
const all = [...(await readdir(dir)).filter(f => f.endsWith('.html')), ...questions];
const apps = ['client.html', 'founder.html'];

const home = await read('index.html');
const frozen = frozenRegion(home);
check(frozen && createHash('sha256').update(frozen).digest('hex') === FROZEN_SHA256, 'index.html: sections 02-04 (#approach to #experiences) changed; they are frozen');
const homeForm = home.match(/<form id="spry-inquiry"[\s\S]*?<\/form>/)?.[0];
check(homeForm, 'index.html: no inquiry form');

const titles = new Map(), descs = new Map();
for (const file of all.filter(f => !apps.includes(f))) {
  const html = await read(file);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]*)">/)?.[1];
  check(title, `${file}: no <title>`);
  check(desc, `${file}: no meta description`);
  if (desc) check(desc.length >= 90 && desc.length <= 200, `${file}: description is ${desc.length} chars (aim 120-160)`);
  check((html.match(/<h1[ >]/g) || []).length === 1, `${file}: needs exactly one <h1>`);
  for (const tag of ['og:title', 'og:description', 'og:image', 'og:type', 'twitter:card']) check(html.includes(`"${tag}"`), `${file}: missing ${tag}`);
  if (titles.has(title)) fail.push(`${file}: title duplicates ${titles.get(title)}`); else titles.set(title, file);
  if (descs.has(desc)) fail.push(`${file}: description duplicates ${descs.get(desc)}`); else descs.set(desc, file);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail.push(`${file}: JSON-LD does not parse`); }
  }
  // The name: "SPRY" alone is never the business name outside the frozen sections.
  const outside = (file === 'index.html' && frozen ? html.replace(frozen, '') : html).replace(/<[^>]+>/g, ' ');
  const alone = outside.match(/.{0,30}\bSPRY\b.{0,30}/g);
  check(!alone, `${file}: "SPRY" used alone: ${alone?.join(' | ')}`);
  // Old prices and old offer wording, outside the form's fixed option values.
  const visible = html.replace(/value="[^"]*"/g, '');
  for (const old of [/\$30,000/, /\$10,000\s*(\/|a|per)\s*month/i, /\$2,500/, /\$25,000\+/, /\bSPRY Private\b/, /\bprivate consultation\b/i, /\bbook a call\b/i, /\bschedule a call\b/i]) check(!old.test(visible), `${file}: old wording ${old}`);
  // A price named next to one of our offers must be that offer's price.
  const words = visible.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  for (const o of OFFERS) {
    const name = o.id === 'assessment' ? 'Assessment' : o.name;
    for (const m of words.matchAll(new RegExp(`${name}[^$.;:(,]{0,6}(?:is |costs |at |· )?(?:from )?\\$(\\d{1,3}(?:,\\d{3})*)`, 'g'))) check('$' + m[1] === o.display.replace('from ', ''), `${file}: "${m[0]}" does not match ${o.display}`);
  }
  // Every inquiry form on the site is byte-identical to the home page's.
  const forms = html.match(/<form id="spry-inquiry"[\s\S]*?<\/form>/g) || [];
  for (const f of forms) check(f === homeForm, `${file}: inquiry form differs from the home page's`);
  // Internal links lead to a built page.
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const p = m[1];
    const target = p === '/' ? 'index.html' : p.endsWith('/') ? p.slice(1) + 'index.html' : existsSync(`${dir}${p}`) ? p.slice(1) : p.slice(1) + '.html';
    check(existsSync(`${dir}/${target}`), `${file}: link ${p} leads to nothing`);
  }
}

for (const { file, path } of indexable) {
  const html = await read(file);
  const url = SITE.url + (path === '/' ? '/' : path);
  check(html.includes(`<link rel="canonical" href="${url}">`), `${file}: canonical is not ${url}`);
  check(!/name="robots" content="[^"]*noindex/.test(html), `${file}: indexable page carries noindex`);
}
for (const p of PAGES.filter(p => p.noindex)) check(/<meta name="robots" content="noindex">/.test(await read(p.file)), `${p.file}: should be noindex`);

for (const file of formPages) {
  const html = await read(file);
  check(html.includes('<form id="spry-inquiry"'), `${file}: no inquiry form`);
  check(html.includes('src="/assets/site.js"'), `${file}: site.js (the form's sender) not loaded`);
  check(html.includes('src="/assets/clarity.js"'), `${file}: Clarity loader missing on a form page`);
  for (const o of OFFERS) check(html.includes(o.display), `${file}: does not show ${o.name} ${o.display}`);
}
for (const file of [...apps, 'portal.html']) check(!(await read(file)).includes('clarity'), `${file}: Clarity must never load here`);

// JSON-LD offers carry the same three prices.
for (const file of ['index.html', 'pricing.html']) {
  const graph = JSON.parse((await read(file)).match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const svc = graph.find(n => n['@type'] === 'Service');
  check(svc, `${file}: no Service in JSON-LD`);
  for (const o of OFFERS) {
    const off = svc?.offers.find(x => x.name === o.name);
    check(off && (off.price ?? off.priceSpecification?.minPrice) === o.price, `${file}: JSON-LD offer ${o.name} is not ${o.price}`);
  }
  check(graph.some(n => n['@type'] === 'FAQPage'), `${file}: no FAQPage`);
}

// Sitemap: exactly the indexable pages (plus question pages), each with a page behind it.
const sitemap = await read('sitemap.xml');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
for (const { path } of indexable) check(locs.includes(SITE.url + (path === '/' ? '/' : path)), `sitemap.xml: missing ${path}`);
for (const loc of locs) {
  const p = loc.replace(SITE.url, '');
  check(!/\.html$/.test(p), `sitemap.xml: ${loc} is not the clean URL`);
  const file = p === '/' ? 'index.html' : p.endsWith('/') ? p.slice(1) + 'index.html' : p.slice(1) + '.html';
  check(existsSync(`${dir}/${file}`), `sitemap.xml: ${loc} has no page`);
}

const llms = await read('llms.txt');
for (const o of OFFERS) check(llms.includes(`${o.name} ${o.display}`), `llms.txt: missing ${o.name} ${o.display}`);
const robots = await read('robots.txt');
for (const p of ['/founder', '/client', '/api/']) check(robots.includes(`Disallow: ${p}`), `robots.txt: does not disallow ${p}`);
for (const p of ['/portal', '/thanks']) check(!robots.includes(`Disallow: ${p}`), `robots.txt: disallows ${p}, so its noindex is never seen`);
const headers = await read('_headers');
for (const p of ['/founder', '/client', '/portal']) check(new RegExp(`^${p}\\n  ! Content-Security-Policy\\n  Content-Security-Policy: default-src 'self'; script-src 'self';`, 'm').test(headers), `_headers: ${p} lost its strict CSP`);
check(/script-src 'self' https:\/\/static\.cloudflareinsights\.com https:\/\/www\.clarity\.ms/.test(headers), '_headers: site CSP does not allow Cloudflare Web Analytics and Clarity');
check(existsSync(`${dir}/BingSiteAuth.xml`), 'BingSiteAuth.xml not shipped');
// The discover quiz prints its result from site.js: names and prices come from the page, never the script.
const js = await read('assets/site.js');
check(!/\$\d/.test(js), 'assets/site.js: a hard-coded price (the quiz must read prices from discover.html)');
check(!/\bSPRY\b/.test(js), 'assets/site.js: "SPRY" used alone');
for (const id of ['install', 'engagement', 'assessment']) check((await read('discover.html')).includes(`data-${id}="`), `discover.html: quiz price data-${id} missing`);

if (fail.length) { console.error(`check-pages: ${fail.length} problem(s)\n- ` + fail.join('\n- ')); process.exit(1); }
console.log(`check-pages: ${all.length} pages, ${locs.length} sitemap URLs, ${formPages.length} identical forms, frozen sections 02-04 unchanged: pass`);
