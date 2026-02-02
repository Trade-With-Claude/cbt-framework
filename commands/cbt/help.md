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
/cbt:new → /cbt:discover → /cbt:research → /cbt:config → /cbt:build → /cbt:run → /cbt:iterate
    │           │              │              │             │           │           │
    ▼           ▼              ▼              ▼             ▼           ▼           ▼
 Create     Define         Validate       Configure    Generate    Execute    Optimize
 folder     strategy       hypothesis     backtest       code      backtest    loop
```

## Commands Reference

### Setup
| Command | Description |
|---------|-------------|
| `/cbt:new <name>` | Create new strategy folder with structure |
| `/cbt:status` | Show current state, phase, progress |
| `/cbt:help` | Show this help |

### Phase 1: Discovery
| Command | Description |
|---------|-------------|
| `/cbt:discover` | Q&A to understand and document strategy |

### Phase 2: Research
| Command | Description |
|---------|-------------|
| `/cbt:research` | Deep research (literature, implementations, risks) |
| `/cbt:research literature` | Only academic/blog research |
| `/cbt:research implementations` | Only code/GitHub search |
| `/cbt:research risks` | Only pitfalls and failure modes |

### Phase 3: Configuration
| Command | Description |
|---------|-------------|
| `/cbt:config` | Interactive config setup |
| `/cbt:config show` | Display current config |
| `/cbt:config preset <name>` | Load preset (binance_futures, conservative, aggressive) |

### Phase 4: Build
| Command | Description |
|---------|-------------|
| `/cbt:build` | Start/resume build process |
| `/cbt:build status` | Show build progress |

### Phase 5: Iterate
| Command | Description |
|---------|-------------|
| `/cbt:run` | Run backtest with current config |
| `/cbt:analyze` | Deep analysis of last run |
| `/cbt:observe "<note>"` | Save observation about results |
| `/cbt:compare` | Compare all experiments |
| `/cbt:iterate` | Guided optimization loop |

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

4. Configure backtest parameters:
   ```
   /cbt:config
   ```

5. Build the strategy code:
   ```
   /cbt:build
   ```

6. Run and iterate:
   ```
   /cbt:run
   /cbt:iterate
   ```

## Project Structure

```
strategies/<name>/
├── Data/               # Drop your datasets here
├── IDEA.md            # Your initial notes (optional)
├── DISCOVERY.md       # Q&A output
├── RESEARCH.md        # Research findings
├── config.yaml        # Backtest parameters
├── src/               # Generated code
├── strategy.py        # Main strategy
├── backtest.py        # Runner
├── experiments/       # All backtest runs
├── observations/      # Iteration notes
└── .cbt/state.yaml    # Framework state
```

## Documentation

https://github.com/TradeWithAI/cbt-framework

---

</process>

<success_criteria>
- [ ] Version displayed
- [ ] All commands listed with descriptions
- [ ] Workflow diagram shown
- [ ] Quick start guide included
</success_criteria>
