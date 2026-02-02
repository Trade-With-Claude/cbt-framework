---
name: cbt:observe
description: Save an observation or hypothesis about strategy performance
argument-hint: "<observation>"
allowed-tools:
  - Read
  - Write
  - AskUserQuestion
---

<objective>
Capture an observation, hypothesis, or idea for future testing.
Observations are tracked and can be tested systematically in /cbt:iterate.
</objective>

<execution_context>
@strategies/{active}/.cbt/state.yaml
</execution_context>

<process>

## 1. Get Observation

If observation provided as argument:
- Use provided text

If no argument:
- Prompt user for observation:
  ```
  What observation or hypothesis would you like to save?

  Examples:
  • "Win rate might improve with RSI filter"
  • "Performance drops in high volatility - add vol filter"
  • "Try shorter holding period on ranging days"

  > _
  ```

## 2. Classify Observation

Ask for type:
```
What type of observation is this?
[A] Hypothesis - Something to test
[B] Bug/Issue - Something that needs fixing
[C] Idea - General improvement idea
[D] Note - Just for documentation
```

## 3. Get Context

If hypothesis or idea:
```
What specific change would test this?
(e.g., "Add RSI > 30 check before entry")

> _
```

```
What outcome do you expect?
(e.g., "Higher win rate, fewer trades")

> _
```

## 4. Create Observation File

Generate slug from observation text.
Create `observations/{date}_{slug}.md`:

```markdown
# Observation: {title}

**Date:** 2026-02-01
**Current Experiment:** exp_003
**Type:** Hypothesis

---

## Observation

{user's observation text}

## Context

**Current Performance:**
- Sharpe: 1.67
- Win Rate: 56.3%
- Max DD: -15.2%

**What prompted this:**
{any additional context}

## Proposed Change

{specific modification to test}

## Expected Outcome

{what we expect to happen}

---

## Status: Pending

*To test this observation, run /cbt:iterate and select it from pending observations.*
```

## 5. Update State

Add to pending_observations in state.yaml:

```yaml
pending_observations:
  - "Test with funding rate filter"
  - "Check performance in low vol regime"
  - "{new observation}"  # just added
```

## 6. Confirm

```
Observation saved!

File: observations/2026-02-01_rsi_filter.md
Status: Pending

Current pending observations: 3

To test this observation:
  /cbt:iterate  (will prompt to select pending observation)

Or test immediately:
  /cbt:iterate --observation "rsi_filter"
```

## 7. List Pending (Optional)

If user asks or runs `/cbt:observe list`:

```
Pending Observations:
─────────────────────

1. [2026-01-28] Test with funding rate filter
   Type: Hypothesis
   Expected: Reduce losses during high funding periods

2. [2026-01-30] Check performance in low vol regime
   Type: Hypothesis
   Expected: Better win rate in calm markets

3. [2026-02-01] Add RSI confirmation
   Type: Hypothesis
   Expected: Higher win rate, fewer trades

To test: /cbt:iterate
To view: /cbt:observe show <number>
```

</process>

<success_criteria>
- [ ] Observation text captured
- [ ] Type classified
- [ ] Context gathered (proposed change, expected outcome)
- [ ] File created in observations/
- [ ] State updated with pending observation
- [ ] Clear next steps communicated
</success_criteria>
