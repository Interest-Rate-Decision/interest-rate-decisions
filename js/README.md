# interest-rate-decisions

Central bank interest rates and decisions, from [InterestRateDecision.com](https://interestratedecision.com/): today's policy rates, the next meetings and every decision since 2008, for the Fed, ECB, Bank of England, Bank of Japan, Bank of Canada, RBA, RBNZ, SNB, Norges Bank and the Riksbank.

No dependencies. Node 18+, Deno, Bun and browsers.

```sh
npx interest-rate-decisions        # the next decisions and every rate, in your terminal
npx interest-rate-decisions fed    # one bank
```

```sh
npm install interest-rate-decisions
```

```js
import { getRates, getRate, getNext, getUpcoming, getDecisions } from 'interest-rate-decisions';

await getRate('fed');        // { bank: 'fed', rate: 4, rangeLow: 3.75, lastChange, nextDecision, ... }
await getNext();             // the next decision of any bank: { bank, t, tentative, rateBefore, page, ... }
await getUpcoming('ecb');    // the ECB's meetings to come
await getDecisions('boe');   // every Bank of England decision since 2008: { time, rate, changeBp }
```

Banks: `fed`, `ecb`, `boe`, `boj`, `boc`, `rba`, `rbnz`, `snb`, `norges`, `riksbank`. Rates are per cent; the Fed's `rate` is the top of its target range, `rangeLow` the bottom. Times are UTC.

The data updates within minutes of each decision. For the odds of the next move, charts and what each decision did to the currency, see [interestratedecision.com](https://interestratedecision.com/).

## Data terms

The code is MIT. The data is free to use in anything, including commercial work, **with a visible link to [InterestRateDecision.com](https://interestratedecision.com/)** ([terms](https://interestratedecision.com/central-bank-data/#licence)).
