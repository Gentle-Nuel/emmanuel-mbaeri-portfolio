"""MSNR (Malaysian SNR) backtest for XAUUSD: 4H fresh levels -> 4H rejection -> 5M BOS/CHoCH -> OB limit entry.

Usage:
    python3 msnr_backtest.py M5.csv --start 2026-05-17 --end 2026-11-17 [--server-tz ny+7|utc] [--cost 0.25]

Input: 5-minute OHLC. Accepts an MT4/MT5 "Export bars" file (<DATE> <TIME> <OPEN> ...; tab or comma)
or any CSV with time,open,high,low,close. Pepperstone MT4/MT5 server time is New York + 7h (`ny+7`, default).
Everything is converted to WAT (UTC+1, no DST).

Rules as coded (see README for the reasoning behind each interpretation):
  Levels (4H, body/line-chart based, no wicks):
    A    : bullish close followed by bearish open, highest body point within +/-2 candles -> resistance at that close
    V    : mirror -> support
    QM   : A1, lower V, higher A2, then a 4H close below V -> resistance at A1 (mirror for support)
    RBS  : A level broken by a 4H close above it -> support at the same price (SBR mirror)
    OCL  : open of a 4H candle whose body engulfs the previous two bodies (impulse origin)
  Fresh : no 4H wick has touched the level since it formed (since the break, for RBS/SBR).
  Rejection : the 4H candle closing 08:00 or 12:00 WAT wicks into a fresh level and closes back on its side.
  Confirmation: within 8h of the rejection close, a 5M close beyond the latest 5M swing (fractal 2/2).
                BOS if that swing is in trend with the trade, CHoCH otherwise; both accepted.
  Entry : last opposite 15M candle between the post-rejection extreme and the break (preferred), else 5M.
          Limit at the OB's near edge, SL beyond the far edge (+ buffer), TP at 1:5.
          Unfilled orders are cancelled after 24h, or if price reaches TP or SL first.
"""
import argparse
import numpy as np
import pandas as pd

WAT = "Africa/Lagos"


def load_m5(path, server_tz):
    raw = pd.read_csv(path, sep=None, engine="python")
    raw.columns = [c.strip("<>").lower() for c in raw.columns]
    if "date" in raw.columns and "time" in raw.columns:
        t = pd.to_datetime(raw["date"].astype(str) + " " + raw["time"].astype(str))
    else:
        t = pd.to_datetime(raw[raw.columns[0]])
    if server_tz == "ny+7":
        t = (t - pd.Timedelta("7h")).dt.tz_localize("America/New_York", ambiguous="NaT", nonexistent="NaT")
    else:
        t = t.dt.tz_localize(server_tz)
    df = raw[["open", "high", "low", "close"]].astype(float)
    df.index = t.dt.tz_convert(WAT)
    return df[df.index.notna()].sort_index()


def resample(df, rule):
    out = df.resample(rule, label="left", closed="left", origin="start_day").agg(
        {"open": "first", "high": "max", "low": "min", "close": "last"}).dropna()
    return out


def find_levels(h4, k=2):
    """Return list of dicts: time the level becomes known, price, side (+1 support, -1 resistance), kind."""
    o, c = h4.open.values, h4.close.values
    top, bot = np.maximum(o, c), np.minimum(o, c)
    t = h4.index
    lv = []
    for i in range(k, len(h4) - k - 1):
        known = t[i + k + 1]  # needs k candles to the right to confirm
        if c[i] > o[i] and c[i + 1] < o[i + 1] and top[i] >= top[i - k:i + k + 1].max():
            lv.append(dict(t=known, i=i + k, price=c[i], side=-1, kind="A"))
        if c[i] < o[i] and c[i + 1] > o[i + 1] and bot[i] <= bot[i - k:i + k + 1].min():
            lv.append(dict(t=known, i=i + k, price=c[i], side=1, kind="V"))
        if i >= 2 and top[i] - bot[i] > 0:
            if bot[i] <= bot[i - 2:i].min() and top[i] >= top[i - 2:i].max():
                side = 1 if c[i] > o[i] else -1
                lv.append(dict(t=t[i + 1], i=i, price=o[i], side=side, kind="OCL"))
    # QM and RBS/SBR derived from A/V swings
    swings = sorted([x for x in lv if x["kind"] in ("A", "V")], key=lambda x: x["i"])
    extra = []
    for a in (x for x in swings if x["kind"] in ("A", "V")):
        # role reversal: first 4H close through the level after it is known
        j0 = a["i"] + 1
        through = np.where(c[j0:] > a["price"])[0] if a["side"] < 0 else np.where(c[j0:] < a["price"])[0]
        if len(through):
            j = j0 + through[0]
            if j + 1 < len(h4):
                extra.append(dict(t=t[j + 1], i=j, price=a["price"], side=-a["side"],
                                  kind="RBS" if a["side"] < 0 else "SBR"))
    for n in range(len(swings) - 3):
        s1, s2, s3 = swings[n], swings[n + 1], swings[n + 2]
        if s1["kind"] == "A" and s2["kind"] == "V" and s3["kind"] == "A" and s3["price"] > s1["price"]:
            brk = np.where(c[s3["i"] + 1:] < s2["price"])[0]
            if len(brk) and s3["i"] + 1 + brk[0] + 1 < len(h4):
                j = s3["i"] + 1 + brk[0]
                extra.append(dict(t=t[j + 1], i=j, price=s1["price"], side=-1, kind="QM"))
        if s1["kind"] == "V" and s2["kind"] == "A" and s3["kind"] == "V" and s3["price"] < s1["price"]:
            brk = np.where(c[s3["i"] + 1:] > s2["price"])[0]
            if len(brk) and s3["i"] + 1 + brk[0] + 1 < len(h4):
                j = s3["i"] + 1 + brk[0]
                extra.append(dict(t=t[j + 1], i=j, price=s1["price"], side=1, kind="QM"))
    return lv + extra


