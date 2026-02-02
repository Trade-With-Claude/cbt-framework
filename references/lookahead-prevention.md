# Lookahead Bias Prevention Guide

Lookahead bias is the most common and dangerous mistake in backtesting. It occurs when your strategy uses information that wouldn't have been available at the time of the trading decision.

## The Rule

**At time t, your strategy can only use data from times < t.**

This means:
- Features calculated at bar t should use data from bars 0 to t-1
- The close price of bar t is NOT available until bar t+1

## How to Prevent It

### 1. Always Use .shift(1)

```python
# WRONG - uses current bar's close
df['sma'] = df['close'].rolling(20).mean()

# CORRECT - shifted to use only past data
df['sma'] = df['close'].rolling(20).mean().shift(1)
```

### 2. Think About When Data is Available

For a bar with timestamp 10:00:
- Open price: available at 10:00:00
- High/Low/Close: NOT available until 10:01:00 (next bar)
- Volume: NOT available until bar closes

### 3. Common Mistakes

#### Using close in entry decision
```python
# WRONG - can't know close until bar closes
if current_close > sma:
    enter_long()

# CORRECT - use previous close or current open
if previous_close > sma:
    enter_long()
```

#### Future labels in ML
```python
# WRONG - label uses future data
df['label'] = (df['close'].shift(-5) > df['close']).astype(int)
# This is correct for training, but shift the label when using!
```

#### Filling NaN with future data
```python
# WRONG - forward fill then backward fill
df.fillna(method='bfill')  # Uses future data!

# CORRECT - only forward fill
df.fillna(method='ffill')
```

## Validation

The FeatureGenerator includes a basic lookahead check:
- Calculates correlation between features and future returns
- Warns if correlation is suspiciously high

But this doesn't catch all cases. Always:
1. Review your feature code manually
2. Check that all calculations use .shift(1)
3. Test with out-of-sample data

## Red Flags

Your backtest results might have lookahead bias if:
- Win rate is unrealistically high (>70%)
- Sharpe ratio is unrealistically high (>3)
- Results don't degrade in out-of-sample testing
- Strategy seems to "know" tops and bottoms

## References

- [Common Backtesting Mistakes](https://www.quantstart.com/articles/Successful-Backtesting-of-Algorithmic-Trading-Strategies-Part-I/)
- [Marcos Lopez de Prado - Advances in Financial Machine Learning](https://www.wiley.com/en-us/Advances+in+Financial+Machine+Learning-p-9781119482086)
