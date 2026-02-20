# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-02-20

### Added

- **YOLO Mode** - Auto-approve workflow steps for maximum speed. Set during `/cbt:new`.

- **Fast Engine** - Polars + NumPy + Numba for large datasets (1M+ rows):
  - Polars lazy frames for data loading (zero-copy, deferred execution)
  - NumPy array-based feature engineering
  - Numba @njit compiled backtest loop
  - No pandas in the hot path
  - 6 fast engine template files

- **New Commands (9):**
  - `/cbt:eda` - Pre-backtest exploratory data analysis with Seaborn visualizations
  - `/cbt:plan` - Create step-by-step BUILD_PLAN.md before building
  - `/cbt:deep-analyze` - Post-backtest forensic analysis with statistical tests
  - `/cbt:plot` - Signal/indicator/equity visualization with mplfinance
  - `/cbt:optimize` - Structured parameter optimization (sweep, walk-forward, grid, random)
  - `/cbt:report` - Living project report (auto-populated from all docs)
  - `/cbt:live` - Deploy strategy as live trading bot
  - `/cbt:export` - Package strategy as standalone project
  - `/cbt:clear` - Generate handoff context before clearing conversation

- **Live Trading Support:**
  - 4 exchange templates: Bybit, Kraken, Binance, Hyperliquid
  - Cross-exchange support (data from one, signals to another)
  - Paper trading mode by default
  - Kill switch with configurable drawdown threshold
  - Max position size limits

- **Notification Channels:**
  - Discord (webhook)
  - Telegram (bot API)
  - SMS (Twilio)
  - Email (SMTP)

- **EDA Agent** - Specialized agent for data analysis with Seaborn styling guidelines

- **Reference Documentation:**
  - Fast engine guide (Polars, NumPy, Numba patterns and gotchas)
  - Live trading reference (exchange APIs, rate limits, safety checklist)
  - MCP setup guide (Context7, trading data servers)

- **MCP Integration:**
  - Optional Context7 MCP server setup during installation
  - Auto-configuration in `~/.claude/settings.json`

- **Docker Support:**
  - Dockerfile (ARM + x86 compatible for Raspberry Pi)
  - docker-compose.yaml for deployment

### Changed

- `/cbt:new` now asks for YOLO mode and engine choice
- `/cbt:discover` now includes data scale questions and project type detection
- `/cbt:build` is now plan-aware (follows BUILD_PLAN.md) and engine-aware
- `/cbt:status` shows mode, engine, EDA/plan phases, report status, live status, and handoff context
- `/cbt:help` updated with all 21 commands and new workflow diagram
- Status line hook shows YOLO indicator, engine indicator, and live bot status
- State template includes mode, engine, project_type, eda/plan phases, report_file, live status
- Config template includes engine, notifications, and live trading sections

### Workflow Changes

Previous: `new → discover → research → config → build → run → iterate`

New: `new → discover → research → eda → config → plan → build → run → [deep-analyze/plot/analyze] → optimize → iterate → report → [live/export]`

Key additions:
- EDA phase between research and config (data-informed strategy building)
- Plan phase between config and build (structured build planning)
- Deep analysis and plotting after runs (visual forensic analysis)
- Optimization as structured alternative to iterate
- Report as living document throughout lifecycle
- Live deployment and export as final stages

---

## [1.0.0] - 2026-02-02

### Added

- Initial release of CBT Framework
- Core workflow commands:
  - `/cbt:new` - Create new strategy
  - `/cbt:discover` - Strategy discovery Q&A
  - `/cbt:research` - Literature and implementation research
  - `/cbt:config` - Backtest configuration
  - `/cbt:build` - Code generation
  - `/cbt:run` - Execute backtest
  - `/cbt:analyze` - Results analysis
  - `/cbt:iterate` - Optimization loop
  - `/cbt:compare` - Experiment comparison
  - `/cbt:observe` - Save observations
  - `/cbt:status` - Show status
  - `/cbt:help` - Help reference
  - `/cbt:update` - Framework updates

- Pure Python backtest engine:
  - No external backtesting library dependencies
  - Realistic fee and slippage modeling
  - Stop loss, take profit, trailing stops
  - Comprehensive metrics calculation

- Template system:
  - Strategy template with position management
  - Data loader with validation
  - Feature generator with lookahead prevention
  - Signal generator with confidence scoring
  - Backtest runner

- Configuration presets:
  - `binance_futures` - Binance USDT-M Futures
  - `binance_spot` - Binance spot trading
  - `conservative` - Lower risk settings
  - `aggressive` - Higher risk settings

- Reference documentation:
  - Lookahead prevention guide
  - Metrics reference
  - Strategy types guide

- State management:
  - Phase tracking
  - Experiment tracking
  - Build progress
  - Observation management

### Notes

This is the initial release. The framework is designed for:
- Systematic strategy development
- AI-assisted workflow with Claude Code
- Reproducible backtesting
- Continuous improvement through iteration
