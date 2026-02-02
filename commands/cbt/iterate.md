---
name: cbt:iterate
description: Guided optimization loop - analyze, observe, apply, run, compare
argument-hint: ""
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - AskUserQuestion
  - Task
---

<objective>
Run a guided iteration loop to systematically improve strategy performance.
Each cycle: analyze → observe → apply change → run → compare results.
</objective>

<execution_context>
@strategies/{active}/.cbt/state.yaml
@strategies/{active}/strategy.py
@strategies/{active}/config.yaml
@strategies/{active}/experiments/
</execution_context>

<principles>
- One change at a time - isolate variables
- Always compare to baseline and best
- Track observation → result mapping
- Warn after 3+ iterations without improvement
- Kill bad ideas fast - don't over-optimize
</principles>

<process>

## 1. Check Prerequisites

Verify:
- Baseline exists
- At least one experiment run
- strategy.py exists

If not, guide to appropriate command.

## 2. Load Current State

- Current experiment
- Best experiment
- Baseline metrics
- Pending observations from state

## 3. Start Iteration Cycle

### Step 1: Analyze

Run analysis on current/last experiment:

```
Analyzing exp_003...

Quick Summary:
• Sharpe: 1.67 (baseline: 1.45, best: 1.67)
• Win Rate: 56.3%
• Key Issue: High vol periods hurt performance

[Full analysis available with /cbt:analyze]
```

### Step 2: Observe

Check for pending observations first:

```
Pending observations to test:
1. "Test with funding rate filter"
2. "Check performance in low vol regime"

Would you like to:
[A] Test pending observation #1
[B] Test pending observation #2
[C] Enter new observation
[D] Skip to run with current config
```

If new observation:
```
What's your observation or hypothesis?
Example: "Win rate might improve if we add RSI confirmation"

> _
```

Save observation to `observations/{date}_{slug}.md`:

```markdown
# Observation: {title}

**Date:** 2026-02-01
**Experiment:** exp_003
**Type:** Hypothesis

## Observation
{user's observation}

## Proposed Change
{what to modify}

## Expected Outcome
{what we expect to happen}

---

## Results (filled after testing)
**Tested in:** exp_004
**Outcome:** {pending}
```

### Step 3: Apply

Based on observation, propose specific code/config change:

```
Proposed Change:
────────────────

File: src/signals.py
Type: Add RSI confirmation filter

Diff:
  def generate(self, features: pd.DataFrame, idx: int) -> Signal:
      # Existing entry logic
      entry_condition = features['signal'].iloc[idx] > 0

+     # Add RSI confirmation
+     rsi = features['rsi'].iloc[idx]
+     rsi_ok = 30 < rsi < 70  # Not overbought/oversold
+
+     if entry_condition and rsi_ok:
-     if entry_condition:
          return Signal(direction=1, confidence=0.8)

Apply this change? [Y/n/edit]
```

If user approves, apply the edit.
If user wants to edit, allow modification.

### Step 4: Run

Execute backtest:

```
Running backtest...

Parameters:
- Config: config.yaml (unchanged)
- Strategy: Modified (RSI filter added)

[████████████████████░░░░] 80%
```

Save as new experiment (exp_004).

### Step 5: Compare

Show comparison:

```
╔═══════════════════════════════════════════════════════════════════════╗
║  Comparison: exp_004 vs exp_003 vs baseline                          ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  Metric              exp_004      exp_003     baseline    best        ║
║  ─────────────────────────────────────────────────────────────────    ║
║  Total Return        +31.2%       +34.5%      +23.4%      +34.5%     ║
║  Sharpe Ratio        1.89 ▲       1.67        1.45        1.67       ║
║  Max Drawdown        -11.8% ▲     -15.2%      -12.3%      -15.2%     ║
║  Win Rate            61.2% ▲      56.3%       54.2%       56.3%      ║
║  Total Trades        98 ▼         143         127         143        ║
║  Profit Factor       2.14 ▲       1.82        1.54        1.82       ║
║                                                                       ║
║  Change Impact:                                                       ║
║  • Sharpe improved +0.22 (1.67 → 1.89)                               ║
║  • Drawdown reduced from -15.2% to -11.8%                            ║
║  • Trade count reduced by 31% (filtering out weak signals)           ║
║  • Win rate improved +4.9%                                            ║
║                                                                       ║
║  Assessment: ★ IMPROVEMENT - Better risk-adjusted returns            ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝

What would you like to do?
[A] Mark exp_004 as new best
[B] Continue iterating
[C] Revert change and try something else
[D] Stop iteration
```

### Step 6: Update Observation

Update the observation file with results:

```markdown
## Results
**Tested in:** exp_004
**Outcome:** Success

### Metrics Change
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Sharpe | 1.67 | 1.89 | +0.22 |
| Max DD | -15.2% | -11.8% | +3.4% |
| Win Rate | 56.3% | 61.2% | +4.9% |

### Conclusion
RSI filter improved risk-adjusted returns. Keep this change.
```

## 4. Track Iteration History

Maintain iteration tracking in state.yaml:

```yaml
iterations:
  - experiment: exp_004
    observation: "RSI confirmation filter"
    result: improvement
    sharpe_delta: +0.22
  - experiment: exp_003
    observation: "Increased leverage"
    result: mixed
    sharpe_delta: +0.22
```

## 5. Warn on Stagnation

If 3+ iterations without improvement:

```
⚠️  Warning: 3 iterations without improvement

Consider:
- Reviewing the core hypothesis
- Trying a fundamentally different approach
- Accepting current performance as optimal for this strategy

Continue anyway? [Y/n]
```

## 6. Continue Loop

After comparison, if user chooses to continue:
- Return to Step 1 (Analyze)
- Use new experiment as current

</process>

<success_criteria>
- [ ] Analysis shown before each iteration
- [ ] Observation captured and saved
- [ ] Change clearly proposed with diff
- [ ] Single variable changed per iteration
- [ ] Comparison shows all relevant metrics
- [ ] Observation file updated with results
- [ ] User can mark new best or revert
</success_criteria>
