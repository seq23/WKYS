// Reads a deployed copy of the site (a branch preview or production) and fails unless it behaves:
// every sitemap URL answers 200 with no redirect, the signed-in apps and the portal answer as
// before with their strict CSP, the inquiry API refuses bad requests, and the search files are served.
// It never sends a valid inquiry, so it never writes a row to the inquiry sheet.
// usage: node scripts/check-live.mjs <base url> [--compare <base url>]
const [base, flag, compareBase] = process.argv.slice(2).map(s => s && s.replace(/\/$/, ''));
if (!/^(https:\/\/|http:\/\/localhost:)/.test(base || '')) { console.error('usage: node scripts/check-live.mjs https://<host> [--compare https://<host>]'); process.exit(2); }
const fail = [];
const check = (ok, msg) => { if (!ok) fail.push(msg); };
const get = (url, init = {}) => fetch(url, { redirect: 'manual', ...init, signal: AbortSignal.timeout(20000) });

// A new branch preview can answer 404 for its first seconds after `pages deploy` returns (seen on
// #2 and #3, 28 Nov 2026). Wait, up to 120 s, until the copy is serving — its sitemap answers 200
// and the inquiry function answers GET with 405 — before judging it. Never longer: a copy that is
// still not serving after that is judged as it is, so a broken deploy still fails.
const serving = async () => {
  try { return (await get(base + '/sitemap.xml')).status === 200 && (await get(base + '/api/inquiry')).status === 405; } catch { return false; }
};
for (let waited = 0; waited < 120 && !(await serving()); waited += 5) await new Promise(r => setTimeout(r, 5000));

const sitemap = await (await get(base + '/sitemap.xml')).text();
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
check(locs.length >= 32, `sitemap lists ${locs.length} URLs; expected at least 32`);
for (const loc of locs) {
  const url = base + new URL(loc).pathname;
  const res = await get(url);
  check(res.status === 200, `${url} answered ${res.status}, not 200`);
}

const csp = async path => (await get(base + path)).headers.get('content-security-policy') || '';
const homeCsp = await csp('/');
check(homeCsp.includes('https://www.clarity.ms') && homeCsp.includes('https://static.cloudflareinsights.com'), '/ CSP does not allow Clarity and Cloudflare Web Analytics');
for (const path of ['/founder', '/client', '/portal']) {
  const res = await get(base + path);
  check(res.status === 200, `${path} answered ${res.status}`);
  const c = res.headers.get('content-security-policy') || '';
  check(c && !c.includes('clarity') && c.includes("script-src 'self';"), `${path} CSP is not the strict policy: ${c}`);
}
check(/noindex/.test((await get(base + '/portal')).headers.get('x-robots-tag') || ''), '/portal has no X-Robots-Tag noindex');
const priv = await get(base + '/private');
check(priv.status === 302 && /\/#private$/.test(priv.headers.get('location') || ''), `/private answered ${priv.status} to ${priv.headers.get('location')}`);
for (const path of ['/robots.txt', '/llms.txt', '/BingSiteAuth.xml', '/assets/og.png', '/assets/clarity.js']) check((await get(base + path)).status === 200, `${path} not served`);

// The API, without writing anything: method, origin and empty-body refusals.
const api = base + '/api/inquiry';
const statuses = {
  get: (await get(api)).status,
  badOrigin: (await get(api, { method: 'POST', headers: { Origin: 'https://example.com', 'Content-Type': 'application/json' }, body: '{}' })).status,
  emptyBody: (await get(api, { method: 'POST', headers: { Origin: base, 'Content-Type': 'application/json' }, body: '{}' })).status,
  portal: (await get(base + '/api/portal/session')).status,
};
check(statuses.get === 405, `GET /api/inquiry answered ${statuses.get}, not 405`);
check(statuses.badOrigin === 403, `POST /api/inquiry from another origin answered ${statuses.badOrigin}, not 403`);
check(statuses.emptyBody === 400, `empty POST /api/inquiry answered ${statuses.emptyBody}, not 400`);
check(statuses.portal < 500 || statuses.portal === 503, `/api/portal/session answered ${statuses.portal}`);
if (flag === '--compare' && compareBase) {
  for (const path of ['/founder', '/client', '/portal', '/api/portal/session']) {
    const [a, b] = [(await get(base + path)).status, (await get(compareBase + path)).status];
    check(a === b, `${path}: ${a} here, ${b} on ${compareBase}`);
  }
}

if (fail.length) { console.error(`check-live ${base}: ${fail.length} problem(s)\n- ` + fail.join('\n- ')); process.exit(1); }
console.log(`check-live ${base}: ${locs.length} sitemap URLs 200, apps and portal strict, API refusals ${JSON.stringify(statuses)}: pass`);
