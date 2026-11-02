# interest-rate-decisions

Central bank interest rates and decisions, from [InterestRateDecision.com](https://interestratedecision.com/): today's policy rates, the next meetings and every decision since 2008, for the Fed, ECB, Bank of England, Bank of Japan, Bank of Canada, RBA, RBNZ, SNB, Norges Bank and the Riksbank.

Standard library only. pandas is optional.

```sh
pip install interest-rate-decisions
interest-rate-decisions          # the next decisions and every rate
interest-rate-decisions fed      # one bank
```

```python
import interest_rate_decisions as ird

ird.get_rate("fed")          # {'bank': 'fed', 'rate': 4.0, 'rangeLow': 3.75, 'nextDecision': ...}
ird.get_next()               # the next decision of any bank
ird.get_upcoming("ecb")      # the ECB's meetings to come
ird.get_decisions("boe")     # every Bank of England decision since 2008

df = ird.decisions_frame("fed")              # pip install "interest-rate-decisions[pandas]"
df.rate.plot(drawstyle="steps-post")
```

Banks: `fed`, `ecb`, `boe`, `boj`, `boc`, `rba`, `rbnz`, `snb`, `norges`, `riksbank`. Rates are per cent; the Fed's `rate` is the top of its target range. Times are UTC. The ECB's `rate` is None before March 2015, where the source gives only its refinancing rate's change.

The data updates within minutes of each decision. For the odds of the next move, charts and what each decision did to the currency, see [interestratedecision.com](https://interestratedecision.com/).

## Data terms

The code is MIT. The data is free to use in anything, including commercial work, **with a visible link to [InterestRateDecision.com](https://interestratedecision.com/)** ([terms](https://interestratedecision.com/central-bank-data/#licence)).
