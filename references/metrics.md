# Backtest Metrics Reference

## Performance Metrics

### Total Return
```
total_return = (final_equity - initial_capital) / initial_capital * 100
```
Simple percentage return over the backtest period.

### Sharpe Ratio
```
sharpe = mean(returns) / std(returns) * sqrt(annualization_factor)
```
Risk-adjusted return. Higher is better.
- < 1.0: Poor
- 1.0-2.0: Good
- 2.0-3.0: Very good
- > 3.0: Excellent (or suspicious)

Annualization factors:
- Daily data: sqrt(252)
- Hourly data: sqrt(252 * 24)
- Minute data: sqrt(252 * 24 * 60)

### Sortino Ratio
```
sortino = mean(returns) / std(negative_returns) * sqrt(annualization_factor)
```
Like Sharpe but only penalizes downside volatility.

### Max Drawdown
```
max_drawdown = min((equity - running_max) / running_max)
```
Largest peak-to-trough decline. Expressed as negative percentage.

### Calmar Ratio
```
calmar = annual_return / abs(max_drawdown)
```
Return relative to worst drawdown.

## Trade Metrics

### Win Rate
```
win_rate = winning_trades / total_trades * 100
```
Percentage of trades that were profitable.

### Profit Factor
```
profit_factor = gross_profit / gross_loss
```
Ratio of money made to money lost.
- < 1.0: Losing money
- 1.0-1.5: Marginal
- 1.5-2.0: Good
- > 2.0: Excellent

### Average Trade
```
avg_trade = sum(all_pnl) / total_trades
```
Average profit/loss per trade.

### Average Winner / Loser
```
avg_winner = sum(winning_pnl) / winning_trades
avg_loser = sum(losing_pnl) / losing_trades
```
Average profit on winners and average loss on losers.

### Expectancy
```
expectancy = (win_rate * avg_winner) - ((1 - win_rate) * abs(avg_loser))
```
Expected value per trade.

## Risk Metrics

### Max Consecutive Losses
Longest streak of losing trades. Important for psychology and drawdown.

### Max Drawdown Duration
How many bars/days the strategy was in drawdown before recovering.

### Average Drawdown
Average of all drawdown values when in drawdown.

## What Good Looks Like

| Metric | Poor | Acceptable | Good | Excellent |
|--------|------|------------|------|-----------|
| Sharpe | < 0.5 | 0.5-1.0 | 1.0-2.0 | > 2.0 |
| Win Rate | < 40% | 40-50% | 50-60% | > 60% |
| Profit Factor | < 1.0 | 1.0-1.5 | 1.5-2.0 | > 2.0 |
| Max DD | > -30% | -20% to -30% | -10% to -20% | < -10% |

## Warning Signs

- Sharpe > 3: Likely overfitting or lookahead bias
- Win rate > 70%: Suspicious, check for bias
- Very few trades: Not statistically significant
- All wins/losses clustered: Regime dependent
