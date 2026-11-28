// Every landing page, in footer order. A page is live once it is listed here.
import niche from './niche.mjs';
import offer from './offer.mjs';
import question from './question.mjs';

export const LANDING = [...niche, ...offer, ...question];

const seen = new Set();
for (const p of LANDING) {
  if (seen.has(p.slug)) throw Error(`duplicate landing slug ${p.slug}`);
  seen.add(p.slug);
}
