<p align="center">
  <h1 align="center">CBT Framework</h1>
  <p align="center">
    <strong>From trading idea to live bot in one conversation.</strong>
    <br />
    The AI-powered backtesting framework for <a href="https://claude.ai/claude-code">Claude Code</a>.
  </p>
  <p align="center">
    <a href="https://badge.fury.io/js/cbt-framework"><img src="https://badge.fury.io/js/cbt-framework.svg" alt="npm version"></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
    <a href="https://github.com/Trade-With-Claude/cbt-framework/stargazers"><img src="https://img.shields.io/github/stars/Trade-With-Claude/cbt-framework?style=social" alt="GitHub stars"></a>
  </p>
</p>

---

## Why CBT?

Most traders waste weeks writing boilerplate, debugging data pipelines, and manually tracking experiments. CBT Framework automates the boring parts so you can focus on what matters: **your edge**.

| Without CBT | With CBT |
|---|---|
| Write backtest engine from scratch | `/cbt:build` generates it |
| Manually track experiments in spreadsheets | `/cbt:compare` does it automatically |
| Guess at parameter optimization | `/cbt:optimize` runs walk-forward analysis |
| Copy-paste code to go live | `/cbt:live` deploys to 4 exchanges |
| Lose context between sessions | `/cbt:clear` saves everything |
| Google library docs constantly | MCP servers give Claude real-time docs + market data |

## Install in 30 Seconds

```bash
npx cbt-framework
```

That's it. This installs **21 commands**, **4 AI agents**, templates for 4 exchanges, and optionally sets up MCP servers for market data and macroeconomic research.

### Requirements

