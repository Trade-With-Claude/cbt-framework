---
name: cbt:update
description: Update CBT Framework to the latest version
argument-hint: ""
allowed-tools:
  - Read
  - Bash
---

<objective>
Check for updates to CBT Framework and install the latest version.
</objective>

<process>

## 1. Get Current Version

```bash
cat ~/.claude/cbt-framework/VERSION 2>/dev/null || echo "unknown"
```

## 2. Check Latest Version

```bash
npm view cbt-framework version 2>/dev/null || echo "not published"
```

## 3. Compare Versions

If same version:
```
CBT Framework is up to date!

Current version: 1.0.0
```

If update available:
```
Update available!

Current version: 1.0.0
Latest version:  1.1.0

Changes in 1.1.0:
• Added volatility regime detection
• Improved analysis output
• Bug fixes in trade logging

Install update? [Y/n]
```

## 4. Install Update

If user confirms:

```bash
npx cbt-framework@latest
```

## 5. Show Changelog

After update:
```
Update complete!

CBT Framework updated: 1.0.0 → 1.1.0

Changelog:
─────────

## 1.1.0 (2026-02-15)

### Features
• Added volatility regime detection to /cbt:analyze
• New preset: binance_spot
• Improved equity curve visualization

### Fixes
• Fixed trade duration calculation
• Corrected Sortino ratio formula

### Breaking Changes
• None

─────────

Your strategies are compatible with this update.
```

## 6. Verify Installation

```bash
cat ~/.claude/cbt-framework/VERSION
```

Confirm version updated.

</process>

<success_criteria>
- [ ] Current version displayed
- [ ] Latest version checked
- [ ] Update applied if confirmed
- [ ] Changelog shown
- [ ] Installation verified
</success_criteria>
