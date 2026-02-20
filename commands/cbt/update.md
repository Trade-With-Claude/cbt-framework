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

## 7. Check MCP Setup

After updating, check if the user has MCP servers configured:

```bash
cat ~/.claude/.mcp.json 2>/dev/null || echo "none"
```

If no `.mcp.json` exists or it's missing servers, inform the user:

```
MCP Servers:
CBT Framework supports 3 free MCP servers for enhanced data access:

| Server | Purpose | Status |
|--------|---------|--------|
| Context7 | Library docs (pandas, ccxt...) | [Installed/Not installed] |
| Alpha Vantage | Market data + macro (CPI, GDP) | [Installed/Not installed] |
| FRED | 840,000+ economic time series | [Installed/Not installed] |

To set up missing MCP servers, run this in your terminal (not in Claude):
  npx cbt-framework@latest

Or see: ~/.claude/cbt-framework/references/mcp-setup.md
```

</process>

<success_criteria>
- [ ] Current version displayed
- [ ] Latest version checked
- [ ] Update applied if confirmed
- [ ] Changelog shown
- [ ] Installation verified
</success_criteria>
