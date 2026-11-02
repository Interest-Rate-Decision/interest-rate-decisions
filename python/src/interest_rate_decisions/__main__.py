"""python -m interest_rate_decisions [bank] [--json]: the next decisions and every rate."""

import json
import sys
import time
from datetime import datetime

from . import BANKS, get_rates, get_upcoming, _ts


def _until(t: str) -> str:
    s = _ts(t) - time.time()
    if s <= 0:
        return "now"
    d, h, m = int(s // 86400), int(s % 86400 // 3600), int(s % 3600 // 60)
    return f"{d}d {h}h" if d else f"{h}h {m}m" if h else f"{m}m"


def main() -> None:
    args = sys.argv[1:]
    bank = next((a for a in args if a in BANKS), None)
    rates = [r for r in get_rates() if bank is None or r["bank"] == bank]
    upcoming = [d for d in get_upcoming(bank) if _ts(d["t"]) > time.time() - 3600]
    if "--json" in args:
        print(json.dumps({"rates": rates, "next": upcoming[:10]}, indent=2))
        return
    print("\nNext central bank decisions  (your time)")
    for d in upcoming[: 4 if bank else 6]:
        local = datetime.fromtimestamp(_ts(d["t"])).strftime("%a %d %b, %H:%M")
        print(f"  {d['short']:<12} {local:<20}{' est.' if d['tentative'] else '     '} in {_until(d['t'])}")
    print("\nPolicy rates")
    for r in rates:
        v = f"{r['rangeLow']:.2f}-{r['rate']:.2f}%" if r.get("rangeLow") is not None else f"{r['rate']:.2f}%"
        print(f"  {r['bank']:<12} {v:<13} {r['name']}")
    print(f"\nOdds, history and what each decision did to the currency: https://interestratedecision.com{'/' + bank + '/' if bank else ''}\n")


if __name__ == "__main__":
    main()
