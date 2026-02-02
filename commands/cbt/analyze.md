---
name: cbt:analyze
description: Deep analysis of backtest results - patterns in wins/losses
argument-hint: "[exp_id]"
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
---

<objective>
Perform deep analysis of a backtest run to identify patterns in winning and losing trades,
regime performance, and actionable improvement suggestions.
</objective>

<execution_context>
@strategies/{active}/experiments/{exp_id}.yaml
@strategies/{active}/trades/trades_{exp_id}.csv
@strategies/{active}/.cbt/state.yaml
</execution_context>

<process>

## 1. Determine Experiment to Analyze

If exp_id provided, use it.
Otherwise, use current experiment from state.yaml.

## 2. Load Data

Read:
- Experiment YAML (parameters, results)
- Trade log CSV

## 3. Trade Classification

Classify each trade:

```python
for trade in trades:
    trade['outcome'] = 'win' if trade['pnl'] > 0 else 'loss'
    trade['size_category'] = 'small' | 'medium' | 'large'  # by position size
    trade['duration_category'] = 'scalp' | 'intraday' | 'swing'  # by hold time
    trade['exit_type'] = trade['exit_reason']  # tp, sl, signal, trailing
```

## 4. Winner Analysis

### Patterns in Winners
- Average entry time (hour of day, day of week)
- Average hold duration
- Common entry conditions (if logged)
- Position size distribution
- Exit type distribution (TP vs signal)

### Best Trades
- Top 5 trades by PnL
- What conditions were present?

## 5. Loser Analysis

### Patterns in Losers
- Average entry time
- Average hold duration
- Common entry conditions
- Position size distribution
- Exit type distribution (SL vs signal)

### Worst Trades
- Bottom 5 trades by PnL
- What went wrong?
- Were there warning signs?

### Clustered Losses
- Identify periods of consecutive losses
- What market conditions were present?

## 6. Regime Analysis

If market regime data available:

| Regime | Trades | Win Rate | Avg PnL | Notes |
|--------|--------|----------|---------|-------|
| Trending Up | 45 | 62% | +1.2% | Strong |
| Trending Down | 38 | 58% | +0.9% | Good |
| Ranging | 52 | 48% | -0.1% | Weak |
| High Vol | 31 | 41% | -0.5% | Avoid |

## 7. Time Analysis

### By Hour
- Which hours are most profitable?
- Which hours to avoid?

### By Day of Week
- Any day-of-week effects?

### By Month (if sufficient data)
- Seasonal patterns?

## 8. Risk Analysis

- Actual vs configured stop loss hits
- Slippage impact
- Largest drawdown period
- Time to recover from drawdowns

## 9. Generate Suggestions

Based on analysis, generate 2-4 specific, actionable suggestions:

Example suggestions:
- "Consider adding a volatility filter - win rate drops to 41% in high vol"
- "Losers cluster on Mondays - consider avoiding Monday entries"
- "Large positions underperform - cap at 2% per trade"
- "Most SL hits occur in first hour - consider delayed entries"

## 10. Output Analysis

```
╔═══════════════════════════════════════════════════════════════════════╗
║  Analysis: exp_003                                                    ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  Overview                                                             ║
║  ────────────────────────────────────────────────────────────────     ║
║  Total Trades: 143    Winners: 81 (56.6%)    Losers: 62 (43.4%)      ║
║  Profit Factor: 1.82  Avg Win: +1.23%        Avg Loss: -0.89%        ║
║                                                                       ║
║  Winner Patterns                                                      ║
║  ────────────────────────────────────────────────────────────────     ║
║  • Best hour: 14:00-15:00 UTC (68% win rate)                         ║
║  • Avg hold time: 3h 45m                                              ║
║  • Exit: 72% hit TP, 28% signal exit                                  ║
║  • Top winner: +5.67% on 2025-08-14 (trend breakout)                 ║
║                                                                       ║
║  Loser Patterns                                                       ║
║  ────────────────────────────────────────────────────────────────     ║
║  • Worst hour: 08:00-09:00 UTC (38% win rate)                        ║
║  • Avg hold time: 1h 12m (shorter - stopped out)                     ║
║  • Exit: 85% hit SL, 15% signal exit                                  ║
║  • Cluster: 5 consecutive losses on 2025-09-22 (high vol day)        ║
║                                                                       ║
║  Regime Performance                                                   ║
║  ────────────────────────────────────────────────────────────────     ║
║  │ Regime      │ Win Rate │ Avg PnL │ Assessment │                   ║
║  │ Trending    │   62%    │  +1.2%  │ ★ Strong   │                   ║
║  │ Ranging     │   48%    │  -0.1%  │ ⚠ Weak     │                   ║
║  │ High Vol    │   41%    │  -0.5%  │ ✗ Avoid    │                   ║
║                                                                       ║
║  Drawdown Analysis                                                    ║
║  ────────────────────────────────────────────────────────────────     ║
║  Max DD: -15.2% (2025-09-18 to 2025-09-25)                           ║
║  Recovery: 12 days                                                    ║
║  DD > 10%: 2 occurrences                                              ║
║                                                                       ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Suggestions                                                          ║
║  ────────────────────────────────────────────────────────────────     ║
║                                                                       ║
║  1. Add volatility filter                                             ║
║     Win rate drops from 57% to 41% in high volatility.               ║
║     Consider pausing entries when ATR > 2x average.                   ║
║                                                                       ║
║  2. Avoid early session entries                                       ║
║     08:00-09:00 UTC has 38% win rate vs 57% overall.                 ║
║     Consider delaying entries until 10:00 UTC.                        ║
║                                                                       ║
║  3. Tighten stops in ranging markets                                  ║
║     Ranging regime has -0.1% avg PnL. Current 1% SL may be           ║
║     too wide. Test 0.7% SL when range-bound.                         ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝

Save observations? [Y/n]
```

## 11. Prompt for Observations

Ask user if they want to save any observations:
- "What observation or hypothesis do you have based on this analysis?"
- Save to observations/ with timestamp

</process>

<success_criteria>
- [ ] Trade data loaded and classified
- [ ] Winner patterns identified
- [ ] Loser patterns identified
- [ ] Regime analysis completed (if data available)
- [ ] Specific suggestions generated
- [ ] User prompted for observations
</success_criteria>
