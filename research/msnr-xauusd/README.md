# MSNR XAUUSD Backtest (Pepperstone, 17 May – 17 Nov 2026)

Status: **the engine is built and tested. It is waiting for the 5-minute XAUUSD data for the test period.**

## How to get the data (about 2 minutes, free)

Exact Pepperstone prices can only be exported from a Pepperstone terminal. A demo account works.

**MT5:** View → Symbols (Ctrl+U) → **Bars** tab → choose `XAUUSD`, timeframe **M5**, from **2026-02-01** to **2026-11-18** → Request → **Export Bars** → save the CSV.
(Start in February: the 90 days before 17 May are needed so that the 4H levels already exist when the test window opens.)

**MT4:** Tools → History Center → XAUUSD → 5 Minutes → Download/Export. MT4 often holds only a few months of M5 data, so MT5 is better.

Then add the CSV to this folder (or Google Drive) and run:

```bash
python3 msnr_backtest.py XAUUSD_M5.csv --start 2026-05-17 --end 2026-11-17 --cost 0.25 --risk-pct 1
```

The script prints daily, weekly and monthly results, and writes every setup to `msnr_trades.csv`.

## Rules as coded

MSNR is discretionary. These are the exact mechanical definitions used, so that every trade can be checked against your own reading of the chart. Change any of them if your definition differs.

| Item | Coded definition |
|---|---|
| Time zone | Everything in **WAT (UTC+1)**. The 4H candles are built from M5 so that they **close at 08:00 and 12:00 WAT**. Note: Pepperstone's own 4H candles don't close at those times (they close at 07:00/11:00 WAT in winter and 06:00/10:00 WAT in summer). Your charts must be using a UTC-aligned 4H. |
| Classic A | A bullish 4H close followed by a bearish open, where that body top is the highest body point within ±2 candles. **Resistance at that close.** Bodies only, no wicks (line-chart logic). |
| Classic V | The mirror of A. **Support.** |
| QM | A1 → a lower V → a higher A2, then a 4H close below V. **Resistance at A1** (left shoulder). The mirror for support. |
| RBS / SBR | An A (or V) level that a 4H body has closed through. It flips role at the same price. |
| OCL | *My interpretation:* the open of a 4H candle whose body engulfs the previous two bodies (the origin of an impulse). Tell me your exact definition and I'll change it. |
| Fresh | No 4H **wick** has touched the level since it formed (since the break, for RBS/SBR). Each level can trigger once. |
| Rejection | The 4H candle closing at 08:00 or 12:00 WAT wicks into the fresh level and **closes back on its side**. |
| Confirmation | Within 8h of the rejection close: a 5M close beyond the most recent 5M swing (2-left/2-right fractal) in the trade direction. **BOS** if it continues the prior 5M swing sequence, **CHoCH** if it reverses it. Both are accepted. |
| Entry | Order block = the last opposite-colour candle between the post-rejection extreme and the break. **15M first, 5M if there is no 15M OB.** Limit at the OB's near edge. |
| Stop / Target | SL $0.10 beyond the OB's far edge. **TP = 5 × risk.** |
| Order expiry | Cancelled if not filled within 24h, or if price reaches TP before filling. |
| Fill / exit | Resolved on 5M. If SL and TP fall inside the same 5M bar, it counts as SL (conservative). |
| Costs | $0.25/oz round trip by default (Razor spread + commission). This is charged on every trade. |
| Multiple trades | Allowed. Each fresh level is independent; two levels at the same price produce one order. |

## Engine check (not the requested results)

To verify the code end to end, I ran it on older gold data (May–Nov 2021) from a different broker. That data has no 5M history, so it used **15M bars in place of 5M**. It produced 31 setups, 24 fills, 6 wins and 18 losses, +12R. **Treat this as a code check only.** It isn't Pepperstone data, it isn't 2026, it isn't the 5M confirmation, and 24 trades is far too few to judge an edge.
