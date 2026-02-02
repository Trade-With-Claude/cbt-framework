# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

---

## Future Roadmap

- [ ] `/cbt:export` - Export strategy to standalone package
- [ ] `/cbt:live` - Paper trading integration
- [ ] `/cbt:optimize` - Parameter optimization
- [ ] `/cbt:report` - Generate PDF reports
- [ ] Multi-asset support
- [ ] Portfolio-level backtesting
