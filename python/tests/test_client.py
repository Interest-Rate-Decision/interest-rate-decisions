import json
import unittest

import interest_rate_decisions as ird

FILES = {
    "/data/rates.json": json.dumps({"rates": [{"bank": "fed", "name": "Federal Reserve", "rate": 4, "rangeLow": 3.75}]}),
    "/data/next.json": json.dumps({"decisions": [{"bank": "ecb", "t": "2999-02-01T12:00:00Z"}, {"bank": "fed", "t": "2999-01-01T19:00:00Z"}, {"bank": "boe", "t": "2000-01-01T12:00:00Z"}]}),
    "/data/decisions.csv": "bank,bank_name,time_utc,date,rate,change_bp\necb,European Central Bank,2008-01-10T12:45:00.000Z,2008-01-10,,\nfed,Federal Reserve,2008-01-22T13:20:00.000Z,2008-01-22,3.5,-75\n",
}


def fetch(url: str) -> str:
    return FILES[url.replace(ird.BASE, "")]


class Client(unittest.TestCase):
    def test_rate(self):
        self.assertEqual(ird.get_rate("fed", fetch)["rangeLow"], 3.75)
        with self.assertRaises(ValueError):
            ird.get_rate("xyz", fetch)

    def test_next(self):
        self.assertEqual(ird.get_next(fetch=fetch)["bank"], "fed")
        self.assertIsNone(ird.get_next("boe", fetch))

    def test_decisions(self):
        rows = ird.get_decisions(fetch=fetch)
        self.assertIsNone(rows[0]["rate"])
        self.assertEqual(rows[1]["change_bp"], -75)
        self.assertEqual(rows[1]["time_utc"].year, 2008)


if __name__ == "__main__":
    unittest.main()
