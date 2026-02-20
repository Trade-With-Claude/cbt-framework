---
name: cbt:export
description: Package strategy as a standalone project for sharing or deployment
argument-hint: "[--zip] [--git]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - AskUserQuestion
---

<objective>
Package a completed strategy into a clean, standalone project that can be shared,
deployed to a Raspberry Pi, or pushed to GitHub. Strips CBT framework dependencies
and generates clean documentation.
</objective>

<execution_context>
@strategies/{active}/.cbt/state.yaml
@strategies/{active}/config.yaml
@strategies/{active}/REPORT.md (if exists)
@strategies/{active}/DISCOVERY.md
@strategies/{active}/strategy.py
@strategies/{active}/backtest.py
@strategies/{active}/src/
</execution_context>

<process>

## 1. Parse Arguments

- `--zip` → Also create a .zip archive
- `--git` → Initialize as git repo with first commit
- No flags → Create folder only, ask about zip and git

## 2. Pre-flight Checks

Verify strategy is built and functional:
- [ ] strategy.py exists
- [ ] backtest.py exists
- [ ] src/ directory has files
- [ ] At least one experiment exists
- [ ] config.yaml is configured

Warn if strategy hasn't been iterated (only baseline exists).

## 3. Determine Export Contents

Collect all files needed for standalone operation:

### Always included:
- `src/data_loader.py`
- `src/features.py`
- `src/signals.py`
- `src/__init__.py` (create if missing)
- `strategy.py`
- `backtest.py`
- `config.yaml` (production version - strip dev comments)

### Conditionally included:
- `src/labeling.py` (if ML strategy)
- `src/model.py` (if ML strategy)
- `checkpoints/model.pkl` (if ML strategy)
- `live_bot.py` (if /cbt:live was used)
- `exchange_client.py` (if /cbt:live was used)
- `notifications.py` (if /cbt:live was used)

### Generated:
- `README.md` (from REPORT.md or DISCOVERY.md)
- `requirements.txt` (from strategy imports)
- `.env.template` (if live bot included)
- `.gitignore`
- `Dockerfile`
- `docker-compose.yaml`
- `setup.py` (optional, if user wants to publish)

## 4. Create Export Structure

```
export_strategies/{strategy_name}/
├── README.md            # Auto-generated from REPORT.md
├── requirements.txt     # All Python dependencies
├── .env.template        # API keys placeholder (if live)
├── .gitignore
├── config.yaml          # Production config
├── src/
│   ├── __init__.py
│   ├── data_loader.py
│   ├── features.py
│   ├── signals.py
│   └── {labeling.py}   # If ML
│   └── {model.py}      # If ML
├── backtest.py          # Standalone backtest runner
├── {live.py}            # If /cbt:live was used
├── Dockerfile           # ARM + x86 compatible
└── docker-compose.yaml
```

## 5. Generate README.md

If REPORT.md exists → adapt it for public consumption:
- Remove internal notes and CBT-specific references
- Add installation instructions
- Add usage examples
- Add disclaimer

If REPORT.md doesn't exist → generate from DISCOVERY.md:

```markdown
# {Strategy Name}

{Strategy description from DISCOVERY.md}

## Quick Start

### Installation
```bash
pip install -r requirements.txt
```

### Running Backtest
```bash
python backtest.py
```

### Configuration
Edit `config.yaml` to adjust parameters:
- Position sizing
- Risk management (stop loss, take profit)
- Leverage settings
- Fee structure

### Live Trading
{If live bot included:}
```bash
# 1. Set up credentials
cp .env.template .env
# Edit .env with your API keys

# 2. Paper trade first
python live.py --paper

# 3. Go live (after paper validation)
python live.py --live
```

### Docker Deployment
```bash
docker compose up -d
```

## Strategy Overview

**Edge:** {from DISCOVERY.md}
**Entry:** {summary}
**Exit:** {summary}

## Performance

{From best experiment:}
| Metric | Value |
|--------|-------|
| Sharpe Ratio | {val} |
| Total Return | {val}% |
| Max Drawdown | {val}% |
| Win Rate | {val}% |

## Disclaimer

This strategy is for educational purposes. Past performance does not
guarantee future results. Trade at your own risk.

---

*Built with [CBT Framework](https://github.com/TradeWithAI/cbt-framework)*
```

## 6. Generate requirements.txt

Scan all Python files for imports and generate:

**For pandas engine:**
```
pandas>=2.0.0
numpy>=1.24.0
PyYAML>=6.0
matplotlib>=3.7.0
seaborn>=0.13.0
```

**For fast engine:**
```
polars>=0.20.0
numba>=0.59.0
numpy>=1.24.0
PyYAML>=6.0
matplotlib>=3.7.0
seaborn>=0.13.0
```

**If live bot:**
```
ccxt>=4.0.0
python-dotenv>=1.0.0
requests>=2.31.0
```

## 7. Generate Dockerfile

```dockerfile
# Multi-arch: supports x86_64 and ARM (Raspberry Pi)
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Default: run backtest
CMD ["python", "backtest.py"]
```

## 8. Generate .gitignore

```
.env
.env.local
__pycache__/
*.pyc
*.pyo
.pytest_cache/
*.egg-info/
dist/
build/
logs/
*.log
checkpoints/
```

## 9. Clean Config for Production

Copy config.yaml but:
- Remove CBT-specific comments
- Remove development notes
- Keep only production-relevant settings
- Ensure no credentials in config

## 10. Create Zip (if --zip)

```bash
cd export_strategies/
zip -r {strategy_name}.zip {strategy_name}/
```

## 11. Initialize Git (if --git)

```bash
cd export_strategies/{strategy_name}/
git init
git add .
git commit -m "Initial commit: {strategy_name} strategy"
```

## 12. Output

```
Export complete!

Folder: export_strategies/{strategy_name}/
{If zip: "Archive: export_strategies/{strategy_name}.zip"}
{If git: "Git repo initialized with first commit."}

Contents:
  - README.md (auto-generated)
  - requirements.txt
  - Source code ({N} files)
  - Config (production)
  - Dockerfile + docker-compose.yaml
  {- Live bot code}

Ready to:
  - Push to GitHub: cd export_strategies/{name} && git remote add origin <url> && git push
  - Share as zip: send {name}.zip
  - Deploy: docker compose up -d
```

</process>

<constraints>
- DO strip all CBT framework internal references
- DO generate clean, standalone documentation
- DO ensure no credentials in exported files
- DO make Dockerfile ARM-compatible (for Raspberry Pi)
- DO create __init__.py if missing
- DO NOT include .cbt/ directory in export
- DO NOT include experiments/ or observations/ (these are dev artifacts)
- DO NOT include raw data files (they may be large/proprietary)
</constraints>

<success_criteria>
- [ ] Clean standalone folder created
- [ ] README.md generated from project docs
- [ ] requirements.txt complete
- [ ] All source files copied
- [ ] Config stripped of dev comments
- [ ] No credentials in any exported file
- [ ] Dockerfile works for ARM + x86
- [ ] .gitignore included
- [ ] Optional: zip created
- [ ] Optional: git initialized
</success_criteria>
