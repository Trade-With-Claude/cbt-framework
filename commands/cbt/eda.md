---
name: cbt:eda
description: Pre-backtest exploratory data analysis with Seaborn visualizations
argument-hint: ""
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Task
  - AskUserQuestion
---

<objective>
Perform exploratory data analysis on raw data AFTER research (research findings inform what to look for).
Generate statistical insights, Seaborn visualizations, and an EDA.md report to inform strategy building.
Adapts analysis to project type (indicator vs ML).
</objective>

<execution_context>
@strategies/{active}/DISCOVERY.md
@strategies/{active}/RESEARCH.md (if exists)
@strategies/{active}/config.yaml
@strategies/{active}/.cbt/state.yaml
@strategies/{active}/Data/
@~/.claude/agents/cbt-eda.md
</execution_context>

<principles>
- Let the data tell the story - don't force hypotheses onto data
- Research findings should guide what patterns to investigate
- All visualizations use Seaborn + matplotlib for consistency
- Save all plots to plots/eda/ for reference
- Statistical tests should be appropriate for the data type
- Clearly distinguish indicator/OHLCV EDA from ML EDA
</principles>

<process>

## 1. Load Context

Read state.yaml to determine:
- `project_type` (indicator | ml | hybrid)
- `engine` (pandas | fast) - determines data loading approach

Read DISCOVERY.md and RESEARCH.md to understand:
- What patterns/features to investigate
- What the strategy is trying to exploit
- Known risks or data requirements

## 2. Locate and Load Data

Find data files in Data/ directory.
- If engine is `pandas`: load with pandas
- If engine is `fast`: load with Polars, convert to pandas for EDA (plotting requires pandas)

Verify data is present and loadable before proceeding.

## 3. Core EDA (Always Performed)

Generate a Python script that produces the following analyses and saves plots:

### 3a. Data Overview
- Shape, dtypes, date range
- Missing values count and percentage
- Duplicate timestamps check
- Data gaps analysis (missing candles/periods)

### 3b. Price Distribution Analysis
- Returns distribution (Seaborn histplot + kdeplot overlay)
- Log returns distribution
- QQ plot for normality assessment
- Summary statistics (mean, std, skew, kurtosis)
- Save: `plots/eda/returns_distribution.png`

### 3c. Correlation Analysis
- Correlation matrix of OHLCV + any additional columns (Seaborn heatmap)
- Save: `plots/eda/correlation_matrix.png`

### 3d. Volume Profile Analysis
- Volume distribution over time
- Volume vs price relationship (Seaborn scatterplot/jointplot)
- Volume anomalies detection
- Save: `plots/eda/volume_profile.png`

### 3e. Seasonality Patterns
- Returns by hour of day (Seaborn barplot)
- Returns by day of week (Seaborn barplot)
- Returns by month (Seaborn barplot)
- Volatility by hour/day (Seaborn heatmap)
- Save: `plots/eda/seasonality.png`

### 3f. Volatility Regime Analysis
- Rolling volatility (multiple windows)
- Volatility clustering visualization
- Regime detection (high/low vol periods)
- Save: `plots/eda/volatility_regimes.png`

### 3g. Stationarity Tests
- ADF test on price and returns
- KPSS test
- Rolling mean and std visualization
- Save: `plots/eda/stationarity.png`

## 4. Indicator/OHLCV-Specific EDA (if project_type == indicator or hybrid)

### 4a. Technical Indicator Exploration
Based on DISCOVERY.md entry conditions, compute and visualize:
- Key indicators mentioned (MA, RSI, MACD, etc.)
- Indicator distributions
- Indicator-return correlations
- Save: `plots/eda/indicator_analysis.png`

### 4b. Price Action Patterns
- Candlestick pattern frequency (if relevant)
- Support/resistance level analysis
- Trend strength analysis

## 5. ML-Specific EDA (if project_type == ml or hybrid)

### 5a. Feature Distributions
- Distribution of each proposed feature (Seaborn histplot grid)
- Box plots for outlier detection
- Save: `plots/eda/feature_distributions.png`

### 5b. Target Variable Analysis
- Target distribution (if defined)
- Class balance assessment
- Target autocorrelation
- Save: `plots/eda/target_analysis.png`

### 5c. Feature-Target Correlations
- Correlation of features with target (Seaborn barplot)
- Mutual information scores
- Save: `plots/eda/feature_target_correlations.png`

### 5d. Collinearity Analysis
- Variance Inflation Factor (VIF) for each feature
- Highly correlated feature pairs
- Save: `plots/eda/collinearity.png`

### 5e. Missing Value Patterns
- Missingness heatmap (Seaborn)
- Missing value correlations
- Save: `plots/eda/missing_values.png`

### 5f. Train/Test Distribution Comparison
- Feature distributions in train vs test periods
- Concept drift indicators
- Save: `plots/eda/train_test_comparison.png`

## 5b. Prop Firm Risk Assessment (if prop_firm.enabled in config.yaml)

If `prop_firm.enabled` is true in config.yaml, add this conditional section to the EDA:

