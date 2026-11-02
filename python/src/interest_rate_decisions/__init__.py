"""Central bank interest rates and decisions from InterestRateDecision.com.

Today's policy rates, the next meetings and every decision since 2008 for the
Fed, ECB, Bank of England, Bank of Japan, Bank of Canada, RBA, RBNZ, SNB,
Norges Bank and the Riksbank. Standard library only; pandas is optional.

Data terms: free to reuse with a visible link to https://interestratedecision.com
"""

from __future__ import annotations

import csv
import io
import json
import time
import urllib.request
from datetime import datetime, timezone
from typing import Any, Callable, Optional

__version__ = "1.0.0"
__all__ = ["BASE", "BANKS", "get_rates", "get_rate", "get_upcoming", "get_next", "get_decisions", "parse_decisions", "decisions_frame"]

BASE = "https://interestratedecision.com"
BANKS = ("fed", "ecb", "boe", "boj", "boc", "rba", "rbnz", "snb", "norges", "riksbank")

Fetch = Callable[[str], str]


def _fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": f"interest-rate-decisions-python/{__version__}"})
    with urllib.request.urlopen(req, timeout=20) as res:
        return res.read().decode("utf-8")


def _get(path: str, fetch: Optional[Fetch] = None, base: str = BASE) -> str:
    return (fetch or _fetch)(f"{base}{path}")


def _ts(iso: str) -> float:
    return datetime.fromisoformat(iso.replace("Z", "+00:00")).timestamp()


def get_rates(fetch: Optional[Fetch] = None) -> list[dict[str, Any]]:
    """Every bank's rate today (per cent; the Fed's is the top of its range, ``rangeLow`` the bottom), its last change and next decision."""
    return json.loads(_get("/data/rates.json", fetch))["rates"]


def get_rate(bank: str, fetch: Optional[Fetch] = None) -> dict[str, Any]:
    """One bank's rate today."""
    for r in get_rates(fetch):
        if r["bank"] == bank:
            return r
    raise ValueError(f'unknown bank "{bank}" (one of {", ".join(BANKS)})')


def get_upcoming(bank: Optional[str] = None, fetch: Optional[Fetch] = None) -> list[dict[str, Any]]:
    """The decisions to come, soonest first; times (``t``) are ISO UTC."""
    ds = json.loads(_get("/data/next.json", fetch))["decisions"]
    ds = [d for d in ds if bank is None or d["bank"] == bank]
    return sorted(ds, key=lambda d: _ts(d["t"]))


def get_next(bank: Optional[str] = None, fetch: Optional[Fetch] = None) -> Optional[dict[str, Any]]:
    """The next decision, of one bank or of any; None when none is listed."""
    now = time.time()
    return next((d for d in get_upcoming(bank, fetch) if _ts(d["t"]) > now - 3600), None)


def parse_decisions(text: str) -> list[dict[str, Any]]:
    """Rows of the decisions CSV, with ``rate`` and ``change_bp`` as numbers (None where blank)."""
    out = []
    for row in csv.DictReader(io.StringIO(text)):
        out.append({
            "bank": row["bank"],
            "bank_name": row["bank_name"],
            "time_utc": datetime.fromisoformat(row["time_utc"].replace("Z", "+00:00")).astimezone(timezone.utc),
            "date": row["date"],
            "rate": float(row["rate"]) if row["rate"] != "" else None,
            "change_bp": int(row["change_bp"]) if row["change_bp"] != "" else None,
        })
    return out


def get_decisions(bank: Optional[str] = None, fetch: Optional[Fetch] = None) -> list[dict[str, Any]]:
    """Every decision since 2008, oldest first. The ECB's ``rate`` is None before March 2015."""
    rows = parse_decisions(_get("/data/decisions.csv", fetch))
    return [r for r in rows if bank is None or r["bank"] == bank]


def decisions_frame(bank: Optional[str] = None, fetch: Optional[Fetch] = None):
    """The decisions as a pandas DataFrame indexed by time (needs pandas)."""
    import pandas as pd  # optional

    return pd.DataFrame(get_decisions(bank, fetch)).set_index("time_utc")
