---
name: cbt:deep-analyze
description: Post-backtest forensic analysis with statistical tests and Seaborn visualizations
argument-hint: "[exp_id]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Task
---

<objective>
Perform deep forensic analysis of backtest results with statistical tests and Seaborn visualizations.
Goes much deeper than /cbt:analyze (which is quick text-based pattern analysis).
Generates actionable insights backed by statistical evidence.
</objective>

<execution_context>
@strategies/{active}/.cbt/state.yaml
@strategies/{active}/config.yaml
@strategies/{active}/experiments/
@strategies/{active}/trades/
</execution_context>

<principles>
- Statistical rigor - every finding backed by a test or metric
- Visual evidence - every insight has a corresponding plot
- Actionable output - findings should suggest specific improvements
- Compare against baseline when possible
- Be honest about limitations and caveats
</principles>

<process>

## 1. Parse Arguments

- No args → analyze most recent experiment
- `exp_id` → analyze specific experiment (e.g., `exp_003`)

## 2. Load Data

Read experiment results:
- `experiments/{exp_id}.yaml` → metrics, config
- `trades/{exp_id}_trades.csv` → individual trade log (if exists)
- `experiments/baseline.yaml` → baseline for comparison

If trade log doesn't exist, check for equity curve data.

## 3. Deep Analysis Suite

Generate and run a Python script that performs:

### 3a. Trade PnL Distribution
- PnL distribution of all trades (Seaborn histplot + kdeplot)
- Separate distributions for longs vs shorts
- Separate distributions for wins vs losses
- Statistical summary (mean, median, std, skew, kurtosis)
- Save: `plots/deep_analyze/pnl_distribution.png`

### 3b. Win/Loss Clustering Heatmap
- Time-based clustering: wins/losses by hour × day of week (Seaborn heatmap)
- Identify "hot" and "cold" trading periods
- Save: `plots/deep_analyze/win_loss_heatmap.png`

### 3c. Equity Curve Analysis
- Equity curve with drawdown overlay
- Underwater plot (drawdown periods)
- Equity curve vs buy-and-hold comparison
- Save: `plots/deep_analyze/equity_curve.png`

### 3d. Drawdown Analysis
- Drawdown distribution (histogram)
- Drawdown duration distribution
- Top 10 drawdowns table
- Recovery time analysis
- Save: `plots/deep_analyze/drawdown_analysis.png`

### 3e. Return Autocorrelation
- Autocorrelation of trade returns (are wins/losses streaky?)
- Ljung-Box test for serial correlation
- Runs test for randomness
- Save: `plots/deep_analyze/return_autocorrelation.png`

### 3f. Regime-Conditional Performance
- Performance in high vs low volatility regimes
- Performance in trending vs ranging markets
- Performance by market regime (bull/bear/sideways)
- Save: `plots/deep_analyze/regime_performance.png`

### 3g. Slippage & Fee Impact Analysis
- Gross vs net PnL comparison
- Fee impact as percentage of gross profit
- Slippage sensitivity analysis
- Break-even fee analysis
- Save: `plots/deep_analyze/fee_impact.png`

### 3h. Monte Carlo Simulation
- 1000 simulations with random trade resampling
- Confidence intervals for final equity (5th, 25th, 50th, 75th, 95th percentiles)
- Probability of ruin analysis
- Monte Carlo equity cone plot
- Save: `plots/deep_analyze/monte_carlo.png`

### 3i. Rolling Sharpe Ratio
- Rolling Sharpe (30/60/90 trade windows)
- Identify periods of strategy decay or improvement
- Statistical stability assessment
- Save: `plots/deep_analyze/rolling_sharpe.png`

### 3j. Trade Duration vs PnL
- Scatter plot of trade duration vs PnL (Seaborn scatterplot with regression)
- Optimal holding period analysis
- Duration distribution for wins vs losses
- Save: `plots/deep_analyze/duration_vs_pnl.png`

### 3k. Prop Firm Compliance (conditional: only if prop_firm.enabled in config.yaml)

Read config.yaml to check `prop_firm.enabled`. If true:

- **Equity curve with drawdown limit line**: Plot equity curve with a horizontal line at initial_capital * (1 - max_drawdown_pct/100) showing the max drawdown limit. Mark daily loss breach bars with red markers.
- **Monte Carlo probability of breach**: Using the existing Monte Carlo simulation (3h), calculate probability of hitting max drawdown or daily loss limit across 1000 simulated paths.
- **Days at risk analysis**: For each trading day, calculate how close equity came to the daily loss limit. Heatmap of daily risk exposure.
- **Phase target progress curve**: Plot cumulative return vs time with horizontal line at target (10% or 5%). Mark when/if target was reached.
- Save: `plots/deep_analyze/prop_firm_compliance.png`

## 4. Generate DEEP_ANALYSIS.md

