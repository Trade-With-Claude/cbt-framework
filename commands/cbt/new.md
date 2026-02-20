---
name: cbt:new
description: Create new strategy folder with proper structure
argument-hint: "<strategy_name>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - AskUserQuestion
---

<objective>
Create a new strategy folder with the complete CBT Framework structure, ready for the discovery phase.
Ask the user about workflow preferences (YOLO mode + engine choice) before finalizing.
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

## 3. Workflow Preferences

Ask the user about their preferred workflow using AskUserQuestion:

### Question 1: Work Mode
"How do you want to work?"
- **Interactive** (default) - Confirm each step, review outputs, guided workflow
- **YOLO** - Auto-approve steps, minimal confirmations, maximum speed

### Question 2: Computing Engine
"What computing engine should we use?"
- **pandas** (default) - Standard pandas + numpy. Good for datasets under 1M rows. Simple, debuggable, familiar.
- **Fast** - Polars + NumPy + Numba. For large datasets (1M+ rows). Faster execution, compiled backtest loops, lazy evaluation.

Store the choices for state.yaml.

## 4. Create Directory Structure

Create the following structure:

```
strategies/{name}/
├── Data/
│   └── README.md
├── src/
├── experiments/
├── observations/
├── checkpoints/
├── plots/
│   ├── eda/
│   └── deep_analyze/
├── .cbt/
│   └── state.yaml
├── IDEA.md
└── config.yaml
```

## 5. Create Files

### Data/README.md
Use template from @~/.claude/cbt-framework/templates/data-readme.md

### .cbt/state.yaml
```yaml
strategy: {name}
created: {current_date}
last_updated: {current_date}

mode: {interactive|yolo}
engine: {pandas|fast}
project_type: null

phase: discovery
phases_completed:
  discovery: false
  research: false
  eda: false
  config: false
  plan: false
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
iterations: []

report_file: null

live:
  deployed: false
  exchange: null
  mode: null
```

### IDEA.md
Use template from @~/.claude/cbt-framework/templates/idea.md
Replace {name} placeholder.

### config.yaml
Use template from @~/.claude/cbt-framework/templates/config.yaml
Set `engine.type` based on user choice.

## 6. Output Success Message

```
Strategy '{name}' created successfully!

Location: strategies/{name}/

Mode:   {Interactive / YOLO}
Engine: {pandas / Fast (Polars + NumPy + Numba)}

Next steps:
1. (Optional) Edit IDEA.md with your initial thoughts
2. Drop your data files into Data/
3. Run /cbt:discover to define your strategy

Structure created:
  Data/           - Place your datasets here
  plots/          - Charts and visualizations
  IDEA.md         - Your initial notes
  config.yaml     - Backtest parameters (configure later)
  .cbt/state.yaml - Framework state tracking
```

If YOLO mode was selected, add:
```
YOLO mode enabled - steps will auto-approve where possible.
```

If fast engine was selected, add:
```
Fast engine selected - will use Polars for data loading,
NumPy arrays for features, and Numba for backtest execution.
Make sure to install: pip install polars numba numpy
```

</process>

<success_criteria>
- [ ] Strategy name validated
- [ ] Workflow preferences collected (mode + engine)
- [ ] All directories created (including plots/eda/ and plots/deep_analyze/)
- [ ] All template files created with correct content
- [ ] State initialized to discovery phase with mode/engine
- [ ] Config engine.type set correctly
- [ ] Clear next steps communicated
</success_criteria>
