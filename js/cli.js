#!/usr/bin/env node
// npx interest-rate-decisions          the next decisions and every bank's rate
// npx interest-rate-decisions fed      one bank
// npx interest-rate-decisions --json   the same, as JSON
import { BANKS, getRates, getUpcoming } from './index.js';

const args = process.argv.slice(2);
const json = args.includes('--json');
const bank = args.find((a) => BANKS.includes(a));
const tty = process.stdout.isTTY && !json;
const c = (code, s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s);

const until = (t) => {
  const ms = Date.parse(t) - Date.now();
  if (ms <= 0) return 'now';
  const d = Math.floor(ms / 864e5), h = Math.floor((ms % 864e5) / 36e5), m = Math.floor((ms % 36e5) / 6e4);
  return d ? `${d}d ${h}h` : h ? `${h}h ${m}m` : `${m}m`;
};
const when = (t) => new Date(t).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

try {
  const [rates, next] = await Promise.all([getRates(), getUpcoming(bank)]);
  const shownRates = bank ? rates.filter((r) => r.bank === bank) : rates;
  if (json) {
    console.log(JSON.stringify({ rates: shownRates, next: next.slice(0, 10) }, null, 2));
  } else {
    console.log(c('1', '\nNext central bank decisions') + c('2', '  (your time)'));
    for (const d of next.filter((x) => Date.parse(x.t) > Date.now() - 3600e3).slice(0, bank ? 4 : 6)) {
      console.log(`  ${c('1', d.short.padEnd(12))} ${when(d.t).padEnd(24)}${d.tentative ? c('2', ' est.') : '     '} ${c('36', `in ${until(d.t)}`)}`);
    }
    console.log(c('1', '\nPolicy rates'));
    for (const r of shownRates) {
      const v = r.rangeLow != null ? `${r.rangeLow.toFixed(2)}–${r.rate.toFixed(2)}%` : `${r.rate.toFixed(2)}%`;
      console.log(`  ${c('1', r.bank.padEnd(12))} ${v.padEnd(13)} ${c('2', r.name)}`);
    }
    console.log(c('2', `\nOdds, history and what each decision did to the currency: ${bank ? `https://interestratedecision.com/${bank}/` : 'https://interestratedecision.com'}\n`));
  }
} catch (e) {
  console.error(String(e.message ?? e));
  process.exit(1);
}
