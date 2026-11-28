// Pins the inquiry form's three budget values. functions/api/inquiry.js and the Apps Script
// (google-apps-script/Code.gs) accept only these exact strings; a label can change, a value never.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { OFFERS } from '../site/data.mjs';

const PINNED = ['$10K initial installation', '$30K / 90-day private engagement', 'Exploring options'];
const fromJs = JSON.parse((await readFile('functions/api/inquiry.js', 'utf8')).match(/const budgets = (\[[^\]]*\])/)[1].replace(/'/g, '"'));
const fromGs = JSON.parse((await readFile('google-apps-script/Code.gs', 'utf8')).match(/!(\['\$10K[^\]]*\])\.includes\(d\.budget\)/)[1].replace(/'/g, '"'));
const html = await readFile('public/index.html', 'utf8');
const select = html.match(/<select name="budget" required>([\s\S]*?)<\/select>/)[1];
const fromForm = [...select.matchAll(/<option value="([^"]*)">/g)].map(m => m[1].replace(/&amp;/g, '&')).filter(Boolean);

const sorted = a => [...a].sort();
assert.deepEqual(sorted(fromJs), sorted(PINNED), 'functions/api/inquiry.js budget whitelist changed');
assert.deepEqual(sorted(fromGs), sorted(PINNED), 'google-apps-script/Code.gs budget whitelist changed');
assert.deepEqual(sorted(OFFERS.map(o => o.formValue)), sorted(PINNED), 'site/data.mjs formValue no longer matches the whitelist');
assert.deepEqual(sorted(fromForm), sorted(PINNED), 'the built form sends a value the server refuses');
assert.match(select, /<option value="">Select one<\/option>/, 'the empty first option (required choice) is gone');
console.log('Form values pinned: the built form sends exactly the 3 values inquiry.js and Code.gs accept.');
