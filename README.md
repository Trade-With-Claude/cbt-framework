# CBT Framework

> **Claude Backtest Framework** - A structured backtesting workflow for trading strategies with Claude Code

[![npm version](https://badge.fury.io/js/cbt-framework.svg)](https://badge.fury.io/js/cbt-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

CBT Framework is a comprehensive toolkit that brings structure and discipline to trading strategy development. It integrates directly with [Claude Code](https://claude.ai/claude-code) to provide an AI-assisted workflow for building, testing, and iterating on trading strategies.

## Features

- **Structured Discovery** - Define your strategy through guided Q&A
- **Deep Research** - Validate hypotheses with literature and implementation research
- **From-Scratch Engine** - Pure Python backtesting with no external dependencies
- **Experiment Tracking** - Every backtest run is tracked and comparable
- **Iteration Workflow** - Systematic approach to strategy improvement
- **State Persistence** - Pick up exactly where you left off

## Installation

```bash
npx cbt-framework
```

This will install the CBT Framework commands into your Claude Code environment.

### Requirements

- [Claude Code](https://claude.ai/claude-code) CLI
- Node.js 16+
- Python 3.8+ (for strategy execution)

## Quick Start

### 1. Create a New Strategy

```
/cbt:new my_strategy
```

This creates the folder structure:
```
strategies/my_strategy/
├── Data/               # Place your datasets here
├── IDEA.md            # Initial thoughts
├── config.yaml        # Backtest parameters
└── .cbt/state.yaml    # Framework state
```

### 2. Discover Your Strategy

```
/cbt:discover
```

Answer questions about:
- What edge are you exploiting?
- Entry and exit conditions
- Data requirements
- Success criteria

Output: `DISCOVERY.md` with complete strategy specification

### 3. Research and Validate

```
/cbt:research
```

Searches for:
- Academic papers supporting your hypothesis
- Existing implementations on GitHub
- Known risks and pitfalls

Output: `RESEARCH.md` with findings and recommendations

### 4. Configure Backtest Parameters

```
/cbt:config
```

Set up:
- Initial capital
- Position sizing
- Leverage settings
- Stop loss / take profit
- Fees and slippage

Or use a preset:
```
/cbt:config preset binance_futures
```

### 5. Build Your Strategy

```
/cbt:build
```

Generates:
- `src/data_loader.py` - Data loading and validation
- `src/features.py` - Feature engineering (with lookahead prevention)
- `src/signals.py` - Signal generation
- `strategy.py` - Main strategy class
- `backtest.py` - Backtest runner

### 6. Run and Iterate

```
/cbt:run
```

Execute backtest and save results to `experiments/`.

```
/cbt:iterate
```

Enter the optimization loop:
1. Analyze results
2. Record observations
3. Apply changes
4. Run again
5. Compare and decide

## Workflow Overview

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ DISCOVER │───▶│ RESEARCH │───▶│  CONFIG  │───▶│  BUILD   │───▶│ ITERATE  │
│          │    │          │    │          │    │          │    │          │
│ Define   │    │ Validate │    │ Set      │    │ Generate │    │ Optimize │
│ strategy │    │ edge     │    │ params   │    │ code     │    │ loop     │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

## Commands Reference

### Setup Commands

| Command | Description |
|---------|-------------|
| `/cbt:new <name>` | Create new strategy |
| `/cbt:status` | Show current state |
| `/cbt:help` | Show all commands |

### Workflow Commands

| Command | Description |
|---------|-------------|
| `/cbt:discover` | Define strategy through Q&A |
| `/cbt:research` | Deep research phase |
| `/cbt:config` | Configure backtest parameters |
| `/cbt:build` | Generate strategy code |
| `/cbt:run` | Execute backtest |
| `/cbt:analyze` | Deep analysis of results |
| `/cbt:iterate` | Guided optimization loop |
| `/cbt:compare` | Compare experiments |
| `/cbt:observe` | Save observation |

### Utility Commands

| Command | Description |
|---------|-------------|
| `/cbt:config show` | Display current config |
| `/cbt:config preset <name>` | Load preset |
| `/cbt:build status` | Show build progress |
| `/cbt:update` | Update framework |

## Configuration

### Config File Structure

```yaml
account:
  initial_capital: 10000
  currency: USD

sizing:
  mode: percent        # percent | fixed | kelly
  percent_per_trade: 2.0
  max_positions: 3

leverage:
  enabled: true
  default: 5
  max: 20

risk:
  stop_loss:
    enabled: true
    mode: percent      # percent | atr | fixed
    percent: 1.0
  take_profit:
    enabled: true
    mode: percent
    percent: 2.0
  trailing_stop:
    enabled: false

fees:
  maker: 0.02
  taker: 0.04
  slippage: 0.01
```

### Available Presets

- `binance_futures` - Binance USDT-M Futures fees
- `binance_spot` - Binance spot trading
- `conservative` - Lower risk settings
- `aggressive` - Higher risk settings

## Backtest Engine

CBT includes a pure Python backtest engine with:

- **Realistic Execution**
  - Maker/taker fee modeling
  - Slippage simulation
  - Position sizing

- **Risk Management**
  - Stop loss (percent, ATR, fixed)
  - Take profit (percent, R:R ratio, fixed)
  - Trailing stops

- **Metrics**
  - Sharpe & Sortino ratios
  - Max drawdown & duration
  - Win rate & profit factor
  - Trade analysis

### No External Dependencies

The backtest engine is built from scratch using only:
- `pandas` - Data manipulation
- `numpy` - Numerical operations
- `PyYAML` - Config parsing

No `backtrader`, `zipline`, or other backtesting libraries required.

## Project Structure

```
strategies/<name>/
├── Data/
│   ├── README.md           # Data requirements
│   └── *.csv / *.parquet   # Your datasets
├── src/
│   ├── data_loader.py      # Data loading
│   ├── features.py         # Feature engineering
│   └── signals.py          # Signal generation
├── experiments/
│   ├── baseline.yaml       # First run
│   └── exp_001.yaml        # Iterations
├── observations/
│   └── *.md                # Iteration notes
├── checkpoints/
│   └── *.parquet           # Cached features
├── trades/
│   └── *.csv               # Trade logs
├── IDEA.md                 # Initial notes
├── DISCOVERY.md            # Strategy spec
├── RESEARCH.md             # Research findings
├── config.yaml             # Backtest config
├── strategy.py             # Main strategy
├── backtest.py             # Runner
└── .cbt/
    └── state.yaml          # Framework state
```

## Best Practices

### 1. Lookahead Prevention

All features use `.shift(1)` to prevent lookahead bias:

```python
# CORRECT
df['sma'] = df['close'].rolling(20).mean().shift(1)

# WRONG - uses future data!
df['sma'] = df['close'].rolling(20).mean()
```

### 2. One Change Per Iteration

When optimizing, change only one thing at a time. This isolates the impact of each modification.

### 3. Track Observations

Use `/cbt:observe` to capture insights. This builds a knowledge base for your strategy.

### 4. Compare to Baseline

Always compare new experiments to the baseline. If you can't beat baseline, something is wrong.

### 5. Kill Bad Ideas Fast

Define kill criteria upfront. If met, abandon the strategy and move on.

## Example Session

```
> /cbt:new btc_momentum

Strategy 'btc_momentum' created!
Next: /cbt:discover

> /cbt:discover

What is the core edge of this strategy?
> Price momentum following large liquidation events

What data do you need?
> BTC price 1m, liquidation data 1m

[... more questions ...]

Discovery Complete!
Created: DISCOVERY.md
Next: /cbt:research

> /cbt:research

Searching academic literature...
Found 12 relevant papers on liquidation cascades...

Searching GitHub...
Found 3 similar implementations...

Research Complete!
Created: RESEARCH.md
Confidence: Medium
Recommendation: Proceed with caution - edge may decay

> /cbt:config preset binance_futures

Loaded preset: binance_futures
Next: /cbt:build

> /cbt:build

Building: data_pipeline ✓
Building: features ✓
Building: signals ✓
Building: strategy ✓
Running baseline...

Baseline Results:
- Total Return: +23.4%
- Sharpe Ratio: 1.45
- Max Drawdown: -12.3%

> /cbt:iterate

Analyzing exp_001...
Suggestion: Add volatility filter - high vol hurts

What's your observation?
> Try ATR filter to reduce trades in high volatility

Proposed change: Add ATR > 2x filter
Apply? [Y]

Running exp_002...
Sharpe improved: 1.45 → 1.67

Mark as new best? [Y]
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Inspired by the [GSD Framework](https://github.com/get-shit-done-cc)
- Built for [Claude Code](https://claude.ai/claude-code)

---

**Made with AI assistance by [TradeWithAI](https://github.com/TradeWithAI)**
