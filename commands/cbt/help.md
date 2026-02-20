---
name: cbt:help
description: Show all CBT Framework commands and usage guide
argument-hint: ""
allowed-tools:
  - Read
---

<objective>
Display comprehensive help for CBT Framework including all commands, workflow overview, and quick start guide.
</objective>

<execution_context>
@~/.claude/cbt-framework/VERSION
</execution_context>

<process>

## Read Version

```bash
cat ~/.claude/cbt-framework/VERSION 2>/dev/null || echo "unknown"
```

## Display Help

Output the following help content:

---

# CBT Framework - Claude Backtest Framework

**Version:** {version from above}

## Workflow Overview

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
/cbt:eda (pre-backtest data analysis)
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
    ├──→ /cbt:deep-analyze (forensic analysis + Seaborn)
    ├──→ /cbt:plot (signal visualization)
    ├──→ /cbt:analyze (quick pattern analysis)
    │
    ▼
/cbt:optimize (structured parameter optimization)
    │
    ▼
/cbt:iterate (loop)
    │
    ▼
/cbt:report (living document)
    │
    ├──→ /cbt:export (standalone package)
    └──→ /cbt:live (deploy bot + notifications)

/cbt:clear - save context + reset anytime
```

## Commands Reference

### Setup
| Command | Description |
|---------|-------------|
| `/cbt:new <name>` | Create new strategy (asks YOLO mode + engine choice) |
| `/cbt:status` | Show current state, phase, mode, engine |
| `/cbt:help` | Show this help |
| `/cbt:clear` | Save handoff context + prepare for /clear |

### Phase 1: Discovery
| Command | Description |
|---------|-------------|
| `/cbt:discover` | Q&A to understand strategy + data scale + project type |

### Phase 2: Research
| Command | Description |
|---------|-------------|
| `/cbt:research` | Deep research (literature, implementations, risks) |
| `/cbt:research literature` | Only academic/blog research |
| `/cbt:research implementations` | Only code/GitHub search |
| `/cbt:research risks` | Only pitfalls and failure modes |

### Phase 3: EDA (New)
| Command | Description |
|---------|-------------|
| `/cbt:eda` | Exploratory data analysis with Seaborn visualizations |

### Phase 4: Configuration
| Command | Description |
|---------|-------------|
| `/cbt:config` | Interactive config setup |
| `/cbt:config show` | Display current config |
| `/cbt:config preset <name>` | Load preset (binance_futures, conservative, aggressive) |

### Phase 5: Planning (New)
| Command | Description |
|---------|-------------|
| `/cbt:plan` | Create step-by-step BUILD_PLAN.md before building |

### Phase 6: Build
| Command | Description |
|---------|-------------|
| `/cbt:build` | Start/resume build (follows plan, adapts to engine) |
| `/cbt:build status` | Show build progress |

### Phase 7: Run & Analyze
| Command | Description |
|---------|-------------|
| `/cbt:run` | Run backtest with current config |
| `/cbt:analyze` | Quick text-based analysis of last run |
| `/cbt:deep-analyze` | Deep forensic analysis with Seaborn plots |
| `/cbt:plot [mode]` | Signal/indicator/equity visualization |
| `/cbt:observe "<note>"` | Save observation about results |
| `/cbt:compare` | Compare all experiments |

### Phase 8: Optimize & Iterate
| Command | Description |
|---------|-------------|
| `/cbt:optimize` | Structured parameter optimization |
| `/cbt:optimize sweep` | Single parameter sweep |
| `/cbt:optimize walkforward` | Walk-forward optimization |
| `/cbt:optimize grid` | Grid search over parameter space |
| `/cbt:iterate` | Guided one-change-at-a-time loop |

### Reporting
| Command | Description |
|---------|-------------|
| `/cbt:report` | Create/update living project report |
| `/cbt:report init` | Create initial report |
| `/cbt:report update` | Refresh all sections |
| `/cbt:report add <section>` | Add custom section |

### Deployment
| Command | Description |
|---------|-------------|
| `/cbt:live` | Deploy as live trading bot |
| `/cbt:live setup` | Configure exchange + notifications |
| `/cbt:live paper` | Start paper trading |
| `/cbt:live live` | Switch to live trading |
| `/cbt:export` | Package as standalone project |
| `/cbt:export --zip` | Also create zip archive |
| `/cbt:export --git` | Initialize as git repo |

### Utility
| Command | Description |
|---------|-------------|
| `/cbt:update` | Update CBT Framework to latest |

## Quick Start

1. Create a new strategy:
   ```
   /cbt:new liquidation_cascade
   ```

2. Define your strategy through Q&A:
   ```
   /cbt:discover
   ```

3. Research and validate:
   ```
   /cbt:research
   ```

4. Explore your data:
   ```
   /cbt:eda
   ```

5. Configure backtest parameters:
   ```
   /cbt:config
   ```

6. Plan the build:
   ```
   /cbt:plan
   ```

7. Build the strategy code:
   ```
   /cbt:build
   ```

8. Run and iterate:
   ```
   /cbt:run
   /cbt:deep-analyze
   /cbt:iterate
   ```

9. Generate report:
   ```
   /cbt:report
   ```

10. Deploy or export:
    ```
    /cbt:live    (deploy to exchange)
    /cbt:export  (standalone package)
    ```

## Modes

### YOLO Mode
Skip confirmations, auto-approve steps. Set during `/cbt:new`.

### Engines
- **pandas** - Standard. Good for <1M rows. Simple and debuggable.
- **fast** - Polars + NumPy + Numba. For 1M+ rows. Compiled backtest loops.

## Project Structure

```
strategies/<name>/
├── Data/               # Datasets
├── IDEA.md            # Initial notes
├── DISCOVERY.md       # Strategy spec
├── RESEARCH.md        # Research findings
├── EDA.md             # Exploratory data analysis
├── BUILD_PLAN.md      # Step-by-step build plan
├── REPORT.md          # Living project report
├── DEEP_ANALYSIS.md   # Forensic analysis
├── config.yaml        # Backtest config
├── src/               # Generated code
├── strategy.py        # Main strategy
├── backtest.py        # Runner
├── experiments/       # All backtest runs
├── observations/      # Iteration notes
├── checkpoints/       # Cached data
├── plots/             # Visualizations
│   ├── eda/           # EDA plots
│   └── deep_analyze/  # Analysis plots
├── trades/            # Trade logs
└── .cbt/
    ├── state.yaml     # Framework state
    └── handoff.md     # Session handoff (from /cbt:clear)
```

## MCP Servers (Data Superpowers)

CBT Framework can install 3 free MCP servers to give Claude access to external data:

| MCP Server | What it does | API Key |
|------------|-------------|---------|
| **Context7** | Up-to-date library docs (pandas, ccxt, polars...) | None needed |
| **Alpha Vantage** | Stocks, forex, crypto + macro data (CPI, GDP, rates) | Free at alphavantage.co |
| **FRED** | 840,000+ economic time series from the Federal Reserve | Free at fred.stlouisfed.org |

Run `npx cbt-framework` to set them up, or edit `~/.claude/.mcp.json` manually.
See full details: `~/.claude/cbt-framework/references/mcp-setup.md`

## Documentation

https://github.com/Trade-With-Claude/cbt-framework

---

</process>

<success_criteria>
- [ ] Version displayed
- [ ] All 21 commands listed with descriptions
- [ ] Workflow diagram shows new phases (EDA, Plan)
- [ ] Modes section explains YOLO and engines
- [ ] Quick start includes new steps
- [ ] Deployment section included
- [ ] Updated project structure shown
</success_criteria>
