"""Politely download Dukascopy XAUUSD 1-minute BID candles (one file per UTC day) and write an M5 CSV.

Usage: python3 fetch_dukascopy.py OUT_DIR 2026-02-01 2026-11-18
One request every 3 s; on HTTP 429/5xx waits 60 s, then 120 s, ... (max 5 tries per file). Files already
downloaded are skipped, so the script can be re-run after an interruption.
"""
import lzma
import os
import struct
import sys
import time
import urllib.error
import urllib.request

import pandas as pd

OUT, START, END = sys.argv[1], sys.argv[2], sys.argv[3]
URL = "https://datafeed.dukascopy.com/datafeed/XAUUSD/{y}/{m:02d}/{d:02d}/BID_candles_min_1.bi5"
os.makedirs(f"{OUT}/raw", exist_ok=True)


def fetch(day):
    path = f"{OUT}/raw/{day:%Y%m%d}.bi5"
    if os.path.exists(path):
        return path
    url = URL.format(y=day.year, m=day.month - 1, d=day.day)  # Dukascopy months are 0-based
    for attempt in range(5):
        time.sleep(3)
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "msnr-backtest-research/1.0 (python urllib)"})
            with urllib.request.urlopen(req, timeout=30) as r:
                data = r.read()
            open(path, "wb").write(data)
            return path
        except urllib.error.HTTPError as e:
            if e.code == 404:
                open(path, "wb").write(b"")
                return path
            if e.code in (429, 500, 502, 503):
                wait = 60 * (attempt + 1)
                print(f"{day:%Y-%m-%d}: HTTP {e.code}, waiting {wait}s", flush=True)
                time.sleep(wait)
                continue
            raise
        except (urllib.error.URLError, ConnectionError, TimeoutError) as e:
            wait = 60 * (attempt + 1)
            print(f"{day:%Y-%m-%d}: {e}, waiting {wait}s", flush=True)
            time.sleep(wait)
    raise SystemExit(f"giving up on {day:%Y-%m-%d} after 5 tries")


rows = []
for day in pd.date_range(START, END, freq="D"):
    path = fetch(day)
    blob = open(path, "rb").read()
    if not blob:
        continue
    raw = lzma.decompress(blob)
    for i in range(0, len(raw), 24):
        sec, o, c, lo, hi, vol = struct.unpack(">5if", raw[i:i + 24])
        rows.append((day + pd.Timedelta(seconds=sec), o, hi, lo, c, vol))
    print(f"{day:%Y-%m-%d} ok", flush=True)

m1 = pd.DataFrame(rows, columns=["time", "open", "high", "low", "close", "volume"]).set_index("time")
m1 = m1[m1.volume > 0]  # Dukascopy pads closed-market minutes with zero-volume flat bars
m1[["open", "high", "low", "close"]] /= 1000.0  # XAUUSD point = 0.001
m5 = m1.resample("5min").agg({"open": "first", "high": "max", "low": "min", "close": "last"}).dropna()
m5.index.name = "time"
m5.to_csv(f"{OUT}/XAUUSD_M5_dukascopy_utc.csv")
print("bars", len(m5), m5.index[0], m5.index[-1], "last close", m5.close.iloc[-1])
