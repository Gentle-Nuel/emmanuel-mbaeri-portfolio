# CRT (Candle Range Theory): Research and Independent Backtest

*Research date: 22 Oct 2026. This is not financial advice.*

## TL;DR

1. **CRT has no edge as a mechanical rule set.** I tested **~180,000 setups** across 6 markets (EURUSD, GBPUSD, USDJPY, AUDUSD, USDCAD, XAUUSD) from Nov 2012 to Mar 2022, on 1H, 4H and Daily candles. **Before any costs**, average expectancy was about **0.00R** (profit factor 0.97–1.00). That is what random entries with the same stop and target would give.
2. **None of the popular "high probability" filters added edge.** I tested higher-timeframe trend alignment, sweeps of a key level (previous day or week high/low), wick-only (TBS-style) sweeps, the 1/5/9 AM NY 4H candles, sweep depth, how deep C2 closes, and lower-timeframe confirmation (M15 structure shift, limit entry on a retest). They all **changed the win rate without changing expectancy**.
3. **This explains the "70–85% win rate" claims you see online.** A variant can show a high win rate because its target is small relative to its stop. For example, when C2 closes deep inside C1, the win rate is **85%** but the median reward is only **0.13R**, so expectancy is still about 0. A win rate means nothing without the R:R next to it.
4. **Costs decide everything.** Paying a normal retail spread once turns CRT from break-even to clearly losing on every timeframe: −0.05R per trade on Daily, −0.11R on 4H, −0.19R on 1H. **The lower the timeframe, the worse it gets**, because the stop (at C2's wick) is small compared with the spread.
5. If CRT makes money for anyone, the profit comes from things outside the candle pattern: discretionary context, news and session timing, and trade management. Those things have to be proven with your own journaled sample. They can't be assumed.

---

## 1. What CRT actually is (beyond the generic explanation)

**Origin.** CRT was popularised on Twitter/X by a trader known as **"Romeo"** around 2023–24. Others then extended it into courses and indicators. It is a re-packaging of older ideas:
- ICT's **Turtle Soup** (a false breakout of a prior high/low) and **Power of Three / AMD** (accumulation → manipulation → distribution).
- Linda Raschke's original 1990s Turtle Soup, which faded failed 20-day breakouts.
- Classic "outside-bar failure" / "spring and upthrust" logic from Wyckoff.

**Core rule set** (bearish version; bullish is mirrored):

| Element | Rule |
|---|---|
| C1 – range candle | Any higher-timeframe candle. Its high and low define the range. |
| C2 – manipulation | Trades **above C1 high** (takes buy-side liquidity) and then **closes back inside C1**. "No close back inside = no setup." |
| C3 – distribution | Expected to run toward **C1 low** (the opposite liquidity). |
| Stop | Beyond C2's high (the sweep extreme). |
| Targets | Usually C1 midpoint (50%) as TP1 and the opposite C1 extreme as TP2. |
| Validity | A CRT range is "fresh" until price reaches its opposite extreme (then it is "mitigated"). |

**Less-publicised variants you'll meet in paid courses and indicators:**
- **Timed 4H candles.** Day traders use the 4H candles that open at **1 AM, 5 AM and 9 AM New York time**. These line up with Asia, London and NY sessions. CME futures charts show them as 2/6/10 AM. A common "model" uses the 1 AM candle as C1 and looks for the purge in London.
- **Key Level (KL) requirement.** C2's sweep should also take a higher-timeframe swing high or low, the previous day high/low, or the previous week high/low, or tag an HTF FVG or order block.
- **TBS (Turtle Body Soup).** The sweep must be made by the **wick only**: C2's body stays inside C1.
- **CISD / MSS entry.** You don't enter at C2 close. You drop to M5–M15 during C3 and wait for a *change in state of delivery* (a close through the last opposing candle series) or a market structure shift. The aim is a tighter stop and a bigger R:R.
- **Fractal stacking.** Monthly → Weekly → Daily → 4H → 1H. A higher-timeframe CRT gives the bias, and a lower-timeframe CRT inside C3 is the entry.

**Claimed performance.** Educational and vendor sites quote **55–75% win rates** with 1:2 to 1:10 R:R. One "tiered" estimate (tradingwyckoff.com) gives 45–50% raw, 50–58% with HTF trend, and 60–65% with full confluence. **None of these publish a sample size, cost model or trade list.** I found no audited CRT track record anywhere.

---

## 2. Independent backtest

### Data and method
- **Data:** MT4 broker bid OHLC, H1 and M15, from [ejtraderLabs/historical-data](https://github.com/ejtraderLabs/historical-data). Server time = New York + 7h, so 4H candles align to **NY 1/5/9/13/17/21h** (the "1-5-9" candles are included) and daily candles close at 5 PM NY.
- **Symbols:** EURUSD, GBPUSD, USDJPY, AUDUSD, USDCAD, XAUUSD.
- **Setup:** C2 sweeps C1's high (or low) and closes back inside C1. Entry at C2 close. Stop at C2 extreme.
- **Targets:** "full" = opposite C1 extreme; "half" = C1 midpoint.
- **Resolution:** Trades are resolved on lower-TF bars (4H/D1 on H1, 1H on M15). If a bar touches both stop and target, it counts as a loss (conservative). Time exit after 3 HTF candles.
- **Costs:** 0× (gross), 1× and 2× a typical retail spread (EURUSD 1.0 pip, GBPUSD 1.5, USDJPY 1.0, AUDUSD 1.2, USDCAD 1.5, Gold $0.35).
- **Metric:** expectancy in **R** (multiples of risk). A positive t-stat above ~2 would suggest a real edge.

### Headline results (full target)

| Timeframe | Setups | Gross avg R | Gross PF | 1× cost avg R | 2× cost avg R |
|---|---:|---:|---:|---:|---:|
| Daily | 6,026 | −0.015 | 0.97 | −0.055 | −0.088 |
| 4H | 34,558 | −0.011 | 0.98 | −0.114 | (worse) |
| 1H | 136,931 | −0.005 | 0.99 | −0.186 | −0.282 |

Every symbol on every timeframe falls within roughly ±0.05R gross. Taking TP at the C1 midpoint instead raises the win rate to 55–60%, but expectancy is still ≤ 0.

Results were the same in both halves of the sample (2012–17 vs 2018–22), so this is not regime-specific.

### Filters: they change the win rate, not the expectancy (4H, gross)

| Filter | Win % | Avg R |
|---|---:|---:|
| With daily trend (close vs 20-SMA) | 46.8 | −0.010 |
| Against daily trend | 47.0 | −0.013 |
| C2 also swept previous-day high/low | 46.5 | −0.019 |
| C2 also swept previous-week high/low | 47.0 | −0.006 |
| Wick-only sweep (TBS) | 46.7 | −0.010 |
| 4H C2 opening 1 AM NY | **55.7** | −0.009 |
| 4H C2 opening 5 AM NY | 49.2 | −0.004 |
| 4H C2 opening 9 AM NY | 49.6 | −0.021 |
| 4H C2 opening 1 PM NY | 28.0 | −0.074 |
| C2 closes in the deepest quarter of C1 | **85.2** | −0.019 (median R:R 0.12) |
| C2 closes in the shallowest quarter of C1 | 31.4 | −0.001 (median R:R 2.56) |

The time-of-day and close-position rows show what's going on. Win rate moves with **where the target sits relative to the stop**. Expectancy doesn't move.

### Refined entries (resolved on M15)

| Model | TF | Trades | Win % | Gross avg R | 1× cost avg R |
|---|---|---:|---:|---:|---:|
| Limit at C1 extreme (retest), stop C2 wick | 4H | 21,362 | 23.7 | +0.060 (t=1.4) | −0.242 |
| M15 structure shift during C3 | 4H | 17,882 | 59.4 | −0.025 | −0.091 |
| Limit retest | Daily | 3,079 | 22.7 | −0.076 | −0.164 |
| M15 structure shift | Daily | 4,445 | 49.5 | −0.027 | −0.061 |

Tighter LTF entries make the R:R look better on paper (median 1:4+ on the retest). They also bring the stop close enough that the spread eats the edge.

### The only faint leads (not proven)
- **Gold daily CRT:** +0.06R gross (t≈1.6) and about break-even after costs. Interesting, not significant.
- **1H candle at 5 PM NY (rollover):** +0.11R gross. This is almost certainly a data artifact. Broker spreads widen 5–20× at rollover and the bid-only data can't show it. **Do not trade this.**

### A cautionary tale from this study
My first run had a one-character bug: the spread was *credited* to each trade instead of charged. With that bug, CRT showed **+0.25R per trade, PF 1.56, t = 57**: a "holy grail". The true gross edge is so close to zero that **a single spread decides whether a backtest looks spectacular or terrible**. Many shared CRT "backtests" (manual chart replay, no spread, best-case fills, hindsight about which key level "counted") have exactly this problem.

### Limitations
- One broker's bid data. No news filter. No commissions, swaps or slippage beyond the spread multiplier.
- Discretionary elements were approximated by rules: "is this a real key level?", "is the narrative right?", "is this CISD clean?". A skilled discretionary trader *could* filter better than these rules. That claim needs a forward-tested, journaled sample to be believed.
- No indices or crypto (NQ/ES and BTC are popular CRT markets). The scripts can be pointed at any OHLC CSV.

---

## 3. If you still want to trade CRT profitably: what the evidence supports

1. **Treat CRT as a location tool, not a signal.** "Price swept a range and closed back inside" tells you where to look and where your invalidation is. It does not tell you the trade will work.
2. **Trade higher timeframes, or instruments with tiny costs relative to range.** Costs fall roughly in proportion to stop size: −0.19R (1H) → −0.11R (4H) → −0.05R (Daily). Index futures (ES/NQ) and gold on Daily/4H have the best cost-to-range ratio.
3. **Judge every rule by expectancy, never by win rate.** Expectancy = Win% × avg win − Loss% × avg loss. A 40% win rate at 2.5R beats an 80% win rate at 0.2R.
4. **Build your own evidence before risking money.** Write your exact discretionary checklist (which key levels, which sessions, what counts as CISD). Then:
   - log ≥ 200 forward or replay trades with screenshots,
   - charge real spread + commission,
   - compare against this mechanical baseline. Your discretion is only adding value if your expectancy beats ~0R gross by a margin of at least +0.15R after costs.
5. **Most of the money is in risk and management.** Fixed 0.25–1% risk per trade, a daily loss limit, partials at the C1 midpoint, and skipping high-impact news. These keep a break-even strategy from blowing up while you look for a real edge. They can't turn a zero edge into a positive one.
6. **Be very sceptical of sellers.** No CRT educator I found publishes a verifiable broker statement or an out-of-sample trade list.

---

## Reproduce

```bash
git clone --depth 1 https://github.com/ejtraderLabs/historical-data.git data
python3 crt_backtest.py data trades0.pkl 0     # gross;  use 1 or 2 for cost multipliers
python3 analyze.py trades0.pkl
python3 crt_entries.py data ent1.pkl 1         # refined entries (limit retest / M15 MSS)
```

Requires `pandas` and `numpy`. Each run takes about 1.5–3 minutes.

## Sources
- [innercircletrader.net – Candle Range Theory tutorial](https://innercircletrader.net/tutorials/candle-range-theory-crt/)
- [tradingwyckoff.com – CRT Explained (tiered win-rate estimates)](https://tradingwyckoff.com/en/crt/)
- [crttrading.com – CRT strategy guide](https://www.crttrading.com/)
- [writofinance.com – CRT + TBS strategy](https://www.writofinance.com/crt-tbs-strategy-guide/)
- [Writofinance – Candle Range Theory explained](https://www.writofinance.com/candle-range-theory-crt/)
- [TradingView – CRT Turtle Soup with HTF candles, CISD and MSS (1/5/9 AM alignment)](https://www.tradingview.com/script/csXbNHhx-CRT-Turtle-Soup-with-HTF-Candles-CISD-and-MSS/)
- [grandalgo.com – CRT explained](https://grandalgo.com/blog/candle-range-theory-crt-explained)
- [Rattibha thread – "CRT: Candle Ranges Theory" (origin)](https://en.rattibha.com/thread/1784493604473618604)
- [traderfactor.com – CRT beginner's guide](https://traderfactor.com/what-is-the-candle-range-theory-strategy/)
- [CRTLAB backtester](https://crtlab.pro/crt-strategy-backtester)
- Data: [ejtraderLabs/historical-data](https://github.com/ejtraderLabs/historical-data)
