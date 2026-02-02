---
name: cbt:compare
description: Compare all experiments or specific runs
argument-hint: "[exp_id1 exp_id2 ...]"
allowed-tools:
  - Read
  - Bash
  - Glob
---

<objective>
Compare multiple backtest experiments side by side, showing metrics, changes made,
and progression of strategy development.
</objective>

<execution_context>
@strategies/{active}/experiments/
@strategies/{active}/.cbt/state.yaml
</execution_context>

<process>

## 1. Determine Experiments to Compare

If specific IDs provided:
- Compare only those experiments

If no arguments:
- Compare all experiments (baseline + exp_*)

## 2. Load All Experiments

For each experiment YAML:
- Load metadata (id, timestamp, parent, change)
- Load results (all metrics)
- Load parameters snapshot

## 3. Generate Comparison Table

```
╔════════════════════════════════════════════════════════════════════════════════════╗
║  Experiment Comparison: {strategy_name}                                            ║
╠════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                    ║
║  Metric           baseline    exp_001     exp_002     exp_003     exp_004  ★best  ║
║  ───────────────────────────────────────────────────────────────────────────────   ║
║  Total Return     +23.4%      +28.1%      +25.3%      +34.5%      +31.2%          ║
║  Sharpe Ratio     1.45        1.52        1.38        1.67        1.89    ★       ║
║  Sortino Ratio    1.87        1.98        1.72        2.14        2.45    ★       ║
║  Max Drawdown     -12.3%      -14.1%      -18.2%      -15.2%      -11.8%  ★       ║
║  Win Rate         54.2%       55.8%       52.1%       56.3%       61.2%   ★       ║
║  Profit Factor    1.54        1.63        1.41        1.82        2.14    ★       ║
║  Total Trades     127         142         156         143         98              ║
║  Avg Duration     3h 15m      2h 58m      3h 42m      4h 23m      5h 12m          ║
║                                                                                    ║
╠════════════════════════════════════════════════════════════════════════════════════╣
║  Changes Made                                                                      ║
║  ───────────────────────────────────────────────────────────────────────────────   ║
║  baseline  → Initial strategy implementation                                       ║
║  exp_001   → Increased leverage 5x → 10x                                          ║
║  exp_002   → Added momentum filter (underperformed - reverted)                    ║
║  exp_003   → Tightened stop loss 1.5% → 1.0%                                      ║
║  exp_004   → Added RSI confirmation filter                                         ║
║                                                                                    ║
╠════════════════════════════════════════════════════════════════════════════════════╣
║  Evolution Summary                                                                 ║
║  ───────────────────────────────────────────────────────────────────────────────   ║
║                                                                                    ║
║  Sharpe Ratio Progression:                                                         ║
║  baseline ─── exp_001 ─── exp_002 ─── exp_003 ─── exp_004                         ║
║    1.45        1.52        1.38        1.67        1.89                            ║
║     │           ▲           ▼           ▲           ▲                              ║
║     └──────────+0.07──────-0.14───────+0.29───────+0.22                           ║
║                                                                                    ║
║  Key Improvements:                                                                 ║
║  • exp_003: Stop loss tightening improved Sharpe significantly                    ║
║  • exp_004: RSI filter best risk-adjusted returns                                  ║
║                                                                                    ║
║  Failed Experiments:                                                               ║
║  • exp_002: Momentum filter hurt performance                                       ║
║                                                                                    ║
╚════════════════════════════════════════════════════════════════════════════════════╝

Best Configuration: exp_004
• Sharpe: 1.89 (+30% vs baseline)
• Max DD: -11.8% (+4% vs baseline)
• Win Rate: 61.2% (+7% vs baseline)
```

## 4. Optional: Export Comparison

If requested, generate `experiments/COMPARISON.md`:

```markdown
# Experiment Comparison

**Strategy:** {name}
**Generated:** {date}

## Summary

| Metric | Best | Baseline | Improvement |
|--------|------|----------|-------------|
| Sharpe | 1.89 | 1.45 | +30% |
| Max DD | -11.8% | -12.3% | +4% |
| Win Rate | 61.2% | 54.2% | +13% |

## All Experiments

{table}

## Evolution Notes

{changes and learnings}
```

## 5. Suggest Next Steps

Based on comparison:

```
Suggestions:
• exp_004 is currently best - consider locking in these changes
• exp_002 (momentum filter) hurt performance - avoid similar approaches
• Win rate improving but trade count decreasing - monitor for overfit
```

</process>

<success_criteria>
- [ ] All experiments loaded
- [ ] Side-by-side comparison displayed
- [ ] Best values highlighted
- [ ] Changes documented
- [ ] Evolution/progression shown
- [ ] Actionable suggestions provided
</success_criteria>
