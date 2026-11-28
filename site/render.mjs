import { SITE, OFFERS, FOOTER_GROUPS, fillPrices } from './data.mjs';

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Page text is plain text with two marks: [label](https://source) links and {offer} prices.
export const text = s => esc(fillPrices(s)).replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, (_, label, url) =>
  url.startsWith('/') ? `<a href="${url}">${label}</a>` : `<a href="${url}" rel="noopener">${label}</a>`);
const plain = s => fillPrices(s).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

export const abs = path => SITE.url + (path === '/' ? '/' : path);

export function head({ title, description, path, noindex, clarity, jsonld, type = 'website' }) {
  const url = path ? abs(path) : null;
  return [
    '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
    `<title>${esc(title)}</title><meta name="description" content="${esc(fillPrices(description))}">`,
    url && !noindex ? `<link rel="canonical" href="${url}">` : '',
    noindex ? '<meta name="robots" content="noindex">' : '',
    '<meta name="theme-color" content="#14251e">',
    `<meta property="og:type" content="${type}"><meta property="og:site_name" content="${SITE.name}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">`,
    url ? `<meta property="og:url" content="${url}">` : '',
    `<meta property="og:image" content="${SITE.ogImage}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="We Keep You Spry: AI installed across your business in 30 days">`,
    `<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${SITE.ogImage}">`,
    '<link rel="icon" href="/assets/mark.svg"><link rel="stylesheet" href="/assets/style.css"><script src="/assets/site.js" defer></script>',
    clarity ? '<script src="/assets/clarity.js" defer></script>' : '',
    jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>` : '',
  ].join('');
}

export const logo = (label = true) => `<a class="logo" href="/"${label ? ' aria-label="We Keep You Spry home"' : ''}><span class="wky">we keep you</span>spry<span>.</span></a>`;

// hasForm: the page carries the inquiry form, so "Inquire" stays on the page.
export const header = ({ hasForm }) => `<a class="skip" href="#main">Skip to content</a><header class="nav">${logo()}<button class="menu" aria-expanded="false" aria-controls="navlinks">Menu</button><nav id="navlinks"><a href="/#approach">Approach</a><a href="/#experiences">Experiences</a><a href="/#private">Offers</a><a href="/pricing">Pricing</a><a href="/discover">Discover</a><a class="navcta" href="${hasForm ? '#inquire' : '/#inquire'}">Inquire ↗</a></nav></header>`;

export function footer(landing) {
  const cols = FOOTER_GROUPS.map(g => `<div><h2>${g.name}</h2><ul>${landing.filter(p => p.kind === g.kind).map(p => `<li><a href="/${p.slug}">${esc(p.nav)}</a></li>`).join('')}</ul></div>`).join('');
  return `<footer><div class="foot-top">${logo(false)}<p>Stay curious. Stay capable. Stay Spry.</p></div><nav class="foot-links" aria-label="Site">${cols}</nav><div class="foot-base"><a href="/privacy">Privacy</a><a href="mailto:${SITE.email}">Contact</a><span>© <span id="year">2026</span> We Keep You Spry</span></div></footer>`;
}

const offerCard = (o, { links }) => `<article><span class="num">${o.tag}</span><h3>${esc(o.name)}.</h3><div class="price">${esc(o.display)}</div><p class="offer-note">${esc(o.note)}</p><p>${esc(o.summary)}</p><ul class="ticks">${o.includes.map(i => `<li>${esc(i)}</li>`).join('')}</ul><a class="button${o.id === 'assessment' ? ' lime' : ' ghost'}" href="#inquire" data-offer="${esc(o.formValue)}">${esc(o.cta)} ↗</a>${links ? `<a class="more" href="${o.page}">What the ${esc(o.name.replace(/^\d+-day /, ''))} covers</a>` : ''}</article>`;

// The home page's section 05 (keeps id="private", which the nav and /private redirect use).
export const homeOffers = () => `<section class="section offers dark" id="private"><div class="offers-head"><p class="eyebrow">05 / THE OFFERS</p><h2>Three ways <em>to start.</em></h2><p class="lead">Every engagement begins with the Assessment. Its fee is credited to your install if you go ahead.</p></div><div class="offer-grid">${OFFERS.map(o => offerCard(o, { links: true })).join('')}</div><p class="note">Fixed prices in US dollars. Scope, feasibility, support and third-party software fees are agreed in writing before work begins. No sales, audience growth or revenue guarantees.</p></section>`;

// The compact block every landing page carries before its FAQ.
export const offersTable = () => `<section class="lp-offers" aria-labelledby="offers-h"><h2 id="offers-h">What does it cost?</h2><p>Three fixed prices, published here and on the <a href="/pricing">pricing page</a>.</p><div class="table-wrap"><table><thead><tr><th scope="col">Offer</th><th scope="col">Price</th><th scope="col">What you get</th></tr></thead><tbody>${OFFERS.map(o => `<tr><th scope="row"><a href="${o.page}">${esc(o.name)}</a></th><td data-label="Price">${esc(o.display)}</td><td data-label="What you get">${esc(o.note)} ${esc(o.summary)}</td></tr>`).join('')}</tbody></table></div></section>`;

// The one inquiry form. Every page that shows it renders this string, and
// scripts/check-pages.mjs fails the build when any page's form differs from the home page's.
export const FORM = `<form id="spry-inquiry" method="POST" action="/api/inquiry" data-clarity-mask="True"><p hidden><label>Leave blank <input name="bot-field"></label></p><label>Name<input name="name" autocomplete="name" required maxlength="120"></label><label>Work email<input name="email" type="email" autocomplete="email" required maxlength="254"></label><label>Company / role<input name="company" maxlength="160"></label><label>What would you like to build?<textarea name="goals" required maxlength="3000" rows="4"></textarea></label><label>Where would you like to start?<select name="budget" required><option value="">Select one</option>${OFFERS.map(o => `<option value="${esc(o.formValue)}">${esc(o.label)}</option>`).join('')}</select></label><label class="check"><input type="checkbox" name="consent" required> I agree to be contacted about my inquiry and have read the <a href="/privacy">privacy notice</a>.</label><button class="button" type="submit">Send private inquiry ↗</button><p class="note">Please do not include passwords, API keys or confidential records.</p><p id="inquiry-status" role="status" aria-live="polite"></p><noscript>JavaScript is required to submit this inquiry.</noscript></form>`;

export const inquiry = ({ eyebrow = '09 / PRIVATE INQUIRIES', heading = 'Your next chapter<br><em>starts here.</em>', intro = 'Tell us what you want to become capable of doing. We\'ll explore whether We Keep You Spry is the right fit, starting with the Assessment.' } = {}) =>
  `<section class="section inquiry" id="inquire"><div><p class="eyebrow">${eyebrow}</p><h2>${heading}</h2><p>${esc(intro)}</p></div>${FORM}</section>`;

const longDate = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// A comparison page's firm list: each company described only by facts from its own site, each
// fact linked to the page it came from (scripts/check-pages.mjs fails a fact sourced elsewhere).
const host = u => new URL(u).hostname.replace(/^www\./, '');
function firms(page) {
  const items = page.firms.map(f => `<li><h3>${esc(f.name)}${f.us ? ' <span class="us">(us, the authors of this page)</span>' : ''}</h3><p class="firm-meta">${esc(f.kind)} · <a href="${esc(f.url)}" rel="noopener">${esc(host(f.url))}</a> · read <time datetime="${f.checked}">${longDate(f.checked)}</time></p><ul>${f.facts.map(x => `<li>${text(x.text)} (<a href="${esc(x.source)}" rel="noopener">source</a>)</li>`).join('')}</ul></li>`).join('');
  return `<section class="firms"><h2>${esc(page.firmsHeading)}</h2><p>${text(page.firmsIntro)}</p><ul class="firm-list">${items}</ul></section>`;
}

function block(s, page) {
  if (s.firms) return firms(page);
  let out = `<h2>${esc(s.h2)}</h2>` + (s.p || []).map(p => `<p>${text(p)}</p>`).join('');
  if (s.list) out += `<${s.list.type || 'ul'}>${s.list.items.map(i => `<li>${text(i)}</li>`).join('')}</${s.list.type || 'ul'}>`;
  if (s.table) out += `<div class="table-wrap"><table><thead><tr>${s.table.head.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map(r => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${text(c)}</th>` : `<td data-label="${esc(s.table.head[i])}">${text(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  if (s.after) out += s.after.map(p => `<p>${text(p)}</p>`).join('');
  return `<section>${out}</section>`;
}

export function landing(page, all) {
  const related = (page.related || []).map(slug => all.find(p => p.slug === slug)).filter(Boolean);
  const offer = page.offer ? OFFERS.find(o => o.id === page.offer) : OFFERS[0];
  const body = `<main id="main"><section class="lp-hero dark"><div class="lp-hero-in"><p class="eyebrow">${esc(page.eyebrow)}</p><h1>${esc(page.h1)}</h1><p class="answer">${text(page.answer)}</p><a class="button lime" href="#inquire" data-offer="${esc(offer.formValue)}">${esc(offer.cta)} ↗</a><p class="micro">${OFFERS.map(o => `${esc(o.name)} ${esc(o.display)}`).join(' · ')}</p></div></section><article class="lp-body">${page.sections.map(s => block(s, page)).join('')}${page.slug === 'pricing' ? '' : offersTable()}<section id="faq"><h2>Frequently asked questions</h2>${page.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${text(f.a)}</p></details>`).join('')}</section>${related.length ? `<section class="related"><h2>Related pages</h2><ul>${related.map(r => `<li><a href="/${r.slug}">${esc(r.h1)}</a></li>`).join('')}</ul></section>` : ''}<p class="byline">By We Keep You Spry · Published <time datetime="${page.published}">${longDate(page.published)}</time> · Updated <time datetime="${page.updated}">${longDate(page.updated)}</time></p></article>${inquiry({ eyebrow: 'START HERE', heading: esc(page.formHeading || 'Start with the Assessment.'), intro: page.formIntro || 'Tell us what you would like to build. We\'ll reply by email about whether the Assessment is the right first step.' })}</main>`;
  return { body, faq: page.faq.map(f => ({ q: f.q, a: plain(f.a) })) };
}

// FAQ pairs read from a rendered page's visible <details>, so FAQPage always matches what people see.
export function visibleFaq(html) {
  const sec = html.match(/<section[^>]*id="faq"[^>]*>([\s\S]*?)<\/section>/);
  if (!sec) return [];
  return [...sec[1].matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)].map(m => ({ q: strip(m[1]), a: strip(m[2]) }));
}
const strip = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").trim();

const ORG = { '@type': 'Organization', '@id': SITE.url + '/#org', name: SITE.name, alternateName: SITE.short, url: SITE.url + '/', logo: SITE.logo, email: SITE.email, slogan: SITE.slogan };

export const service = () => ({
  '@type': 'Service', '@id': SITE.url + '/#service', name: 'AI implementation', serviceType: 'AI implementation consulting', provider: { '@id': ORG['@id'] }, areaServed: { '@type': 'Country', name: 'United States' },
  description: 'We Keep You Spry installs AI across a business in 30 days, trains the team and hands every system over to the owner.',
  offers: OFFERS.map(o => ({ '@type': 'Offer', name: o.name, url: abs(o.page), priceCurrency: 'USD', ...(o.from ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: o.price, priceCurrency: 'USD' } } : { price: o.price }), description: `${o.note} ${o.summary}` })),
});

export function jsonld({ path, title, description, faq, home, offers, article, published, updated, crumb, speakable }) {
  const url = abs(path);
  const graph = [ORG];
  if (home) graph.push({ '@type': 'WebSite', '@id': SITE.url + '/#website', url: SITE.url + '/', name: SITE.name, alternateName: SITE.short, publisher: { '@id': ORG['@id'] } });
  graph.push({ '@type': article ? 'Article' : 'WebPage', '@id': url + '#page', url, name: title, ...(article ? { headline: crumb, author: { '@id': ORG['@id'] }, publisher: { '@id': ORG['@id'] }, datePublished: published, dateModified: updated, mainEntityOfPage: url } : { isPartOf: { '@id': SITE.url + '/#website' }, dateModified: updated }), description, ...(speakable ? { speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.answer'] } } : {}) });
  if (!home && crumb) graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: SITE.name, item: SITE.url + '/' }, { '@type': 'ListItem', position: 2, name: crumb, item: url }] });
  if (offers) graph.push(service());
  if (faq && faq.length) graph.push({ '@type': 'FAQPage', '@id': url + '#faq', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  return { '@context': 'https://schema.org', '@graph': graph };
}
