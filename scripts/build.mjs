// Builds public/, the folder Cloudflare Pages serves (functions/ ships beside it from the repo root).
// Root *.html are the hand-written sources; site/pages/*.mjs are the landing pages; questions/ is
// the search loop's output. Heads, nav, footer, offers, the inquiry form, JSON-LD, sitemap.xml and
// llms.txt are rendered here from site/data.mjs, so every page states the same name and prices.
import { mkdir, cp, rm, readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { SITE, OFFERS, PAGES, FOOTER_GROUPS } from '../site/data.mjs';
import { head, header, footer, homeOffers, inquiry, landing, visibleFaq, jsonld, abs } from '../site/render.mjs';
import { LANDING } from '../site/pages/index.mjs';

await rm('public', { recursive: true, force: true });
await mkdir('public');

const foot = footer(LANDING);
const fill = (html, hasForm) => html
  .replace('<!--@header-->', header({ hasForm }))
  .replace('<!--@footer-->', foot)
  .replace('<!--@offers-->', homeOffers())
  .replace('<!--@inquiry-->', inquiry())
  .replace(/<!--@price:(assessment|install|engagement)-->/g, (_, id) => OFFERS.find(o => o.id === id).display);

const sitemap = [];
for (const page of PAGES) {
  const src = await readFile(page.file, 'utf8');
  if (!/<head><!--@head--><\/head>/.test(src)) throw Error(`${page.file}: missing <head><!--@head--></head>`);
  const hasForm = src.includes('<!--@inquiry-->');
  let html = fill(src, hasForm);
  const leftover = html.replace('<!--@head-->', '').match(/<!--@[a-z:]+-->/);
  if (leftover) throw Error(`${page.file}: unknown marker ${leftover[0]}`);
  const faq = visibleFaq(html);
  const ld = page.path ? jsonld({ path: page.path, title: page.title, description: page.description, faq, home: page.home, offers: page.offers, updated: page.updated, crumb: page.title.split(' | ')[0], speakable: html.includes('class="answer"') }) : null;
  html = html.replace('<head><!--@head--></head>', `<head>${head({ ...page, jsonld: ld })}</head>`);
  await writeFile(`public/${page.file}`, html);
  if (page.path && !page.noindex) sitemap.push({ loc: abs(page.path), lastmod: page.updated });
}

for (const page of LANDING) {
  const { body, faq } = landing(page, LANDING);
  const path = '/' + page.slug;
  const ld = jsonld({ path, title: page.title, description: page.description, faq, offers: page.kind === 'offer', article: page.kind !== 'offer', published: page.published, updated: page.updated, crumb: page.h1, speakable: true });
  const html = `<!doctype html><html lang="en"><head>${head({ title: page.title, description: page.description, path, clarity: true, jsonld: ld, type: page.kind === 'offer' ? 'website' : 'article' })}</head><body>${header({ hasForm: true })}${body}${foot}</body></html>`;
  await writeFile(`public/${page.slug}.html`, html);
  sitemap.push({ loc: abs(path), lastmod: page.updated });
}

// Copied as they are. client.html and founder.html are the signed-in apps: never re-rendered.
const indexNowKey = (await readdir('.')).filter(f => /^[a-f0-9]{32}\.txt$/.test(f));
if (indexNowKey.length !== 1) throw Error(`expected one IndexNow key file at the root, found ${indexNowKey.length}`);
for (const file of ['client.html', 'founder.html', 'robots.txt', 'BingSiteAuth.xml', '_headers', '_redirects', '_routes.json', 'assets', ...indexNowKey]) await cp(file, `public/${file}`, { recursive: true });

// Search loop question pages (questions/<slug>/index.html), when the engine has written any.
if (existsSync('questions')) {
  await cp('questions', 'public/questions', { recursive: true });
  for (const slug of (await readdir('questions')).sort()) {
    const file = `questions/${slug}/index.html`;
    if (!existsSync(file) || !(await stat(file)).isFile()) continue;
    const html = await readFile(file, 'utf8');
    if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
    const modified = html.match(/"dateModified":"(\d{4}-\d{2}-\d{2})/);
    sitemap.push({ loc: `${SITE.url}/questions/${slug}/`, lastmod: modified?.[1] });
  }
}

await writeFile('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(u => `<url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`);

const group = kind => LANDING.filter(p => p.kind === kind).map(p => `- [${p.h1}](${abs('/' + p.slug)}): ${p.description}`).join('\n');
await writeFile('public/llms.txt', `# ${SITE.name}

> ${SITE.name} (${SITE.short}) installs AI across a business in 30 days, trains the team to run it and hands every system over, so the owner keeps the accounts, data and deliverables. Fixed prices in US dollars: ${OFFERS.map(o => `${o.name} ${o.display}`).join('; ')}. The Assessment fee is credited to the install. No sales, audience growth or revenue guarantees.

Contact: send an inquiry with the form at ${SITE.url}/#inquire (email ${SITE.email}).

## Offers
${OFFERS.map(o => `- [${o.name}: ${o.display}](${abs(o.page)}): ${o.note} ${o.summary}`).join('\n')}
- [Pricing](${abs('/pricing')}): all three prices on one page, with what each includes.

## ${FOOTER_GROUPS[0].name}
${group('niche')}

## Questions
${group('question')}

## Site
- [Home](${SITE.url}/)
- [Discover your starting point](${abs('/discover')})
- [Privacy notice](${abs('/privacy')})
`);

console.log(`We Keep You Spry site built: ${PAGES.length} hand-written pages, ${LANDING.length} landing pages, ${sitemap.length} sitemap URLs. Internal docs and SQL excluded.`);
