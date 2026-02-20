---
name: cbt:discover
description: Structured Q&A to understand and document your trading strategy
argument-hint: ""
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
---

<objective>
Conduct a structured discovery session to fully understand the trading strategy through targeted questions.
Output a comprehensive DISCOVERY.md that captures the hypothesis, entry/exit logic, data requirements, and build plan.
Engine-aware: detects data scale and recommends fast engine if needed.
</objective>

<execution_context>
@strategies/{active}/IDEA.md (if exists)
@strategies/{active}/.cbt/state.yaml
</execution_context>

<principles>
- Clarity before code - understand fully before building
- Challenge weak hypotheses - don't just accept ideas
- Suggest simpler alternatives if over-engineered
- Be honest about data requirements
- No code in this phase - only documentation
</principles>

<process>

## 1. Find Active Strategy

Locate the strategy folder by finding .cbt/state.yaml.
Read current state to verify we're in discovery phase.
Note the `engine` and `mode` from state.

## 2. Check for IDEA.md

If IDEA.md exists and has content beyond template:
- Read and summarize understanding
- Use it to pre-fill some answers
- Still ask clarifying questions

## 3. Conduct Discovery Q&A

Ask questions in groups (2-3 at a time max). Use AskUserQuestion tool.

### Group 1: The Edge
- "What is the core edge of this strategy? Why do you believe it works?"
- "What market behavior or inefficiency are you trying to exploit?"

### Group 2: Entry Logic
- "What specific conditions must be true to enter a trade?"
- "What data/indicators/features trigger your entry signal?"

### Group 3: Exit Logic
- "How do you exit winning trades? (target, trailing stop, signal reversal)"
- "How do you exit losing trades? (stop loss, time-based, signal)"

### Group 4: Data Requirements
- "What datasets do you need? (price, volume, orderbook, funding, etc.)"
- "What timeframe/resolution? (1m, 5m, 1h, daily)"
- "Do you have this data, or need to source it?"

### Group 5: Validation
- "What results would prove this strategy works? (Sharpe > X, win rate > Y)"
- "What would make you abandon this strategy?"

### Group 6: Data Scale & Project Type
- "How large is your dataset?" → Options:
  - **Small** (<1M rows) - Standard pandas will work fine
  - **Medium** (1-50M rows) - Consider fast engine for speed
  - **Large** (>50M rows) - Fast engine strongly recommended
- "What type of project is this?" → Options:
  - **Indicator/OHLCV-based** - Entry/exit based on technical indicators and price action
  - **ML-based** - Machine learning model for predictions or classification
  - **Hybrid** - Combines indicators with ML components

**Engine recommendation logic:**
- If dataset is medium/large AND engine is currently `pandas`, recommend switching to fast:
  "Your dataset is {size}. The fast engine (Polars + NumPy + Numba) would give significant speedups. Want to switch?"
- If user agrees, update state.yaml `engine: fast` and config.yaml `engine.type: fast`

### Group 7: Account Type & Rules
- "Is this for a prop firm challenge or a personal account?" → Options:
  - **Personal account** - No external rules, standard backtest
  - **Prop firm challenge** - Enforces drawdown limits, daily loss limits, profit targets
- If **Prop firm challenge**:
  - "Which phase?" → Options:
    - **Phase 1** - 10% profit target
    - **Phase 2** - 5% profit target
  - "Confirm default rules or customize?" → Options:
    - **Default rules** - 10% max drawdown, 5% daily loss limit
    - **Custom rules** - Specify your own limits
  - If custom: ask for max drawdown %, daily loss %, and profit target %

**Prop firm config logic:**
- If prop firm selected, update config.yaml:
  - `prop_firm.enabled: true`
  - `prop_firm.phase: {1|2}`
  - `prop_firm.max_drawdown_percent: {value}`
  - `prop_firm.daily_loss_percent: {value}`
- Update state.yaml:
  - `prop_firm.enabled: true`
  - `prop_firm.account_type: prop_firm`

## 4. Assess Complexity

Based on answers, determine build complexity:

**Simple** (rule-based):
- Entry/exit based on indicators or thresholds
- No machine learning
- Steps: data → signals → backtest

**Medium** (feature-based):
- Multiple features combined
- Possible ML classification
- Steps: data → features → signals → backtest

**Complex** (ML pipeline):
- Requires training/validation split
- Walk-forward optimization
- Steps: data → features → labels → model → signals → backtest

## 5. Generate DISCOVERY.md

