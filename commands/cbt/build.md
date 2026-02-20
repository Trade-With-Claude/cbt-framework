---
name: cbt:build
description: Generate strategy code step by step based on build plan
argument-hint: "[status|step <name>|checkpoint]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Task
  - AskUserQuestion
---

<objective>
Execute the build plan step by step, generating code modules, saving checkpoints,
and creating a baseline backtest. Each step is confirmed before proceeding.
Follows BUILD_PLAN.md if available, adapts to engine choice (pandas vs fast).
</objective>

<execution_context>
@strategies/{active}/DISCOVERY.md
@strategies/{active}/RESEARCH.md
@strategies/{active}/EDA.md (if exists)
@strategies/{active}/BUILD_PLAN.md (if exists)
@strategies/{active}/config.yaml
@strategies/{active}/.cbt/state.yaml
@~/.claude/cbt-framework/templates/strategy.py
@~/.claude/cbt-framework/templates/backtest.py
@~/.claude/cbt-framework/templates/fast/ (if fast engine)
@~/.claude/cbt-framework/references/lookahead-prevention.md
</execution_context>

<principles>
- Generate clean, documented code
- Strict lookahead prevention in features
- Test each module before proceeding
- Save checkpoints for expensive computations
- Keep strategy.py clean and readable
- Follow BUILD_PLAN.md when available
- Use correct engine templates (pandas vs fast)
</principles>

<process>

## 1. Parse Arguments

- No args → Resume/continue build
- `status` → Show build progress
- `step <name>` → Jump to specific step
- `checkpoint` → Force save current progress

## 2. Pre-flight Check

### Check for BUILD_PLAN.md
If BUILD_PLAN.md exists → follow its steps
If BUILD_PLAN.md does NOT exist:
- Suggest: "No build plan found. Run /cbt:plan first for a structured build, or continue with auto-generated plan?"
- If YOLO mode or user says continue → use default plan from state.yaml

### Determine Engine
Read engine from state.yaml:
- If `engine: pandas` → use standard pandas templates from `~/.claude/cbt-framework/templates/src/`
- If `engine: fast` → use Polars/NumPy/Numba templates from `~/.claude/cbt-framework/templates/fast/`

## 3. Mode: Status

Display build progress:

```
╔═══════════════════════════════════════════════════════════╗
║  Build Progress                              Engine: {e} ║
╠═══════════════════════════════════════════════════════════╣
║  Step 1: Data Pipeline        [✓] Complete               ║
║          → src/data_loader.py                             ║
║                                                           ║
║  Step 2: Feature Engineering  [✓] Complete               ║
║          → src/features.py                                ║
║          → checkpoints/features.parquet                   ║
║                                                           ║
║  Step 3: Signal Generation    [▶] In Progress            ║
║          → src/signals.py                                 ║
║                                                           ║
║  Step 4: Strategy Integration [ ] Pending                ║
║          → strategy.py                                    ║
║                                                           ║
║  Step 5: Baseline Backtest    [ ] Pending                ║
║          → experiments/baseline.yaml                      ║
╠═══════════════════════════════════════════════════════════╣
║  Progress: 2/5 steps (40%)                               ║
╚═══════════════════════════════════════════════════════════╝
```

## 4. Load Build Plan

### If BUILD_PLAN.md exists:
Parse the step-by-step plan from BUILD_PLAN.md.
Each step has: name, file, dependencies, verification.
Follow the plan exactly.

### If no BUILD_PLAN.md (fallback):
Use default plan from state.yaml based on complexity:

**Simple Strategy:**
1. data_pipeline
2. signals
3. strategy_integration
4. baseline

**Medium Strategy:**
1. data_pipeline
2. features
3. signals
4. strategy_integration
5. baseline

**Complex Strategy:**
1. data_pipeline
2. features
3. labeling
4. model_training
5. signal_generation
6. strategy_integration
7. baseline

## 5. Execute Current Step