- [Claude Code](https://claude.ai/claude-code) CLI
- Node.js 16+
- Python 3.8+

## The Full Workflow

```
/cbt:new my_strategy          Create strategy (pick YOLO mode + engine)
    |
/cbt:discover                  Define your edge through guided Q&A
    |
/cbt:research                  Validate with literature + GitHub code
    |
/cbt:eda                       Explore data with Seaborn visualizations
    |
/cbt:config + /cbt:plan        Configure params + create build plan
    |
/cbt:build                     Generate strategy code (follows the plan)
    |
/cbt:run                       Execute backtest
    |
/cbt:deep-analyze              Forensic analysis + statistical tests
/cbt:plot                      Signal visualization on candlestick charts
    |
/cbt:optimize                  Parameter optimization (sweep/grid/walk-forward)
    |
/cbt:iterate                   One-change-at-a-time improvement loop
    |
/cbt:report                    Auto-generated living report
    |
/cbt:live                      Deploy to Bybit, Binance, Kraken, Hyperliquid
/cbt:export                    Standalone package for sharing
```

## Quick Start

```bash
# 1. Install
npx cbt-framework

# 2. Open Claude Code in your project folder
claude

# 3. Start building
/cbt:new btc_momentum
/cbt:discover
/cbt:research
/cbt:eda
/cbt:plan
/cbt:build
/cbt:run
/cbt:deep-analyze
```

## Example Session

```
> /cbt:new btc_momentum
  Mode: YOLO | Engine: fast

> /cbt:discover
  Strategy defined. Type: momentum. Data: 5M rows.

> /cbt:eda
  12 Seaborn plots generated. Key finding: strong hourly seasonality.

> /cbt:build
  All steps complete. Baseline: Sharpe 1.45

> /cbt:deep-analyze
  Monte Carlo 95%: positive. Rolling Sharpe: stable.

> /cbt:optimize walkforward
  IS Sharpe: 1.8, OOS Sharpe: 1.5. Robust.

> /cbt:live setup
  Exchange: Bybit. Paper trading started.
```

## All 21 Commands

### Setup
| Command | What it does |
|---------|-------------|
| `/cbt:new <name>` | Create strategy (YOLO mode + engine choice) |
| `/cbt:status` | Show state, mode, engine, progress |
| `/cbt:help` | Show all commands |
| `/cbt:update` | Update to latest version |
| `/cbt:clear` | Save context + prepare for reset |

### Build
| Command | What it does |
|---------|-------------|
| `/cbt:discover` | Strategy Q&A + data scale + project type |
| `/cbt:research` | Literature, implementations, risk analysis |
| `/cbt:eda` | Exploratory data analysis with Seaborn plots |
| `/cbt:config` | Configure backtest parameters |
| `/cbt:plan` | Create step-by-step build plan |
| `/cbt:build` | Generate code (plan-aware, engine-aware) |

### Run & Analyze
| Command | What it does |
|---------|-------------|
| `/cbt:run` | Execute backtest |
| `/cbt:analyze` | Quick text-based analysis |
| `/cbt:deep-analyze` | Forensic analysis with Seaborn + stats tests |
| `/cbt:plot` | Signal/indicator/equity visualization |
| `/cbt:compare` | Compare experiments side by side |

### Optimize & Report
| Command | What it does |
|---------|-------------|
| `/cbt:optimize` | Parameter sweep, grid search, walk-forward |
| `/cbt:iterate` | Guided one-change-at-a-time loop |
| `/cbt:observe` | Save observations and hypotheses |
| `/cbt:report` | Auto-generated living project report |

### Deploy
| Command | What it does |
|---------|-------------|
| `/cbt:live` | Deploy to Bybit, Binance, Kraken, or Hyperliquid |
| `/cbt:export` | Standalone package (zip, git, Docker) |

## Dual Engine

Choose your engine when creating a strategy:

### pandas (default)
Standard pandas + numpy. Best for datasets under 1M rows. Simple and debuggable.

### Fast Engine (Polars + NumPy + Numba)
For large datasets (1M+ rows):
- **Polars** for data loading (lazy evaluation, zero-copy)
- **NumPy** arrays for feature engineering
- **Numba** `@njit` for compiled backtest loops
- No pandas in the hot path

```bash
# Optional: install fast engine dependencies
pip install polars numba numpy
```

## MCP Servers (Data Superpowers)

CBT Framework can set up 3 free MCP servers during installation to give Claude access to external data:

| Server | What it does | API Key |
|--------|-------------|---------|
| **Context7** | Up-to-date library docs (pandas, ccxt, polars...) | None needed |
| **Alpha Vantage** | Stocks, forex, crypto + macro indicators (CPI, GDP, rates) | [Free key](https://www.alphavantage.co/support/#api-key) |
| **FRED** | 840,000+ economic time series from the Federal Reserve | [Free key](https://fred.stlouisfed.org/docs/api/api_key.html) |

This means Claude can pull real market data and macroeconomic indicators while building and analyzing your strategies.

## Live Trading

### Supported Exchanges
- **Bybit** - USDT perpetuals, inverse, spot
- **Binance** - Spot, USDT-M, COIN-M futures
- **Kraken** - Spot, futures
- **Hyperliquid** - Decentralized perpetuals

### Safety Features
- Paper trading mode by default
- Kill switch with configurable drawdown threshold
- Max position size limits
- API rate limiting
- Credentials in `.env` (never hardcoded)

### Notifications
- Discord (webhook)
- Telegram (bot API)
- SMS (Twilio)
- Email (SMTP)

## Project Structure

```
strategies/<name>/
├── Data/               # Datasets
├── IDEA.md             # Initial notes
├── DISCOVERY.md        # Strategy spec from /cbt:discover
├── RESEARCH.md         # Research findings
├── EDA.md              # Exploratory analysis
├── BUILD_PLAN.md       # Build steps from /cbt:plan
├── REPORT.md           # Living report
├── DEEP_ANALYSIS.md    # Forensic analysis
├── config.yaml         # Backtest config
├── src/                # Generated source code
├── strategy.py         # Main strategy
├── backtest.py         # Runner
├── experiments/        # All backtest runs
├── observations/       # Iteration notes
├── plots/              # Visualizations
│   ├── eda/            # EDA plots
│   └── deep_analyze/   # Analysis plots
├── trades/             # Trade logs
└── .cbt/
    ├── state.yaml      # Framework state
    └── handoff.md      # Session handoff
```

## Best Practices

1. **Lookahead Prevention** - Always `.shift(1)` your indicators
2. **One Change Per Iteration** - Change only one thing at a time when optimizing
3. **Paper Trade First** - Always validate before going live
4. **Use EDA** - Let the data inform your strategy before building
5. **Kill Bad Ideas Fast** - Define kill criteria upfront, abandon if met

## Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>If CBT Framework helps your trading, give it a star!</strong>
  <br />
  <a href="https://github.com/Trade-With-Claude/cbt-framework">Star on GitHub</a>
</p>
