"""Refined CRT entries on 4H / 1D setups, resolved on M15.

A  limit: after C2 closes, rest a limit at C1 extreme (retest of swept level) valid during C3.
B  MSS: during C3, enter on the first M15 close beyond the prior 4 M15 bars' extreme (shift in structure).
Both: stop at C2 extreme, target opposite C1 extreme, exit at market at end of hold window.
"""
import sys
import numpy as np
import pandas as pd

DATA, OUT, MULT = sys.argv[1], sys.argv[2], float(sys.argv[3])
SYMS = {"EURUSD": 10, "GBPUSD": 15, "USDJPY": 10, "XAUUSD": 35, "AUDUSD": 12, "USDCAD": 15}


def load(sym, tf):
    return pd.read_csv(f"{DATA}/{sym}/{sym}{tf}.csv", parse_dates=["Date"]).set_index("Date")


def walk(hi, lo, cl, k0, k1, d, entry, stop, target):
    risk = abs(entry - stop)
    for k in range(k0, k1):
        if (hi[k] >= stop) if d < 0 else (lo[k] <= stop):
            return -1.0
        if (lo[k] <= target) if d < 0 else (hi[k] >= target):
            return abs(target - entry) / risk
    return d * (cl[k1 - 1] - entry) / risk if k1 > k0 else 0.0


rows = []
for htf_rule in ("4h", "1D"):
    L = pd.Timedelta(htf_rule)
    for sym, spread in SYMS.items():
        cost = spread * MULT
        h1 = load(sym, "h1")
        m = load(sym, "m15")
        idx, hi, lo, cl = m.index.values, m.high.values, m.low.values, m.close.values
        htf = h1.resample(htf_rule, origin="start_day").agg(
            {"open": "first", "high": "max", "low": "min", "close": "last"}).dropna()
        H, Lo, C, T = htf.high.values, htf.low.values, htf.close.values, htf.index
        for i in range(1, len(htf) - 1):
            for d in (-1, 1):
                c1h, c1l = H[i - 1], Lo[i - 1]
                if d < 0 and not (H[i] > c1h and c1l < C[i] < c1h):
                    continue
                if d > 0 and not (Lo[i] < c1l and c1l < C[i] < c1h):
                    continue
                stop = H[i] if d < 0 else Lo[i]
                target = c1l if d < 0 else c1h
                lvl = c1h if d < 0 else c1l
                t0 = T[i] + L
                k0 = np.searchsorted(idx, t0.to_datetime64())
                k3 = np.searchsorted(idx, (t0 + L).to_datetime64())          # end of C3
                k_end = np.searchsorted(idx, (t0 + 3 * L).to_datetime64())   # hold window
                # A: limit at swept level during C3 (price must trade back up to it)
                for k in range(k0, k3):
                    if (hi[k] >= lvl) if d < 0 else (lo[k] <= lvl):
                        entry = lvl + d * cost
                        if abs(entry - stop) > cost and (stop - entry) * d < 0:
                            # same bar may also hit the stop -> conservative loss
                            if (hi[k] >= stop) if d < 0 else (lo[k] <= stop):
                                r = -1.0
                            else:
                                r = walk(hi, lo, cl, k + 1, k_end, d, entry, stop, target)
                            rows.append(dict(htf=htf_rule, sym=sym, model="A_limit_retest", R=r,
                                             rr=abs(target - entry) / abs(entry - stop)))
                        break
                # B: M15 structure shift during C3
                for k in range(max(k0, 4), k3):
                    if (hi[k] >= stop) if d < 0 else (lo[k] <= stop):
                        break  # invalidated before trigger
                    prev = lo[k - 4:k].min() if d < 0 else hi[k - 4:k].max()
                    if (cl[k] < prev) if d < 0 else (cl[k] > prev):
                        entry = cl[k] + d * cost
                        if abs(entry - stop) > cost and (target - entry) * d > 0:
                            r = walk(hi, lo, cl, k + 1, k_end, d, entry, stop, target)
                            rows.append(dict(htf=htf_rule, sym=sym, model="B_m15_MSS", R=r,
                                             rr=abs(target - entry) / abs(entry - stop)))
                        break
        print(htf_rule, sym, flush=True)
pd.DataFrame(rows).to_pickle(OUT)
