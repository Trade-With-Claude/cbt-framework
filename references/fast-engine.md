# Fast Engine Reference

> Polars + NumPy + Numba guide for high-performance backtesting

## When to Use the Fast Engine

| Dataset Size | Recommended Engine | Reason |
|-------------|-------------------|--------|
| < 1M rows | pandas | Simpler, more debuggable, sufficient speed |
| 1-10M rows | Either | Fast engine gives 5-20x speedup |
| 10-50M rows | Fast | pandas becomes slow, memory-heavy |
| > 50M rows | Fast (required) | pandas may crash or take hours |

## Architecture

```
Data Files (.parquet/.csv)
        │
        ▼
   Polars Lazy Frames  ← Zero-copy, lazy evaluation
        │
        ▼
   NumPy Arrays        ← Contiguous memory layout
        │
        ▼
   Numba @njit Loop    ← Compiled to machine code
        │
        ▼
   Results (arrays)    ← No object overhead
```

### Design Principles
1. **Polars for data prep** - Lazy evaluation, zero-copy reads, efficient joins
2. **NumPy for features** - Contiguous arrays, vectorized operations
3. **Numba for backtest** - JIT compiled to native machine code
4. **No pandas in hot path** - pandas DataFrames are too slow for inner loops

## Polars Quick Reference

### Loading Data
```python
# Lazy frame (deferred execution)
lf = pl.scan_parquet("data.parquet")
lf = pl.scan_csv("data.csv", try_parse_dates=True)

# Filter before collecting (pushes filter to scan)
lf = lf.filter(pl.col("date") >= "2020-01-01")

# Collect (executes the query)
df = lf.collect()
```

### Key Differences from Pandas
| Pandas | Polars |
|--------|--------|
| `df['col']` | `df.select('col')` or `df['col']` |
| `df.iloc[0:10]` | `df.head(10)` or `df.slice(0, 10)` |
| `df.groupby('col').agg()` | `df.group_by('col').agg()` |
| `df.merge(other, on='col')` | `df.join(other, on='col')` |
| `df.apply(func)` | `df.select(pl.col('col').map_elements(func))` |
| Mutates in place | Always returns new DataFrame |

### Converting to NumPy
```python
# Single column
arr = df['close'].to_numpy()

# Ensure contiguous float64 for Numba
arr = np.ascontiguousarray(arr, dtype=np.float64)
```

## NumPy Feature Engineering

### Shift (Lookahead Prevention)
```python
def shift(arr, periods=1):
    result = np.empty_like(arr)
    result[:periods] = np.nan
    result[periods:] = arr[:-periods]
    return result

# CORRECT: shifted feature
sma = rolling_mean(close, 20)
feature = shift(sma, 1)  # Only use data up to t-1

# WRONG: unshifted feature (lookahead!)
feature = rolling_mean(close, 20)  # Uses data at time t
```

### Rolling Computations (No Pandas)
```python
def rolling_mean(arr, window):
    """O(n) rolling mean using cumsum."""
    cumsum = np.cumsum(arr)
    cumsum = np.insert(cumsum, 0, 0)
    result = (cumsum[window:] - cumsum[:-window]) / window
    return np.concatenate([np.full(window - 1, np.nan), result])
```

## Numba Reference

### Basics
```python
from numba import njit

@njit
def my_function(arr):
    # This gets compiled to native code
    result = np.empty_like(arr)
    for i in range(len(arr)):
        result[i] = arr[i] * 2
    return result
```

### Supported Operations in @njit
- Basic math: `+`, `-`, `*`, `/`, `**`, `%`
- NumPy operations: `np.sum`, `np.mean`, `np.max`, `np.min`, `np.abs`, `np.sqrt`
- NumPy array creation: `np.empty`, `np.zeros`, `np.ones`, `np.full`
- Array indexing and slicing
- For loops (they're fast in Numba!)
- If/else statements
- Tuples as return values

### NOT Supported in @njit
- Python dictionaries (use arrays or tuples instead)
- String operations
- List comprehensions
- Most Python standard library
- pandas operations
- Class instances (use plain arrays)

### Gotchas
1. **First call is slow** - JIT compilation happens on first call (~2-5 seconds)
2. **Type inference** - Numba infers types from first call. Be consistent.
3. **No NaN checking by default** - Handle NaN explicitly
4. **Array must be contiguous** - Use `np.ascontiguousarray()`
5. **No print debugging** - Use `print()` only for debugging, remove before production

### Pattern: Backtest Loop
```python
@njit
def backtest_loop(close, signals, initial_capital, ...):
    n = len(close)
    equity = initial_capital
    equity_curve = np.empty(n)

    # Pre-allocate trade arrays
    max_trades = n // 2
    trade_pnls = np.empty(max_trades)
    num_trades = 0

    for i in range(n):
        # Check exits
        # Check entries
        equity_curve[i] = equity

    return equity_curve, trade_pnls[:num_trades], num_trades
```

## Performance Tips

1. **Use Parquet over CSV** - 10x faster reads, 3-5x smaller files
2. **Lazy evaluation** - Filter/select in Polars before collecting
3. **Contiguous arrays** - Always use `np.ascontiguousarray()` for Numba
4. **Avoid copies** - Use views when possible
5. **Pre-allocate** - Never use `np.append()` in loops
6. **Float64 everywhere** - Numba works best with consistent types
7. **Warm up JIT** - Run with small data first to compile, then full dataset

## Converting Pandas Strategy to Fast

1. Replace `pd.read_csv()` → `pl.scan_csv()`
2. Replace DataFrame features → NumPy array features
3. Replace `.shift(1)` → `shift(arr, 1)` (NumPy version)
4. Replace backtest loop → `@njit` compiled function
5. Replace `pd.DataFrame` results → NumPy arrays
6. Add `np.ascontiguousarray()` at the boundary

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed in nopython mode" | Check for unsupported Python features in @njit |
| Slow first run | Normal - JIT compilation. Subsequent runs are fast |
| Wrong results | Check array dtypes match (use float64 consistently) |
| Memory error | Use Polars lazy frames, process in chunks |
| NaN propagation | Handle NaN explicitly in Numba functions |
