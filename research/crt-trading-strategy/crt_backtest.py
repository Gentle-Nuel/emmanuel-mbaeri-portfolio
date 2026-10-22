"""CRT (Candle Range Theory) backtest on MT4 server-time data (server = New York + 7h).

Setup (bearish shown; bullish mirrored):
  C1 = range candle. C2 trades above C1.high and closes back inside C1 (below C1.high, above C1.low).
  Entry at C2 close (+ spread cost). Stop at C2 high. Target = C1.low (full) or C1 midpoint (half).
Trades are resolved on lower-timeframe bars; a bar touching both stop and target counts as a loss.
"""
import sys
import numpy as np
import pandas as pd

DATA = sys.argv[1]
MULT = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
SYMS = {"EURUSD": 10, "GBPUSD": 15, "USDJPY": 10, "XAUUSD": 35, "AUDUSD": 12, "USDCAD": 15}  # spread in price units


def load(sym, tf):
    d = pd.read_csv(f"{DATA}/{sym}/{sym}{tf}.csv", parse_dates=["Date"]).set_index("Date")
    return d[["open", "high", "low", "close"]]


def resample(h1, rule):
    return h1.resample(rule, origin="start_day").agg(
        {"open": "first", "high": "max", "low": "min", "close": "last"}).dropna()


def resolve(lt_hi, lt_lo, lt_close, start, end, direction, entry, stop, target):
    """Walk lower-TF bars [start, end). Returns R multiple."""
    risk = abs(entry - stop)
    for k in range(start, end):
        h, l = lt_hi[k], lt_lo[k]
        if direction < 0:
            hit_s, hit_t = h >= stop, l <= target
        else:
            hit_s, hit_t = l <= stop, h >= target
        if hit_s:
            return -1.0
        if hit_t:
            return abs(target - entry) / risk
    if end <= start:
        return 0.0
    return direction * (lt_close[end - 1] - entry) / risk  # time exit


def run(sym, htf_rule, lt_tf, hold_candles):
    spread = SYMS[sym]
    h1 = load(sym, "h1")
    lt = h1 if lt_tf == "h1" else load(sym, lt_tf)
    htf = resample(h1, htf_rule)
    daily = resample(h1, "1D")
    sma20 = daily.close.rolling(20).mean()
    weekly = h1.resample("W-FRI").agg({"high": "max", "low": "min"})

    lt_idx = lt.index.values
    lt_hi, lt_lo, lt_cl = lt.high.values, lt.low.values, lt.close.values
    htf_len = pd.Timedelta(htf_rule)
    rows = []
    o, h, l, c = (htf[x].values for x in ("open", "high", "low", "close"))
    times = htf.index
    for i in range(1, len(htf) - 1):
        c1h, c1l = h[i - 1], l[i - 1]
        rng = c1h - c1l
        if rng <= 0:
            continue
        for direction in (-1, 1):
            if direction < 0:
                swept = h[i] > c1h and c1l < c[i] < c1h
                stop, ext = h[i], h[i]
                full_t, half_t = c1l, c1h - rng / 2
            else:
                swept = l[i] < c1l and c1l < c[i] < c1h
                stop, ext = l[i], l[i]
                full_t, half_t = c1h, c1l + rng / 2
            if not swept:
                continue
            entry = c[i] + direction * spread * MULT  # pay spread (and slippage) on entry
            risk = abs(entry - stop)
            if risk <= spread:
                continue
            t_close = times[i] + htf_len  # C2 close time
            start = np.searchsorted(lt_idx, t_close.to_datetime64())
            end = np.searchsorted(lt_idx, (t_close + hold_candles * htf_len).to_datetime64())
            prev_days = daily.loc[:times[i].normalize() - pd.Timedelta("1s")]
            if len(prev_days) < 21:
                continue
            pd_row = prev_days.iloc[-1]
            trend = 1 if pd_row.close > sma20.loc[prev_days.index[-1]] else -1
            pw = weekly.loc[:times[i] - pd.Timedelta("7D")]
            pwh, pwl = (pw.high.iloc[-1], pw.low.iloc[-1]) if len(pw) else (np.nan, np.nan)
            body_inside = (c1l < o[i] < c1h)  # wick-only sweep (TBS-style)
            rows.append(dict(
                sym=sym, time=times[i], dir=direction, ny_hour=(times[i] - pd.Timedelta("7h")).hour,
                year=times[i].year, with_trend=(trend == direction),
                pdl_pdh_swept=(h[i] > pd_row.high) if direction < 0 else (l[i] < pd_row.low),
                pw_swept=(h[i] > pwh) if direction < 0 else (l[i] < pwl),
                body_inside=body_inside,
                sweep_depth=(ext - c1h) / rng if direction < 0 else (c1l - ext) / rng,
                close_pos=(c1h - c[i]) / rng if direction < 0 else (c[i] - c1l) / rng,  # how deep C2 closed into C1
                rr_full=abs(full_t - entry) / risk, rr_half=abs(half_t - entry) / risk,
                R_full=resolve(lt_hi, lt_lo, lt_cl, start, end, direction, entry, stop, full_t),
                R_half=resolve(lt_hi, lt_lo, lt_cl, start, end, direction, entry, stop, half_t)
                if (half_t - entry) * direction > 0 else np.nan,
            ))
    return pd.DataFrame(rows)


if __name__ == "__main__":
    out = []
    for htf_rule, lt_tf, hold in (("4h", "h1", 3), ("1D", "h1", 3), ("1h", "m15", 3)):
        for sym in SYMS:
            df = run(sym, htf_rule, lt_tf, hold)
            df["htf"] = htf_rule
            out.append(df)
            print(htf_rule, sym, len(df), flush=True)
    pd.concat(out).to_pickle(sys.argv[2])