### 5b-i. Daily Return Distribution vs Daily Loss Limit
- Calculate daily returns from the raw data
- Plot daily return distribution (Seaborn histplot + kdeplot)
- Draw vertical line at -5% (daily loss limit) and shade the breach zone
- Calculate probability of daily return exceeding the daily loss limit
- Save: `plots/eda/prop_firm_daily_loss_risk.png`

### 5b-ii. Max Adverse Excursion Analysis
- Calculate rolling drawdowns from peaks over various windows
- Compare rolling drawdown distribution against 10% max drawdown limit
- Estimate probability of hitting max drawdown limit based on historical volatility
- Save: `plots/eda/prop_firm_drawdown_risk.png`

### 5b-iii. Prop Firm Volatility Sizing Assessment
- Given the prop firm limits, calculate maximum safe position size
- Show risk-of-ruin analysis at different sizing levels
- Recommend conservative sizing that keeps P(breach) < 5%
- Save: `plots/eda/prop_firm_sizing_risk.png`

Add to EDA.md report under a new section:
```markdown
## Prop Firm Risk Assessment

### Daily Loss Risk
- Probability of daily loss exceeding {daily_loss_pct}%: {pct}%
- Worst historical daily return: {value}%
- Days exceeding limit in raw data: {count}

### Drawdown Risk
- Probability of drawdown exceeding {max_drawdown_pct}%: {pct}%
- Historical max drawdown: {value}%
- Estimated safe position sizing: {pct}% per trade

### Recommendation
{Data-driven recommendation on sizing/risk for prop firm compliance}
```

## 6. Generate EDA Script

Write a self-contained Python script `eda_analysis.py` that:
- Loads data from Data/ directory
- Runs all applicable analyses
- Saves all plots to plots/eda/
- Prints summary statistics to stdout
- Uses Seaborn set_theme() for consistent styling

Run the script and capture output.

## 7. Generate EDA.md Report

```markdown
# Exploratory Data Analysis: {strategy_name}

**Date:** {date}
**Data Range:** {start} to {end}
**Total Rows:** {N}
**Project Type:** {indicator / ml / hybrid}

---

## Data Overview

| Metric | Value |
|--------|-------|
| Rows | {N} |
| Columns | {cols} |
| Date Range | {range} |
| Missing Values | {count} ({pct}%) |
| Duplicate Timestamps | {count} |
| Data Gaps | {count} |

---

## Key Findings

### 1. Distribution Characteristics
{Summary of returns/price distribution findings}
- Skewness: {value} ({interpretation})
- Kurtosis: {value} ({interpretation})
- Normality: {ADF/KPSS results}

### 2. Correlation Structure
{Key correlations found}
![Correlation Matrix](plots/eda/correlation_matrix.png)

### 3. Volume Insights
{Volume patterns and anomalies}

### 4. Seasonality
{Notable time-of-day, day-of-week patterns}
![Seasonality](plots/eda/seasonality.png)

### 5. Volatility Regimes
{Volatility clustering, regime characteristics}
![Volatility Regimes](plots/eda/volatility_regimes.png)

{If ML project:}
### 6. Feature Quality Assessment
{Feature distributions, collinearity issues, target balance}

---

## Implications for Strategy

### Supports Hypothesis
- {Finding that supports the strategy's edge}

### Challenges to Hypothesis
- {Finding that challenges the strategy's assumptions}

### Suggested Adjustments
- {Data-driven suggestions for strategy refinement}

---

## Plots Generated

| Plot | File |
|------|------|
| Returns Distribution | `plots/eda/returns_distribution.png` |
| Correlation Matrix | `plots/eda/correlation_matrix.png` |
| Volume Profile | `plots/eda/volume_profile.png` |
| Seasonality | `plots/eda/seasonality.png` |
| Volatility Regimes | `plots/eda/volatility_regimes.png` |
| Stationarity | `plots/eda/stationarity.png` |
{Additional ML plots if applicable}

---

*Generated by CBT Framework /cbt:eda*
```

## 8. Update State

```yaml
phases_completed:
  eda: true
phase: config  # or plan if config already done
```

## 9. Output Summary

```
EDA Complete!

Created: EDA.md
Plots: {N} visualizations saved to plots/eda/

Key Findings:
- {Finding 1}
- {Finding 2}
- {Finding 3}

Implications: {brief summary}

Next: /cbt:config
```

</process>

<seaborn_styling>
All plots should use consistent Seaborn styling:
```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="darkgrid", palette="deep")
plt.rcParams['figure.figsize'] = (12, 6)
plt.rcParams['figure.dpi'] = 150
```
</seaborn_styling>

<constraints>
- DO run the analysis script to generate actual plots and statistics
- DO save all plots to plots/eda/ directory
- DO adapt analysis to project_type (indicator vs ML)
- DO reference research findings when interpreting results
- DO highlight findings that support OR challenge the strategy hypothesis
- DO NOT make code changes to strategy files - this is analysis only
- DO NOT proceed to build without flagging data quality issues
</constraints>

<success_criteria>
- [ ] Data loaded and validated
- [ ] All applicable analyses run (core + type-specific)
- [ ] Plots saved to plots/eda/
- [ ] EDA.md created with findings and implications
- [ ] Findings linked back to strategy hypothesis
- [ ] State updated: eda phase complete
</success_criteria>