Create comprehensive document:

```markdown
# Strategy Discovery: {name}

**Date:** {date}
**Phase:** Discovery Complete
**Engine:** {pandas / fast}
**Project Type:** {indicator / ml / hybrid}

---

## Core Hypothesis

{2-3 sentences explaining the edge and why it should work}

### Market Behavior Exploited
{What inefficiency or pattern is being captured}

### Theoretical Basis
{Why this edge exists - behavioral, structural, informational}

---

## Entry Conditions

| Condition | Description | Data Required |
|-----------|-------------|---------------|
| {cond1} | {description} | {data} |
| {cond2} | {description} | {data} |

### Entry Signal Logic
```
{pseudocode or plain english description}
```

---

## Exit Conditions

### Take Profit
{How winners are closed}

### Stop Loss
{How losers are closed}

### Other Exit Conditions
{Time-based, signal reversal, etc.}

---

## Data Requirements

| Dataset | Resolution | Source | Size Estimate | Status |
|---------|------------|--------|---------------|--------|
| {data1} | {timeframe} | {source} | {rows} | [ ] Have / [ ] Need |
| {data2} | {timeframe} | {source} | {rows} | [ ] Have / [ ] Need |

### Data Scale
- **Estimated rows:** {estimate}
- **Engine:** {pandas / fast}
- **Rationale:** {why this engine was chosen}

### Data Validation Checklist
- [ ] No gaps in timestamps
- [ ] Prices are adjusted (if needed)
- [ ] Sufficient history for training/testing

---

## Build Plan

**Complexity Level:** {Simple/Medium/Complex}

| Step | Description | Output |
|------|-------------|--------|
| 1 | {step description} | {output file} |
| 2 | {step description} | {output file} |
| ... | ... | ... |

---

## Success Criteria

- [ ] Sharpe Ratio > {target}
- [ ] Max Drawdown < {threshold}
- [ ] Win Rate > {percentage}
- [ ] {other criteria}

## Account Rules

**Account Type:** {personal / prop_firm}

{If prop firm:}
| Rule | Value |
|------|-------|
| Phase | {1 / 2} |
| Max Drawdown (from initial) | {pct}% |
| Daily Loss Limit (from prev day) | {pct}% |
| Profit Target | {pct}% |
| Breach Action | Halt trading |

---

## Kill Criteria

Abandon strategy if:
- [ ] {condition 1}
- [ ] {condition 2}
- [ ] {condition 3}

---

## Questions for Research Phase

1. {question about edge validity}
2. {question about similar strategies}
3. {question about risks}

---

*Generated by CBT Framework /cbt:discover*
```

## 6. Generate Data/README.md

Update Data/README.md with specific requirements:

```markdown
# Data Requirements for {strategy_name}

## Required Files

| File | Format | Columns | Notes |
|------|--------|---------|-------|
| {file1} | CSV/Parquet | {cols} | {notes} |

## Data Sources

- {source 1}: {url or description}
- {source 2}: {url or description}

## Validation

Run this to validate your data:
```python
# Validation script will be generated in /cbt:build
```
```

## 7. Update State

Update .cbt/state.yaml:
```yaml
phase: research  # or config if skipping research
phases_completed:
  discovery: true
project_type: {indicator|ml|hybrid}
engine: {pandas|fast}  # if changed during discovery
```

## 8. Output Summary

```
Discovery Complete!

Created: DISCOVERY.md
Updated: Data/README.md

Strategy Summary:
- Type: {Simple/Medium/Complex}
- Project: {indicator / ml / hybrid}
- Engine: {pandas / fast}
- Entry: {brief description}
- Exit: {brief description}
- Data needed: {list}

Build Plan: {N} steps

Next: /cbt:eda (recommended) or /cbt:research
```

</process>

<constraints>
- Do NOT write any code
- Do NOT skip questions - each reveals important details
- DO challenge vague or weak hypotheses
- DO suggest simpler approaches if strategy is over-engineered
- DO be honest about data complexity
- DO recommend fast engine for large datasets
</constraints>

<success_criteria>
- [ ] All question groups answered (including Group 6: Data Scale, Group 7: Account Type)
- [ ] DISCOVERY.md created with all sections (including engine + project_type + account rules)
- [ ] Build plan generated based on complexity
- [ ] Data requirements documented with scale estimate
- [ ] Engine recommendation made if applicable
- [ ] Success/kill criteria defined
- [ ] State updated to next phase with project_type
</success_criteria>
