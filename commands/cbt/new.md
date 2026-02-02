---
name: cbt:new
description: Create new strategy folder with proper structure
argument-hint: "<strategy_name>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
---

<objective>
Create a new strategy folder with the complete CBT Framework structure, ready for the discovery phase.
</objective>

<execution_context>
@~/.claude/cbt-framework/templates/config.yaml
@~/.claude/cbt-framework/templates/state.yaml
@~/.claude/cbt-framework/templates/idea.md
@~/.claude/cbt-framework/templates/data-readme.md
</execution_context>

<process>

## 1. Parse Arguments

Extract strategy name from user input.
- Convert to lowercase
- Replace spaces with underscores
- Validate: only letters, numbers, underscores allowed

If no name provided, ask user for strategy name.

## 2. Check for Existing Strategy

```bash
ls -la strategies/{name} 2>/dev/null
```

If exists, warn user and ask to confirm overwrite or choose different name.

## 3. Create Directory Structure

Create the following structure:

```
strategies/{name}/
├── Data/
│   └── README.md
├── src/
├── experiments/
├── observations/
├── checkpoints/
├── .cbt/
│   └── state.yaml
├── IDEA.md
└── config.yaml
```

## 4. Create Files

### Data/README.md
Use template from @~/.claude/cbt-framework/templates/data-readme.md

### .cbt/state.yaml
```yaml
strategy: {name}
created: {current_date}
last_updated: {current_date}

phase: discovery
phases_completed:
  discovery: false
  research: false
  config: false
  build: false

build:
  plan: []
  current_step: null
  progress: "0/0"

experiments:
  count: 0
  current: null
  best: null
  baseline_sharpe: null

pending_observations: []
```

### IDEA.md
Use template from @~/.claude/cbt-framework/templates/idea.md
Replace {name} placeholder.

### config.yaml
Use template from @~/.claude/cbt-framework/templates/config.yaml

## 5. Output Success Message

```
Strategy '{name}' created successfully!

Location: strategies/{name}/

Next steps:
1. (Optional) Edit IDEA.md with your initial thoughts
2. Drop your data files into Data/
3. Run /cbt:discover to define your strategy

Structure created:
  Data/           - Place your datasets here
  IDEA.md         - Your initial notes
  config.yaml     - Backtest parameters (configure later)
  .cbt/state.yaml - Framework state tracking
```

</process>

<success_criteria>
- [ ] Strategy name validated
- [ ] All directories created
- [ ] All template files created with correct content
- [ ] State initialized to discovery phase
- [ ] Clear next steps communicated
</success_criteria>
