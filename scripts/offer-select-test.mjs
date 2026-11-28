// An offer button (data-offer) picks that offer in the inquiry form, using only the select's
// existing values; a value the form does not have is ignored.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const src = await readFile('assets/site.js', 'utf8');
const options = ['', '$10K initial installation', '$30K / 90-day private engagement', 'Exploring options'].map(value => ({ value }));
const select = { value: '', options };
const links = ['Exploring options', '$10K initial installation', 'not-a-real-value'].map(offer => {
  const handlers = [];
  return { dataset: { offer }, addEventListener: (type, fn) => type === 'click' && handlers.push(fn), click() { handlers.forEach(h => h()); } };
});
const document = {
  querySelector: sel => (sel === '#spry-inquiry select[name="budget"]' ? select : null),
  querySelectorAll: sel => (sel === 'a[data-offer]' ? links : []),
};
vm.runInNewContext(src, { document, crypto: { randomUUID: () => '00000000-0000-0000-0000-000000000000' }, location: {}, fetch() {} });
links[0].click(); assert.equal(select.value, 'Exploring options', 'Assessment button should pick the Assessment');
links[1].click(); assert.equal(select.value, '$10K initial installation', 'install button should pick the install');
links[2].click(); assert.equal(select.value, '$10K initial installation', 'an unknown value must leave the choice alone');
console.log('Offer buttons pick the matching form option (and ignore unknown values).');
