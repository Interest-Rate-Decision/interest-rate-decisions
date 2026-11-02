# interest-rate-decisions

Central bank interest rates and decisions for JavaScript and Python, from [InterestRateDecision.com](https://interestratedecision.com/): today's policy rates, the next meetings and every decision since 2008, for the Fed, ECB, Bank of England, Bank of Japan, Bank of Canada, RBA, RBNZ, SNB, Norges Bank and the Riksbank.

```sh
npx interest-rate-decisions        # the next decisions and every rate, in your terminal
```

## JavaScript ([`js/`](js/))

```sh
npm install interest-rate-decisions
```

```js
import { getRate, getNext, getDecisions } from 'interest-rate-decisions';

await getRate('fed');         // { rate: 4, rangeLow: 3.75, lastChange, nextDecision, ... }
await getNext();              // the next decision of any bank
await getDecisions('ecb');    // every ECB decision since 2008
```

No dependencies. Node 18+, Deno, Bun and browsers.

## Python ([`python/`](python/))

```sh
pip install interest-rate-decisions
```

```python
import interest_rate_decisions as ird

ird.get_rate("boe")
ird.get_next()
ird.decisions_frame("fed").rate.plot(drawstyle="steps-post")   # with pandas
```

Standard library only; pandas optional.

## The data

The same files as CSV and JSON: [central-bank-interest-rates](https://github.com/Interest-Rate-Decision/central-bank-interest-rates). Free to use in anything, including commercial work, with a visible link to [InterestRateDecision.com](https://interestratedecision.com/) ([terms](https://interestratedecision.com/central-bank-data/#licence)). Code: MIT.