```markdown
# Deep Analysis: {strategy_name} - {exp_id}

**Date:** {date}
**Experiment:** {exp_id}
**Period:** {start_date} to {end_date}
**Total Trades:** {N}

---

## Executive Summary

{2-3 sentences summarizing the most important findings}

**Overall Assessment:** {Strong / Moderate / Weak / Concerning}

---

## Performance Breakdown

### PnL Distribution
{Summary of PnL distribution characteristics}
- Mean trade PnL: ${amount}
- Median trade PnL: ${amount}
- PnL skewness: {value} ({positive = right tail, good})
- Best trade: ${amount}
- Worst trade: ${amount}

![PnL Distribution](plots/deep_analyze/pnl_distribution.png)

### Win/Loss Patterns
{Time-based patterns found}
- Best trading hours: {hours}
- Worst trading hours: {hours}
- Best day of week: {day}

![Win/Loss Heatmap](plots/deep_analyze/win_loss_heatmap.png)

### Equity Curve
{Equity curve characteristics}
![Equity Curve](plots/deep_analyze/equity_curve.png)

### Drawdown Analysis
{Drawdown findings}
- Max drawdown: {pct}%
- Average drawdown: {pct}%
- Max drawdown duration: {days} days
- Average recovery time: {days} days

| Rank | Drawdown | Duration | Recovery |
|------|----------|----------|----------|
| 1 | {pct}% | {days}d | {days}d |
| 2 | {pct}% | {days}d | {days}d |
| ... | ... | ... | ... |

![Drawdown Analysis](plots/deep_analyze/drawdown_analysis.png)

### Return Autocorrelation
{Findings about trade return serial correlation}
- Ljung-Box p-value: {value}
- Runs test p-value: {value}
- Interpretation: {streaky / random / mean-reverting}

![Autocorrelation](plots/deep_analyze/return_autocorrelation.png)

### Regime Performance
{How the strategy performs in different market conditions}

| Regime | Trades | Win Rate | Avg PnL | Sharpe |
|--------|--------|----------|---------|--------|
| High Vol | {n} | {pct}% | ${amt} | {sr} |
| Low Vol | {n} | {pct}% | ${amt} | {sr} |
| Trending | {n} | {pct}% | ${amt} | {sr} |
| Ranging | {n} | {pct}% | ${amt} | {sr} |

![Regime Performance](plots/deep_analyze/regime_performance.png)

### Fee & Slippage Impact
{Fee impact analysis}
- Gross profit: ${amount}
- Total fees: ${amount} ({pct}% of gross)
- Break-even fee rate: {pct}%

![Fee Impact](plots/deep_analyze/fee_impact.png)

### Monte Carlo Simulation
{Monte Carlo results}
- Median final equity: ${amount}
- 5th percentile: ${amount}
- 95th percentile: ${amount}
- Probability of loss: {pct}%
- Probability of ruin (<50% equity): {pct}%

![Monte Carlo](plots/deep_analyze/monte_carlo.png)

### Strategy Stability
{Rolling Sharpe analysis}
- Rolling Sharpe (30 trades): mean {value}, std {value}
- Trend: {improving / stable / degrading}

![Rolling Sharpe](plots/deep_analyze/rolling_sharpe.png)

### Trade Duration Analysis
{Duration vs performance relationship}
- Optimal holding period: {range}
- Correlation (duration vs PnL): {value}

![Duration vs PnL](plots/deep_analyze/duration_vs_pnl.png)

{If prop_firm.enabled:}
### Prop Firm Compliance
{Compliance assessment}
- **Overall Compliance:** {PASS / FAIL}
- Max drawdown from initial: {pct}% (limit: {limit}%)
- Daily loss breaches: {count} days
- Target reached: {Yes (bar X / date Y) / No}
- Monte Carlo P(breach): {pct}%
- Days at highest risk: {list}

![Prop Firm Compliance](plots/deep_analyze/prop_firm_compliance.png)

---

## Actionable Recommendations

Based on statistical findings:

### High Priority
1. {Specific, data-driven recommendation}
2. {Specific, data-driven recommendation}

### Medium Priority
3. {Recommendation}
4. {Recommendation}

### Consider
5. {Optional improvement}

---

## Comparison to Baseline

| Metric | Baseline | {exp_id} | Change |
|--------|----------|----------|--------|
| Sharpe | {value} | {value} | {+/-} |
| Win Rate | {pct}% | {pct}% | {+/-} |
| Max DD | {pct}% | {pct}% | {+/-} |
| Trades | {n} | {n} | {+/-} |

---

*Generated by CBT Framework /cbt:deep-analyze*
```

## 5. Output Summary

```
Deep Analysis Complete!

Experiment: {exp_id}
Plots: {N} visualizations saved to plots/deep_analyze/
Report: DEEP_ANALYSIS.md

Key Findings:
- {Most important finding}
- {Second finding}
- {Third finding}

Top Recommendation: {highest priority action}

Next: /cbt:optimize or /cbt:iterate
```

</process>

<seaborn_styling>
```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="darkgrid", palette="deep")
plt.rcParams['figure.figsize'] = (12, 6)
plt.rcParams['figure.dpi'] = 150
```
</seaborn_styling>

<constraints>
- DO run the analysis script to generate actual plots
- DO save all plots to plots/deep_analyze/
- DO include statistical tests with p-values
- DO compare to baseline when available
- DO provide specific, actionable recommendations
- DO NOT modify any strategy or config files
- DO NOT overstate statistical significance
</constraints>

<success_criteria>
- [ ] All analysis sections completed (10 core + prop firm if enabled)
- [ ] Plots saved to plots/deep_analyze/
- [ ] DEEP_ANALYSIS.md created with all sections
- [ ] Statistical tests included with proper interpretation
- [ ] Actionable recommendations generated
- [ ] Baseline comparison included (if available)
</success_criteria>
