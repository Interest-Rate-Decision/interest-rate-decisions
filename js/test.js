import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getDecisions, getNext, getRate, parseDecisions } from './index.js';

const files = {
  '/data/rates.json': { rates: [{ bank: 'fed', name: 'Federal Reserve', rate: 4, rangeLow: 3.75 }, { bank: 'ecb', name: 'European Central Bank', rate: 2.5 }] },
  '/data/next.json': { decisions: [{ bank: 'ecb', t: '2999-02-01T12:00:00Z' }, { bank: 'fed', t: '2999-01-01T19:00:00Z' }, { bank: 'boe', t: '2000-01-01T12:00:00Z' }] },
  '/data/decisions.csv': 'bank,bank_name,time_utc,date,rate,change_bp\necb,European Central Bank,2008-01-10T12:45:00.000Z,2008-01-10,,\nfed,Federal Reserve,2008-01-22T13:20:00.000Z,2008-01-22,3.5,-75\n',
};
const fetch = async (url) => {
  const body = files[new URL(url).pathname];
  return { ok: !!body, status: body ? 200 : 404, json: async () => body, text: async () => body };
};

test('finds a bank and its range', async () => {
  const r = await getRate('fed', { fetch });
  assert.equal(r.rate, 4);
  assert.equal(r.rangeLow, 3.75);
  await assert.rejects(getRate('xyz', { fetch }), /unknown bank/);
});

test('the next decision is the soonest still to come', async () => {
  assert.equal((await getNext(undefined, { fetch })).bank, 'fed');
  assert.equal((await getNext('ecb', { fetch })).bank, 'ecb');
  assert.equal(await getNext('boe', { fetch }), null);
});

test('reads the CSV, blanks as null', async () => {
  const all = parseDecisions(files['/data/decisions.csv']);
  assert.deepEqual(all[0], { bank: 'ecb', bankName: 'European Central Bank', time: '2008-01-10T12:45:00.000Z', date: '2008-01-10', rate: null, changeBp: null });
  assert.equal((await getDecisions('fed', { fetch }))[0].changeBp, -75);
});
