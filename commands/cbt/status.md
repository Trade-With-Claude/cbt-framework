---
name: cbt:status
description: Show current strategy state, phase, and progress
argument-hint: ""
allowed-tools:
  - Read
  - Bash
  - Glob
---

<objective>
Display comprehensive status of the current strategy including phase, progress, mode, engine,
experiments, and suggested next action. Detects handoff.md for context recovery after /cbt:clear.
</objective>

<execution_context>
Read state from the active strategy's .cbt/state.yaml
</execution_context>

<process>

## 1. Find Active Strategy

Look for strategies/ directory and .cbt/state.yaml:

```bash
find strategies -name "state.yaml" -path "*/.cbt/*" 2>/dev/null | head -5
```

If multiple strategies exist, check for most recently modified.
If no strategy found, suggest running `/cbt:new`.

## 2. Check for Handoff

Check if `.cbt/handoff.md` exists:
- If YES → Read and display handoff context prominently at top
- This means the user ran `/cbt:clear` in a previous session
- Display: "Resuming from previous session:" + handoff summary

## 3. Load State

Read the state.yaml file and parse:
- strategy name
- mode (yolo / interactive)
- engine (pandas / fast)
- project_type (indicator / ml / hybrid)
- current phase
- phases completed (including eda, plan)
- build progress
- experiments info
- pending observations
- report status
- live deployment status

## 4. Gather Additional Info

Check for existence of:
- DISCOVERY.md
- RESEARCH.md
- EDA.md
- BUILD_PLAN.md
- REPORT.md
- DEEP_ANALYSIS.md
- strategy.py
- experiments/*.yaml (count)
- Data/* files
- plots/* files
- .cbt/handoff.md

## 5. Calculate Progress

Determine overall progress:
- Discovery: 15%
- Research: 25%
- EDA: 35%
- Config: 45%
- Plan: 55%
- Build: 75%
- Iterate: 100% (ongoing)

## 6. Display Status

### If Handoff Exists (show first):

```
╔══════════════════════════════════════════════════════════════╗
║  Resuming from Previous Session                              ║
╠══════════════════════════════════════════════════════════════╣
║  {handoff summary - what was being worked on}                ║
║  Suggested: /cbt:{next_command}                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Main Status:

```
╔══════════════════════════════════════════════════════════════╗
║  CBT Framework - Strategy Status                             ║
╠══════════════════════════════════════════════════════════════╣
║  Strategy: {name}                                            ║
║  Phase: {phase}                                              ║
║  Mode: {YOLO / Interactive}  |  Engine: {pandas / fast}      ║
║  Type: {indicator / ml / hybrid}                             ║
║  Progress: [████████░░░░░░░░░░░░] 40%                       ║
╠══════════════════════════════════════════════════════════════╣
║  Phases:                                                     ║
║    [✓] Discovery    - DISCOVERY.md created                   ║
║    [✓] Research     - RESEARCH.md created                    ║
║    [✓] EDA          - EDA.md + {N} plots                     ║
║    [ ] Config       - config.yaml (defaults)                 ║
║    [ ] Plan         - Not started                            ║
║    [ ] Build        - Not started                            ║
║    [ ] Iterate      - 0 experiments                          ║
╠══════════════════════════════════════════════════════════════╣
║  Data Files: {count} files in Data/                          ║
║  Experiments: {count} runs, best Sharpe: {best}              ║
║  Pending: {observations_count} observations to explore       ║
║  Report: {REPORT.md exists ? "✓" : "not created"}           ║
║  Plots: {count} files in plots/                              ║
{If live deployed:}
║  Live: {exchange} ({paper/live mode})                        ║
╠══════════════════════════════════════════════════════════════╣
║  Suggested: /cbt:{next_command}                              ║
╚══════════════════════════════════════════════════════════════╝
```

## 7. YOLO Mode Indicator

If YOLO mode is active, add visual indicator:
```
║  Mode: YOLO ⚡  |  Engine: fast ⚡                           ║
```

## 8. Route to Next Action

Based on state, suggest:
- If discovery not done → `/cbt:discover`
- If research not done → `/cbt:research` (or skip to `/cbt:eda`)
- If EDA not done → `/cbt:eda` (recommended) or `/cbt:config`
- If config defaults → `/cbt:config`
- If plan not done → `/cbt:plan`
- If build not done → `/cbt:build`
- If baseline exists → `/cbt:run` or `/cbt:iterate`
- If experiments exist → `/cbt:deep-analyze` or `/cbt:iterate`
- If many experiments → `/cbt:report` or `/cbt:optimize`

</process>

<success_criteria>
- [ ] Active strategy identified
- [ ] Handoff.md detected and displayed if present
- [ ] Mode (YOLO/Interactive) shown
- [ ] Engine (pandas/fast) shown
- [ ] Project type shown
- [ ] EDA and Plan phases in status display
- [ ] Report status shown
- [ ] Live deployment status shown (if applicable)
- [ ] State loaded correctly
- [ ] Progress calculated with new phases
- [ ] Clear visual status displayed
- [ ] Appropriate next action suggested
</success_criteria>