def swings_5m(m5):
    h, l = m5.high.values, m5.low.values
    sh = np.zeros(len(m5), bool)
    sl = np.zeros(len(m5), bool)
    for i in range(2, len(m5) - 2):
        sh[i] = h[i] > max(h[i - 2], h[i - 1], h[i + 1], h[i + 2])
        sl[i] = l[i] < min(l[i - 2], l[i - 1], l[i + 1], l[i + 2])
    return sh, sl


def run(m5, start, end, cost, rr=5.0, buffer=0.10):
    h4 = resample(m5, "4h")
    m15 = resample(m5, "15min")
    levels = find_levels(h4)
    for lv in levels:
        lv["pos"] = h4.index.searchsorted(lv["t"])
    h4_hi, h4_lo = h4.high.values, h4.low.values
    sh, sl = swings_5m(m5)
    t5 = m5.index
    H, L, C, O = m5.high.values, m5.low.values, m5.close.values, m5.open.values
    trades = []
    used = set()
    taken = set()
    for r in range(len(h4)):
        bar = h4.iloc[r]
        close_t = h4.index[r] + pd.Timedelta("4h")
        if close_t.hour not in (8, 12) or not (start <= close_t < end):
            continue
        for li, lv in enumerate(levels):
            if li in used or lv["pos"] > r:
                continue
            p, side = lv["price"], lv["side"]
            # freshness: no wick touch between level known time and this candle
            if (side < 0 and (h4_hi[lv["pos"]:r] >= p).any()) or (side > 0 and (h4_lo[lv["pos"]:r] <= p).any()):
                used.add(li)
                continue
            rejected = (bar.high >= p and bar.close < p) if side < 0 else (bar.low <= p and bar.close > p)
            if not rejected:
                continue
            used.add(li)
            d = side  # trade direction: +1 buy at support, -1 sell at resistance
            k0 = t5.searchsorted(close_t)
            k1 = t5.searchsorted(close_t + pd.Timedelta("8h"))
            # 5M confirmation: close beyond the latest confirmed swing in the opposite direction
            brk = None
            for k in range(k0, min(k1, len(t5))):
                # swing must be confirmed (2 bars to the right) before bar k
                piv = np.where((sl if d < 0 else sh)[max(0, k0 - 48):k - 2])[0]
                if not len(piv):
                    continue
                pk = max(0, k0 - 48) + piv[-1]
                lvl = L[pk] if d < 0 else H[pk]
                if (C[k] < lvl) if d < 0 else (C[k] > lvl):
                    brk = (k, pk)
                    break
            if brk is None:
                continue
            k, pk = brk
            # trend context for BOS vs CHoCH: compare the two prior opposite swings
            prev = np.where((sh if d < 0 else sl)[max(0, k0 - 96):k - 2])[0]
            kind = "CHoCH"
            if len(prev) >= 2:
                a, b = max(0, k0 - 96) + prev[-2], max(0, k0 - 96) + prev[-1]
                kind = "BOS" if ((H[b] < H[a]) if d < 0 else (L[b] > L[a])) else "CHoCH"
            # leg extreme between rejection close and break
            seg = slice(k0, k + 1)
            ext_k = k0 + (np.argmax(H[seg]) if d < 0 else np.argmin(L[seg]))
            ob, tf = None, None
            win15 = m15[(m15.index >= t5[ext_k].floor("15min") - pd.Timedelta("15min")) & (m15.index < t5[k])]
            opp15 = win15[(win15.close > win15.open)] if d < 0 else win15[(win15.close < win15.open)]
            if len(opp15):
                cnd = opp15.iloc[-1]
                ob, tf = (cnd.low, cnd.high), "15M"
            else:
                for j in range(k, ext_k - 1, -1):
                    if (C[j] > O[j]) if d < 0 else (C[j] < O[j]):
                        ob, tf = (L[j], H[j]), "5M"
                        break
            if ob is None:
                continue
            lo, hi = ob
            entry = lo if d < 0 else hi
            if (r, d, entry) in taken:  # two levels at one price -> one order, not two
                continue
            taken.add((r, d, entry))
            stop = hi + buffer if d < 0 else lo - buffer
            risk = abs(stop - entry) + cost
            target = entry + d * rr * abs(stop - entry)
            # wait for limit fill
            f_end = t5.searchsorted(t5[k] + pd.Timedelta("24h"))
            fill = None
            for j in range(k + 1, min(f_end, len(t5))):
                if (L[j] <= target) if d < 0 else (H[j] >= target):
                    break  # ran to target without us
                if (H[j] >= entry) if d < 0 else (L[j] <= entry):
                    fill = j
                    break
            res, exit_t = None, None
            if fill is not None:
                for j in range(fill, len(t5)):
                    hit_s = (H[j] >= stop) if d < 0 else (L[j] <= stop)
                    hit_t = (L[j] <= target) if d < 0 else (H[j] >= target)
                    if hit_s:  # stop first if both in the same 5M bar (conservative)
                        res, exit_t = -1.0, t5[j]
                        break
                    if hit_t and j > fill:
                        res, exit_t = (rr * abs(stop - entry) - cost) / risk, t5[j]
                        break
            trades.append(dict(level_kind=lv["kind"], level=round(p, 2), dir="BUY" if d > 0 else "SELL",
                               rejection_close=close_t, confirm=kind, confirm_time=t5[k], ob_tf=tf,
                               entry=round(entry, 2), sl=round(stop, 2), tp=round(target, 2),
                               filled=fill is not None, fill_time=t5[fill] if fill is not None else pd.NaT,
                               exit_time=exit_t, R=res))
    return pd.DataFrame(trades)