### Engine Selection

**For pandas engine:** Use standard pandas-based code generation.
Reference templates: `~/.claude/cbt-framework/templates/src/`

**For fast engine:** Use Polars + NumPy + Numba code generation.
Reference templates: `~/.claude/cbt-framework/templates/fast/`
Key differences:
- `data_loader.py` uses Polars lazy frames, outputs NumPy arrays
- `features.py` operates on NumPy arrays, no pandas
- `signals.py` returns NumPy arrays (directions + confidences)
- `strategy.py` orchestrates array-based pipeline
- `backtest.py` uses Numba @njit compiled loop
- No pandas in the hot path

### Step: data_pipeline

Read Data/README.md for expected files.

**pandas engine:** Generate `src/data_loader.py` using pandas DataFrame loading.
**fast engine:** Generate `src/data_loader.py` using Polars lazy frames + NumPy conversion.

Test: Verify data loads without errors.

### Step: features

**pandas engine:** Generate `src/features.py` with DataFrame operations + .shift(1).
**fast engine:** Generate `src/features.py` with NumPy array operations + shift().

Test: Verify features generate, validate no lookahead.
Save checkpoint: `checkpoints/features.parquet` (pandas) or `checkpoints/features.npy` (fast)

### Step: labeling (if ML strategy)

Generate `src/labeling.py` (same for both engines - uses numpy)

### Step: model_training (if ML strategy)

Generate `src/model.py`
Save checkpoint: `checkpoints/model.pkl`

### Step: signals / signal_generation

**pandas engine:** Generate `src/signals.py` with Signal dataclass.
**fast engine:** Generate `src/signals.py` returning NumPy direction + confidence arrays.

### Step: strategy_integration

**pandas engine:** Generate `strategy.py` integrating DataLoader, FeatureGenerator, SignalGenerator.
**fast engine:** Generate `strategy.py` as FastStrategy with array packaging.

### Step: baseline

**pandas engine:**
1. Copy backtest engine from templates
2. Generate `backtest.py` from template
3. Run baseline

**fast engine:**
1. Generate `backtest.py` with Numba @njit compiled loop
2. First run triggers JIT compilation (warn user about initial delay)
3. Run baseline

Save results to `experiments/baseline.yaml`

## 6. Confirm Before Proceeding

**Interactive mode:**
After each step, show:
```
Step Complete: {step_name}
Output: {files created}

Continue to next step ({next_step})? [Y/n]
```

**YOLO mode:**
Skip confirmations, automatically proceed to next step.
Only pause on errors.

## 7. Update State After Each Step

```yaml
build:
  plan:
    - step: data_pipeline
      status: complete
      output: src/data_loader.py
    - step: features
      status: complete
      output: src/features.py
      checkpoint: checkpoints/features.parquet
    - step: signals
      status: in_progress
      output: null
  current_step: signals
  progress: "2/5"
```

## 8. Build Complete Output

```
Build Complete!

Engine: {pandas / fast}

Files generated:
  - src/data_loader.py
  - src/features.py
  - src/signals.py
  - strategy.py
  - backtest.py

Checkpoints:
  - checkpoints/features.{parquet|npy}

Baseline Results:
  - Total Return: +23.4%
  - Sharpe Ratio: 1.45
  - Max Drawdown: -12.3%
  - Win Rate: 54.2%
  - Total Trades: 127

Saved: experiments/baseline.yaml

Next: /cbt:run or /cbt:iterate
```

</process>

<success_criteria>
- [ ] BUILD_PLAN.md followed if available
- [ ] Correct engine templates used (pandas vs fast)
- [ ] All build steps completed
- [ ] Each module tested before proceeding
- [ ] Checkpoints saved for expensive operations
- [ ] strategy.py integrates all components
- [ ] Baseline backtest run and saved
- [ ] State updated correctly
- [ ] YOLO mode skips confirmations
</success_criteria>
