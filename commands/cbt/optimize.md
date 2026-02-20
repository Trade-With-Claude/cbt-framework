---
name: cbt:optimize
description: Structured post-backtest parameter optimization
argument-hint: "[sweep|walkforward|grid|random]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Task
  - AskUserQuestion
---

<objective>
Perform structured, systematic optimization of strategy parameters.
More rigorous than /cbt:iterate (which is one-change-at-a-time).
Includes parameter sweeps, walk-forward testing, and overfitting warnings.
</objective>

<execution_context>
@strategies/{active}/.cbt/state.yaml
@strategies/{active}/config.yaml
@strategies/{active}/DISCOVERY.md
@strategies/{active}/experiments/
@strategies/{active}/DEEP_ANALYSIS.md (if exists)
</execution_context>

<principles>
- Systematic over ad-hoc: test parameter ranges methodically
- Always warn about overfitting risks
- In-sample vs out-of-sample separation is mandatory
- Track ALL optimization runs for reproducibility
- Best parameters must pass out-of-sample validation
</principles>

<process>

## 1. Parse Arguments

- `sweep` → Parameter sweep mode (test specific parameter ranges)
- `walkforward` → Walk-forward optimization
- `grid` → Grid search over multiple parameter combinations
- `random` → Random search (for large parameter spaces)
- No args → Ask user which mode

## 2. Load Context

Read current experiment results:
- Best experiment metrics
- Current config parameters
- Strategy type and engine

If DEEP_ANALYSIS.md exists, use its recommendations to suggest optimization targets.

## 3. Define Optimization Scope

Ask user (or read from deep analysis recommendations):

### What to optimize?
Suggest based on analysis:
- "Based on your deep analysis, these parameters show the most potential for improvement:"
  - {param 1}: current value = {val}, suggested range = {range}
  - {param 2}: current value = {val}, suggested range = {range}

### Options:
- **Signal parameters** - Indicator periods, thresholds, weights
- **Risk parameters** - Stop loss %, take profit %, position sizing
- **Filter parameters** - Volume filters, volatility filters, time filters
- **Custom** - User-defined parameters and ranges

## 4. Mode: Parameter Sweep

```python
# For each parameter being swept:
# Test N values across the defined range
# Record: parameter_value → (sharpe, return, drawdown, win_rate, trades)
# Generate: parameter sensitivity plot (Seaborn lineplot)
```

Output:
- Parameter sensitivity chart for each parameter
- Optimal value identification
- Stability assessment (is the optimum sharp or broad?)

Save: `plots/optimize/param_sweep_{param_name}.png`

## 5. Mode: Walk-Forward Optimization

```
|------ In-Sample ------|-- Out-of-Sample --|
|  Train parameters     |  Test parameters  |
|                       |                   |
      Window 1          |     Validate 1
         |------ In-Sample ------|-- OOS --|
              Window 2           | Val 2   |
                  |---- In-Sample ----|--OOS--|
                       Window 3        Val 3
```

Process:
1. Split data into N windows (e.g., 5)
2. For each window: optimize on in-sample, test on out-of-sample
3. Report: average OOS performance across all windows
4. Compare: in-sample Sharpe vs out-of-sample Sharpe

If IS/OOS Sharpe ratio > 2:1 → WARN: likely overfit

## 6. Mode: Grid Search

Define parameter grid:
```yaml
grid:
  sma_fast: [5, 10, 15, 20]
  sma_slow: [30, 50, 100, 200]
  rsi_threshold: [25, 30, 35]
  stop_loss_pct: [0.5, 1.0, 1.5, 2.0]
```

Total combinations: product of all list lengths
Run all combinations, rank by Sharpe (or user-chosen metric).

Save top 10 to `experiments/` with optimization tag.

## 7. Mode: Random Search

For large parameter spaces (>1000 combinations):
- Sample N random configurations (default: 100)
- More efficient than grid search for high-dimensional spaces
- Report: best found, distribution of results

## 8. Overfitting Checks

After optimization, ALWAYS run these checks:

### 8a. In-Sample vs Out-of-Sample
- Compare optimized performance on training data vs held-out data
- Flag if OOS performance drops >30%

### 8b. Parameter Stability
- Does small change in parameters cause large change in results?
- If yes → WARN: fragile optimization, likely overfit

### 8c. Number of Trades
- Does optimization reduce trade count significantly?
- If trades < 30 → WARN: insufficient statistical significance

### 8d. Monte Carlo Check
- Run Monte Carlo on optimized parameters
- Compare confidence intervals to baseline

## 9. Generate Optimization Report

```markdown
# Optimization Report: {strategy_name}

**Date:** {date}
**Mode:** {sweep / walkforward / grid / random}
**Parameters Optimized:** {list}
**Total Configurations Tested:** {N}

---

## Results Summary

### Best Configuration

| Parameter | Before | After | Change |
|-----------|--------|-------|--------|
| {param1} | {old} | {new} | {diff} |
| {param2} | {old} | {new} | {diff} |

### Performance Comparison

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Sharpe | {old} | {new} | {+/-} |
| Return | {old}% | {new}% | {+/-} |
| Max DD | {old}% | {new}% | {+/-} |
| Win Rate | {old}% | {new}% | {+/-} |
| Trades | {old} | {new} | {+/-} |

---

## Overfitting Assessment

| Check | Status | Details |
|-------|--------|---------|
| IS vs OOS | {PASS/WARN} | IS Sharpe: {val}, OOS Sharpe: {val} |
| Param Stability | {PASS/WARN} | {details} |
| Trade Count | {PASS/WARN} | {n} trades (min: 30) |
| Monte Carlo | {PASS/WARN} | 5th percentile: {val} |

**Overall Risk:** {Low / Medium / High}

---

## Parameter Sensitivity

{For each parameter optimized:}
![{param} Sensitivity](plots/optimize/param_sweep_{param}.png)

---

## Recommendation

{Based on all checks, recommend whether to adopt the optimized parameters}

---

*Generated by CBT Framework /cbt:optimize*
```

## 10. Apply Results

If user approves:
- Update config.yaml with optimal parameters
- Save optimization experiment to experiments/
- Update state with best parameters

```
Optimization complete!

Tested: {N} configurations
Best: {summary}
Overfitting risk: {low/medium/high}

Parameters saved to config.yaml.

Next: /cbt:run (verify) or /cbt:iterate (continue refining)
```

</process>

<constraints>
- ALWAYS split data into in-sample and out-of-sample
- ALWAYS warn about overfitting
- ALWAYS track all optimization runs
- DO suggest conservative parameter changes over aggressive ones
- DO compare against baseline, not just previous best
- DO NOT apply parameters without user confirmation (unless YOLO mode)
</constraints>

<success_criteria>
- [ ] Optimization mode executed (sweep/walkforward/grid/random)
- [ ] All configurations tracked in experiments/
- [ ] Overfitting checks performed
- [ ] Parameter sensitivity visualized
- [ ] Best parameters identified with comparison to baseline
- [ ] User informed of overfitting risk level
</success_criteria>
