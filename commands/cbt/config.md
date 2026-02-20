---
name: cbt:config
description: Configure backtest parameters (capital, sizing, leverage, fees)
argument-hint: "[show|preset <name>|set <key> <value>]"
allowed-tools:
  - Read
  - Write
  - AskUserQuestion
---

<objective>
Configure backtest parameters through interactive setup or direct commands.
Supports presets for common configurations and individual parameter updates.
</objective>

<execution_context>
@strategies/{active}/config.yaml
@strategies/{active}/.cbt/state.yaml
@~/.claude/cbt-framework/templates/presets/
</execution_context>

<process>

## 1. Parse Arguments

Determine mode:
- No args → Interactive setup
- `show` → Display current config
- `preset <name>` → Load preset
- `set <key> <value>` → Update single value

## 2. Mode: Show

If `show`:
- Read config.yaml
- Display formatted output:

```
╔═══════════════════════════════════════════════════════════╗
║  Backtest Configuration                                   ║
╠═══════════════════════════════════════════════════════════╣
║  Account                                                  ║
║    Initial Capital: $10,000                               ║
║    Currency: USD                                          ║
╠═══════════════════════════════════════════════════════════╣
║  Position Sizing                                          ║
║    Mode: percent                                          ║
║    Per Trade: 2.0%                                        ║
║    Max Positions: 3                                       ║
╠═══════════════════════════════════════════════════════════╣
║  Leverage                                                 ║
║    Enabled: Yes                                           ║
║    Default: 5x                                            ║
║    Maximum: 20x                                           ║
╠═══════════════════════════════════════════════════════════╣
║  Risk Management                                          ║
║    Stop Loss: 1.0% (percent mode)                         ║
║    Take Profit: 2.0% (percent mode)                       ║
║    Trailing Stop: Disabled                                ║
╠═══════════════════════════════════════════════════════════╣
║  Fees                                                     ║
║    Maker: 0.02%                                           ║
║    Taker: 0.04%                                           ║
║    Slippage: 0.01%                                        ║
╠═══════════════════════════════════════════════════════════╣
║  Prop Firm (if enabled)                                   ║
║    Phase: 1                                               ║
║    Max Drawdown: 10.0%                                    ║
║    Daily Loss Limit: 5.0%                                 ║
║    Profit Target: 10.0%                                   ║
║    Breach Action: halt                                    ║
╚═══════════════════════════════════════════════════════════╝
```

## 3. Mode: Preset

Available presets:

### binance_futures
```yaml
fees:
  maker: 0.02
  taker: 0.04
leverage:
  enabled: true
  max: 125
```

### conservative
```yaml
sizing:
  percent_per_trade: 1.0
  max_positions: 1
leverage:
  default: 3
  max: 5
risk:
  stop_loss:
    percent: 0.5
```

### aggressive
```yaml
sizing:
  percent_per_trade: 5.0
  max_positions: 5
leverage:
  default: 20
```

### crypto_spot
```yaml
leverage:
  enabled: false
fees:
  maker: 0.1
  taker: 0.1
```

### prop_firm_phase1
```yaml
prop_firm:
  enabled: true
  phase: 1
  max_drawdown_percent: 10.0
  daily_loss_percent: 5.0
  phase1_target_percent: 10.0
  phase2_target_percent: 5.0
  breach_action: halt
```

### prop_firm_phase2
```yaml
prop_firm:
  enabled: true
  phase: 2
  max_drawdown_percent: 10.0
  daily_loss_percent: 5.0
  phase1_target_percent: 10.0
  phase2_target_percent: 5.0
  breach_action: halt
```

Load preset and merge with current config.
Show what changed.

## 4. Mode: Set

Parse key path (dot notation):
- `account.initial_capital 50000`
- `sizing.percent_per_trade 3.0`
- `risk.stop_loss.percent 1.5`

Validate value against rules:
- initial_capital: > 0
- percent_per_trade: 0.1 to 100
- leverage: 1 to 125
- stop_loss: 0.1 to 50
- fees: 0 to 1

Update config.yaml and confirm.

## 5. Mode: Interactive

Walk through configuration sections using AskUserQuestion:

### Step 1: Account
- Initial capital?
- Currency? (USD, EUR, BTC, etc.)

### Step 2: Position Sizing
- Sizing mode? (percent / fixed / kelly)
- If percent: percentage per trade?
- Max concurrent positions?

### Step 3: Leverage
- Use leverage? (yes/no)
- If yes: default leverage?
- Maximum leverage?

### Step 4: Risk Management
- Stop loss mode? (percent / ATR / fixed / none)
- Stop loss value?
- Take profit mode? (percent / R:R ratio / fixed / none)
- Take profit value?
- Use trailing stop?

### Step 5: Fees
- Exchange preset or custom?
- If custom: maker fee? taker fee?
- Expected slippage?

### Step 6: Time Range
- Backtest start date? (or full history)
- Backtest end date? (or latest)

### Step 7: Prop Firm Rules
- "Is this a prop firm challenge?" (yes / no)
- If yes:
  - Show current prop firm rules from config.yaml
  - Phase? (1 / 2)
  - Max drawdown limit? (default: 10%)
  - Daily loss limit? (default: 5%)
  - Confirm or edit values
  - Update config.yaml `prop_firm` section and state.yaml `prop_firm` section

## 6. Save Config

Write updated config.yaml:

```yaml
# CBT Framework Configuration
# Strategy: {name}
# Last updated: {date}

account:
  initial_capital: 10000
  currency: USD

sizing:
  mode: percent  # percent | fixed | kelly
  percent_per_trade: 2.0
  fixed_amount: null
  max_positions: 3

leverage:
  enabled: true
  default: 5
  max: 20

risk:
  stop_loss:
    enabled: true
    mode: percent  # percent | atr | fixed
    percent: 1.0
    atr_multiplier: null
    fixed_value: null
  take_profit:
    enabled: true
    mode: percent  # percent | rr_ratio | fixed
    percent: 2.0
    rr_ratio: null
    fixed_value: null
  trailing_stop:
    enabled: false
    activation: 1.0  # % profit to activate
    distance: 0.5    # % distance from high

fees:
  maker: 0.02  # percentage
  taker: 0.04  # percentage
  slippage: 0.01  # percentage

execution:
  entry_type: market  # market | limit
  exit_type: market   # market | limit
  partial_exits: false

time:
  start_date: null  # YYYY-MM-DD or null for full history
  end_date: null    # YYYY-MM-DD or null for latest
  trading_hours: null  # e.g., "09:30-16:00" or null for 24/7
```

## 7. Update State

```yaml
phases_completed:
  config: true
phase: build
```

## 8. Output Summary

```
Configuration saved!

Key settings:
- Capital: ${initial_capital}
- Sizing: {percent}% per trade, max {max_positions} positions
- Leverage: {default}x (max {max}x)
- Stop Loss: {sl}% | Take Profit: {tp}%
- Fees: {taker}% (taker)

Next: /cbt:build
```

</process>

<validation_rules>
- initial_capital: must be > 0
- percent_per_trade: 0.1 to 100
- max_positions: 1 to 100
- leverage: 1 to 125
- stop_loss percent: 0.1 to 50
- take_profit percent: 0.1 to 100
- fees: 0 to 1 (percentage)
</validation_rules>

<success_criteria>
- [ ] Config values validated
- [ ] config.yaml saved correctly
- [ ] State updated
- [ ] Clear summary displayed
</success_criteria>
