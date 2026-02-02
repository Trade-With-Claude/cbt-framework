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
Display comprehensive status of the current strategy including phase, progress, experiments, and suggested next action.
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

## 2. Load State

Read the state.yaml file and parse:
- strategy name
- current phase
- phases completed
- build progress
- experiments info
- pending observations

## 3. Gather Additional Info

Check for existence of:
- DISCOVERY.md
- RESEARCH.md
- strategy.py
- experiments/*.yaml (count)
- Data/* files

## 4. Calculate Progress

Determine overall progress:
- Discovery: 20%
- Research: 40%
- Config: 50%
- Build: 80%
- Iterate: 100% (ongoing)

## 5. Display Status

Output formatted status:

```
╔══════════════════════════════════════════════════════════════╗
║  CBT Framework - Strategy Status                             ║
╠══════════════════════════════════════════════════════════════╣
║  Strategy: {name}                                            ║
║  Phase: {phase}                                              ║
║  Progress: [████████░░░░░░░░░░░░] 40%                       ║
╠══════════════════════════════════════════════════════════════╣
║  Phases:                                                     ║
║    [✓] Discovery    - DISCOVERY.md created                   ║
║    [✓] Research     - RESEARCH.md created                    ║
║    [ ] Config       - config.yaml (defaults)                 ║
║    [ ] Build        - Not started                            ║
║    [ ] Iterate      - 0 experiments                          ║
╠══════════════════════════════════════════════════════════════╣
║  Data Files: {count} files in Data/                          ║
║  Experiments: {count} runs, best Sharpe: {best}              ║
║  Pending: {observations_count} observations to explore       ║
╠══════════════════════════════════════════════════════════════╣
║  Suggested: /cbt:{next_command}                              ║
╚══════════════════════════════════════════════════════════════╝
```

## 6. Route to Next Action

Based on state, suggest:
- If discovery not done → `/cbt:discover`
- If research not done → `/cbt:research`
- If config defaults → `/cbt:config`
- If build not done → `/cbt:build`
- If baseline exists → `/cbt:iterate` or `/cbt:run`

</process>

<success_criteria>
- [ ] Active strategy identified
- [ ] State loaded correctly
- [ ] Progress calculated
- [ ] Clear visual status displayed
- [ ] Appropriate next action suggested
</success_criteria>
