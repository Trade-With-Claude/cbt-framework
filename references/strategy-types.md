# Strategy Types Reference

## Simple (Rule-Based)

**Characteristics:**
- Entry/exit based on indicators or thresholds
- No machine learning
- Clear, interpretable rules

**Examples:**
- Moving average crossover
- RSI overbought/oversold
- Breakout strategies
- Support/resistance

**Build Steps:**
1. Data loading
2. Feature/indicator calculation
3. Signal generation
4. Backtest

**Pros:**
- Easy to understand
- Fast to implement
- Clear reasoning

**Cons:**
- May underfit complex patterns
- Parameters need optimization

---

## Medium (Feature-Based)

**Characteristics:**
- Multiple features combined
- May use simple ML (logistic regression, decision trees)
- More sophisticated entry logic

**Examples:**
- Multi-factor models
- Ensemble of indicators
- Pattern recognition
- Sentiment combination

**Build Steps:**
1. Data loading
2. Feature engineering
3. Feature selection
4. Signal generation (possibly ML-based)
5. Backtest

**Pros:**
- Captures more complex patterns
- Can adapt to different regimes
- More robust

**Cons:**
- More complex to implement
- Overfitting risk
- Requires more data

---

## Complex (ML Pipeline)

**Characteristics:**
- Full machine learning pipeline
- Walk-forward optimization
- Feature importance analysis
- Model validation

**Examples:**
- XGBoost/LightGBM classifiers
- Neural networks
- Reinforcement learning
- Ensemble methods

**Build Steps:**
1. Data loading
2. Feature engineering
3. Label generation
4. Train/validation split
5. Model training
6. Walk-forward CV
7. Signal generation
8. Backtest

**Pros:**
- Can capture non-linear patterns
- Adaptive
- State-of-the-art performance potential

**Cons:**
- High overfitting risk
- Requires significant data
- Hard to interpret
- Computationally expensive

---

## Choosing the Right Type

### Start Simple
Always start with the simplest approach that might work. Add complexity only if needed.

### Consider Data Volume
- < 1000 trades: Simple only
- 1000-10000 trades: Medium possible
- > 10000 trades: Complex viable

### Consider Your Edge
- Clear, rule-based edge: Simple
- Pattern-based edge: Medium
- Complex market dynamics: Complex

### Consider Interpretability
- Need to explain to others: Simple
- Internal use only: Any
- Regulatory requirements: Simple/Medium

---

## Red Flags by Type

### Simple Strategies
- Too many parameters
- Over-optimized thresholds
- Works only in one market regime

### Medium Strategies
- Too many features
- High correlation between features
- No feature importance analysis

### Complex Strategies
- In-sample results much better than out-of-sample
- No walk-forward validation
- Black box with no interpretability
- Unrealistic performance metrics
