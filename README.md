# CBT Framework

> **Claude Backtest Framework** - A full strategy lifecycle framework for trading with Claude Code

[![npm version](https://badge.fury.io/js/cbt-framework.svg)](https://badge.fury.io/js/cbt-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

CBT Framework brings structure and discipline to trading strategy development. From initial idea to live deployment, it provides an AI-assisted workflow for building, testing, optimizing, and deploying trading strategies with [Claude Code](https://claude.ai/claude-code).

## Features

- **Structured Discovery** - Define your strategy through guided Q&A
- **Deep Research** - Validate hypotheses with literature and implementation research
- **EDA with Seaborn** - Pre-backtest exploratory data analysis with visualizations
- **Build Planning** - Step-by-step build plans before coding
- **Dual Engine** - pandas (standard) or fast engine (Polars + NumPy + Numba)
- **Deep Analysis** - Post-backtest forensic analysis with statistical tests
- **Signal Plotting** - Visualize signals on candlestick charts with mplfinance
- **Parameter Optimization** - Sweep, grid search, walk-forward optimization
- **Live Deployment** - Deploy to Bybit, Kraken, Binance, or Hyperliquid
- **Notifications** - Discord, Telegram, SMS, Email alerts
- **Standalone Export** - Package for sharing or Raspberry Pi deployment
- **Living Reports** - Auto-populated project documentation
- **YOLO Mode** - Auto-approve steps for maximum speed
- **Context Handoff** - Resume seamlessly after clearing conversation

## Installation

```bash
npx cbt-framework
```

This installs 21 commands, 4 agents, templates, and references into your Claude Code environment.

### Requirements

- [Claude Code](https://claude.ai/claude-code) CLI
- Node.js 16+
- Python 3.8+ (for strategy execution)

### Optional (for fast engine)
```bash
pip install polars numba numpy
```

## Workflow

```
/cbt:new (+ YOLO mode + engine choice)
    │
    ▼
/cbt:discover (+ data scale + project type)
    │
    ▼
/cbt:research
    │
    ▼
/cbt:eda (pre-backtest data analysis with Seaborn)
    │
    ▼
/cbt:config
    │
    ▼
/cbt:plan (step-by-step build plan)
    │
    ▼
/cbt:build (follows plan, uses chosen engine)
    │
    ▼
/cbt:run
    │
    ├──→ /cbt:deep-analyze (forensic analysis)
    ├──→ /cbt:plot (signal visualization)
    ├──→ /cbt:analyze (quick analysis)
    │
    ▼
/cbt:optimize (structured optimization)
    │
    ▼
/cbt:iterate (loop)
    │
    ▼
/cbt:report (living document)
    │
    ├──→ /cbt:export (standalone package)
    └──→ /cbt:live (deploy bot)

/cbt:clear - save context + reset anytime
```

## Quick Start

### 1. Create a New Strategy

```
/cbt:new my_strategy
```

Choose your workflow mode (Interactive or YOLO) and computing engine (pandas or fast).

### 2. Discover Your Strategy

```
/cbt:discover
```

Answer questions about your edge, entry/exit conditions, data requirements, and success criteria.

### 3. Research and Validate

```
/cbt:research
```

### 4. Explore Your Data

```
/cbt:eda
```

Statistical analysis with Seaborn visualizations: distributions, correlations, seasonality, volatility regimes.

### 5. Configure and Plan

```
/cbt:config
/cbt:plan
```

### 6. Build

```
/cbt:build
```

Generates strategy code following the build plan, using the chosen engine.

### 7. Run, Analyze, Optimize

```
/cbt:run
/cbt:deep-analyze
/cbt:optimize
/cbt:iterate
```

### 8. Report, Deploy, Export

```
/cbt:report        # Living project report
/cbt:live          # Deploy to exchange
/cbt:export --zip  # Standalone package
```

## Commands Reference

### Setup (4)
| Command | Description |
|---------|-------------|
| `/cbt:new <name>` | Create strategy (YOLO mode + engine choice) |
| `/cbt:status` | Show state, mode, engine, progress |
| `/cbt:help` | Show all 21 commands |
| `/cbt:clear` | Save handoff context + reset |

### Workflow (8)
| Command | Description |
|---------|-------------|
| `/cbt:discover` | Strategy Q&A + data scale + project type |
| `/cbt:research` | Literature, implementations, risks |
| `/cbt:eda` | Exploratory data analysis with Seaborn |
| `/cbt:config` | Configure backtest parameters |
| `/cbt:plan` | Create step-by-step build plan |
| `/cbt:build` | Generate code (plan-aware, engine-aware) |
| `/cbt:run` | Execute backtest |
| `/cbt:iterate` | Guided one-change-at-a-time loop |

### Analysis (4)
| Command | Description |
|---------|-------------|
| `/cbt:analyze` | Quick text-based analysis |
| `/cbt:deep-analyze` | Forensic analysis with Seaborn plots |
| `/cbt:plot` | Signal/indicator/equity visualization |
| `/cbt:compare` | Compare experiments |

### Optimization & Tracking (3)
| Command | Description |
|---------|-------------|
| `/cbt:optimize` | Parameter sweep, grid, walk-forward |
| `/cbt:observe` | Save observations |
| `/cbt:report` | Living project report |

### Deployment (2)
| Command | Description |
|---------|-------------|
| `/cbt:live` | Deploy as live bot (4 exchanges) |
| `/cbt:export` | Standalone package + Docker |

## Engines

### pandas (default)
Standard pandas + numpy. Best for datasets under 1M rows. Simple, debuggable, familiar.

### Fast (Polars + NumPy + Numba)
For large datasets (1M+ rows):
- **Polars** for data loading (lazy evaluation, zero-copy)
- **NumPy** arrays for feature engineering
- **Numba** @njit for compiled backtest loops
- No pandas in the hot path

## Live Trading

### Supported Exchanges
- **Bybit** - USDT perpetuals, inverse, spot
- **Kraken** - Spot, futures
- **Binance** - Spot, USDT-M, COIN-M futures
- **Hyperliquid** - Decentralized perpetuals

### Safety Features
- Paper trading mode by default
- Kill switch with configurable drawdown threshold
- Max position size limits
- API rate limiting
- Credentials in .env (never hardcoded)

### Notifications
- Discord (webhook)
- Telegram (bot API)
- SMS (Twilio)
- Email (SMTP)

## Project Structure

```
strategies/<name>/
├── Data/               # Datasets
├── IDEA.md            # Initial notes
├── DISCOVERY.md       # Strategy spec
├── RESEARCH.md        # Research findings
├── EDA.md             # Exploratory analysis
├── BUILD_PLAN.md      # Build steps
├── REPORT.md          # Living report
├── DEEP_ANALYSIS.md   # Forensic analysis
├── config.yaml        # Backtest config
├── src/               # Generated code
├── strategy.py        # Main strategy
├── backtest.py        # Runner
├── experiments/       # Backtest runs
├── observations/      # Iteration notes
├── checkpoints/       # Cached data
├── plots/             # Visualizations
│   ├── eda/           # EDA plots
│   └── deep_analyze/  # Analysis plots
├── trades/            # Trade logs
└── .cbt/
    ├── state.yaml     # Framework state
    └── handoff.md     # Session handoff
```

## Best Practices

### 1. Lookahead Prevention
```python
# CORRECT
df['sma'] = df['close'].rolling(20).mean().shift(1)

# WRONG - uses future data!
df['sma'] = df['close'].rolling(20).mean()
```

### 2. One Change Per Iteration
When optimizing, change only one thing at a time.

### 3. Paper Trade First
Always validate with paper trading before going live.

### 4. Use EDA
Let the data inform your strategy before building.

### 5. Kill Bad Ideas Fast
Define kill criteria upfront. If met, abandon and move on.

## Example Session

```
> /cbt:new btc_momentum
Mode: YOLO | Engine: fast

> /cbt:discover
Strategy defined. Type: indicator. Data: 5M rows.
Engine recommendation: fast (confirmed)

> /cbt:eda
12 plots generated. Key finding: strong hourly seasonality.

> /cbt:plan
Build plan: 6 steps (fast engine)

> /cbt:build
All steps complete. Baseline: Sharpe 1.45

> /cbt:deep-analyze
Monte Carlo 95%: positive. Rolling Sharpe: stable.

> /cbt:optimize walkforward
IS Sharpe: 1.8, OOS Sharpe: 1.5. Risk: Low.

> /cbt:report
REPORT.md updated with all findings.

> /cbt:live setup
Exchange: Bybit. Paper trading started.

> /cbt:export --zip
Standalone package: export_strategies/btc_momentum.zip
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Inspired by the [GSD Framework](https://github.com/get-shit-done-cc)
- Built for [Claude Code](https://claude.ai/claude-code)

---

**Made with AI assistance by [TradeWithAI](https://github.com/TradeWithAI)**
