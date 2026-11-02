// interest-rate-decisions: central bank rates and decisions from InterestRateDecision.com.
// No dependencies; works in Node 18+, Deno, Bun and browsers (anything with fetch).
// Data terms: free to reuse with a visible link to https://interestratedecision.com

export const BASE = 'https://interestratedecision.com';
export const BANKS = ['fed', 'ecb', 'boe', 'boj', 'boc', 'rba', 'rbnz', 'snb', 'norges', 'riksbank'];

async function get(path, opts = {}) {
  const f = opts.fetch ?? globalThis.fetch;
  if (!f) throw new Error('interest-rate-decisions: no fetch available; pass { fetch }');
  const res = await f(`${opts.base ?? BASE}${path}`, { headers: { accept: path.endsWith('.csv') ? 'text/csv' : 'application/json' } });
  if (!res.ok) throw new Error(`interest-rate-decisions: ${path} answered ${res.status}`);
  return path.endsWith('.csv') ? res.text() : res.json();
}

/** Every bank's rate today, its last change and its next decision. */
export async function getRates(opts) {
  return (await get('/data/rates.json', opts)).rates;
}

/** One bank's rate today. */
export async function getRate(bank, opts) {
  const r = (await getRates(opts)).find((x) => x.bank === bank);
  if (!r) throw new Error(`interest-rate-decisions: unknown bank "${bank}" (one of ${BANKS.join(', ')})`);
  return r;
}

/** The decisions to come, soonest first. `bank` keeps one bank's. */
export async function getUpcoming(bank, opts) {
  const ds = (await get('/data/next.json', opts)).decisions;
  return (bank ? ds.filter((d) => d.bank === bank) : ds).sort((a, b) => Date.parse(a.t) - Date.parse(b.t));
}

/** The next decision, of one bank or of any. */
export async function getNext(bank, opts) {
  return (await getUpcoming(bank, opts)).find((d) => Date.parse(d.t) > Date.now() - 3600e3) ?? null;
}

/** Parse the decisions CSV (no quoted commas in it but bank names, which have none). */
export function parseDecisions(csv) {
  const [head, ...lines] = csv.trim().split(/\r?\n/);
  const keys = head.split(',');
  return lines.map((line) => {
    const c = line.split(',');
    const row = Object.fromEntries(keys.map((k, i) => [k, c[i]]));
    return {
      bank: row.bank,
      bankName: row.bank_name,
      time: row.time_utc,
      date: row.date,
      rate: row.rate === '' ? null : Number(row.rate),
      changeBp: row.change_bp === '' ? null : Number(row.change_bp),
    };
  });
}

/** Every decision since 2008, oldest first. `bank` keeps one bank's. */
export async function getDecisions(bank, opts) {
  const all = parseDecisions(await get('/data/decisions.csv', opts));
  return bank ? all.filter((d) => d.bank === bank) : all;
}

/** The page about a bank or a decision on InterestRateDecision.com. */
export const pageOf = (bank) => `${BASE}/${bank}/`;