def report(tr, risk_pct):
    done = tr[tr.R.notna()].copy()
    print(f"Setups (rejections with 5M confirmation + OB): {len(tr)}")
    print(f"Filled: {int(tr.filled.sum())} | closed: {len(done)} | still open at end: {int(tr.filled.sum()) - len(done)}")
    if done.empty:
        return
    w = (done.R > 0).sum()
    print(f"Wins {w}  Losses {len(done) - w}  Win rate {w / len(done):.1%}  Net {done.R.sum():+.2f}R  "
          f"(at {risk_pct}% risk = {done.R.sum() * risk_pct:+.1f}%)  Expectancy {done.R.mean():+.3f}R")
    eq = done.sort_values("exit_time").R.cumsum()
    print(f"Max drawdown {(eq.cummax() - eq).max():.1f}R  Longest losing streak "
          f"{max((len(s) for s in ''.join('L' if r < 0 else 'W' for r in done.sort_values('exit_time').R).split('W')), default=0)}")
    done["day"] = done.exit_time.dt.tz_localize(None).dt.to_period("D")
    done["week"] = done.exit_time.dt.tz_localize(None).dt.to_period("W-SUN")
    done["month"] = done.exit_time.dt.tz_localize(None).dt.to_period("M")
    for p in ("month", "week", "day"):
        g = done.groupby(p).R
        t = pd.DataFrame(dict(trades=g.size(), wins=g.apply(lambda r: (r > 0).sum()), R=g.sum().round(2)))
        t["pct"] = (t.R * risk_pct).round(1)
        print(f"\n--- {p}ly ---")
        print(t.to_string())


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("csv")
    ap.add_argument("--start", default="2026-05-17")
    ap.add_argument("--end", default="2026-11-17")
    ap.add_argument("--server-tz", default="ny+7")
    ap.add_argument("--cost", type=float, default=0.25, help="round-trip spread+commission in $ per oz")
    ap.add_argument("--risk-pct", type=float, default=1.0)
    ap.add_argument("--out", default="msnr_trades.csv")
    a = ap.parse_args()
    m5 = load_m5(a.csv, a.server_tz)
    s = pd.Timestamp(a.start, tz=WAT)
    e = pd.Timestamp(a.end, tz=WAT) + pd.Timedelta("1D")  # end date is inclusive
    tr = run(m5[(m5.index >= s - pd.Timedelta("90D")) & (m5.index < e + pd.Timedelta("10D"))], s, e, a.cost)
    tr.to_csv(a.out, index=False)
    report(tr, a.risk_pct)
