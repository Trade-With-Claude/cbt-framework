---
name: cbt:plot
description: Visualize signals, indicators, and equity on price charts
argument-hint: "[signals|indicators|equity|drawdown|all]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - AskUserQuestion
---

<objective>
Plot signals overlaid on price charts using mplfinance + Seaborn.
Provides multiple visualization modes for strategy analysis.
</objective>

<execution_context>
@strategies/{active}/.cbt/state.yaml
@strategies/{active}/config.yaml
@strategies/{active}/src/
@strategies/{active}/trades/
@strategies/{active}/experiments/
</execution_context>

<process>

## 1. Parse Arguments

- `signals` → Entry/exit markers on candlestick chart
- `indicators` → Overlay indicators (MA, RSI, etc.) on price chart
- `equity` → Equity curve plot
- `drawdown` → Drawdown visualization
- `all` → Dashboard with all subplots combined
- No args → Ask user which mode, default to `all`

## 2. Load Data

Load required data based on mode:
- Price data from Data/ directory
- Trade log from trades/ directory (for signals mode)
- Experiment results from experiments/ (for equity/drawdown)
- Strategy signals from src/ (for signal overlay)

## 3. Generate Plot Script

### Mode: signals

Plot candlestick chart with entry/exit markers:

```python
import mplfinance as mpf
import pandas as pd
import seaborn as sns

# Load price data and trades
# Mark entries with green triangles (▲ long, ▼ short)
# Mark exits with red markers
# Add volume subplot
# Highlight winning vs losing trades with different colors

# Save to plots/signals.png
```

Features:
- Green ▲ for long entries, red ▼ for short entries
- Green × for profitable exits, red × for losing exits
- Shaded regions showing position held periods
- Volume bars below
- Optional date range zoom (ask user)

### Mode: indicators

Plot price with technical indicators overlaid:

```python
# Read strategy to identify which indicators are used
# Compute indicators on price data
# Overlay on candlestick chart
# RSI/MACD etc. on subplots below

# Save to plots/indicators.png
```

Features:
- Candlestick chart with MA overlays
- RSI subplot (if used)
- MACD subplot (if used)
- Bollinger Bands overlay (if used)
- Volume with volume MA

### Mode: equity

Plot equity curve:

```python
import seaborn as sns
import matplotlib.pyplot as plt

# Plot equity curve over time
# Add horizontal line at starting capital
# Shade drawdown periods
# Add annotations for max drawdown point
# Compare vs buy-and-hold if applicable

# Save to plots/equity_curve.png
```

### Mode: drawdown

Plot drawdown visualization:

```python
# Underwater plot (drawdown % below zero line)
# Drawdown distribution histogram (sidebar)
# Annotate top 3 drawdowns with duration

# Save to plots/drawdown.png
```

### Mode: all (Dashboard)

Create a multi-panel dashboard:

```python
fig = plt.figure(figsize=(20, 16))

# Panel 1 (top, wide): Candlestick with signals
# Panel 2 (middle left): Equity curve
# Panel 3 (middle right): Drawdown underwater
# Panel 4 (bottom left): Trade PnL distribution
# Panel 5 (bottom right): Win rate by period

plt.tight_layout()
fig.savefig('plots/dashboard.png', dpi=150, bbox_inches='tight')
```

## 4. Interactive Options

If mode is `signals` or `indicators`, ask:
- "Date range to plot?" → Options:
  - Full dataset
  - Last N days (50, 100, 200)
  - Custom range (start_date to end_date)

This keeps charts readable for large datasets.

## 5. Run Script & Save

Execute the plotting script.
Save plots to the `plots/` directory.

## 6. Output Summary

```
Plot generated!

Mode: {mode}
File: plots/{filename}.png
Data range: {start} to {end}
{If signals mode: "Trades shown: {N}"}

Tip: Run /cbt:plot all for a complete dashboard.
```

</process>

<seaborn_styling>
```python
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style="darkgrid", palette="deep")
plt.rcParams['figure.figsize'] = (16, 8)
plt.rcParams['figure.dpi'] = 150
```
</seaborn_styling>

<constraints>
- DO use mplfinance for candlestick charts
- DO use Seaborn for distribution plots and heatmaps
- DO save all plots to plots/ directory
- DO handle missing trade data gracefully
- DO support date range filtering for readability
- DO NOT modify any strategy or data files
</constraints>

<success_criteria>
- [ ] Requested plot mode generated
- [ ] Plot saved to plots/ directory
- [ ] Chart is readable (appropriate zoom level)
- [ ] Signals/indicators match strategy code
- [ ] Clean, professional styling
</success_criteria>
