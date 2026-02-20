# MCP Server Setup for Trading

> How to set up MCP (Model Context Protocol) servers for enhanced trading development

## What is MCP?

MCP (Model Context Protocol) allows Claude Code to connect to external tools and data sources.
For trading development, this means:
- Access to up-to-date library documentation (ccxt, polars, numba, pandas, etc.)
- Real-time market data (stocks, forex, crypto prices)
- Macroeconomic data (GDP, CPI, interest rates, M2 money supply, yield curves)

## Included MCP Servers

CBT Framework offers 3 MCP servers during installation. All are free.

### 1. Context7 - Library Documentation (No API key)

**What it does:** Gives Claude access to current, accurate documentation for any library.
Instead of relying on training data (which may be outdated), Claude can look up the real docs.

**Package:** `@upstash/context7-mcp` (open source by Upstash)

**Use cases in CBT:**
- Look up ccxt `create_order()` parameters for live trading
- Check Polars LazyFrame methods for fast engine builds
- Get accurate Numba `@njit` documentation for compiled loops
- Verify pandas/numpy API for data manipulation

**Config:**
```json
"context7": {
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp@latest"]
}
```

### 2. Alpha Vantage - Market & Macro Data (Free API key)

**What it does:** Provides real-time and historical data for stocks, forex, crypto,
AND macroeconomic indicators (CPI, GDP, inflation, interest rates, unemployment).

**Get free API key:** https://www.alphavantage.co/support/#api-key

**Use cases in CBT:**
- Pull historical crypto/stock prices for backtesting
- Check current forex rates for multi-asset strategies
- Get CPI/GDP data to correlate with strategy performance
- Research interest rate cycles and their impact on crypto
- Validate strategy against macroeconomic regimes

**Config:**
```json
"alphavantage": {
  "url": "https://mcp.alphavantage.co/mcp?apikey=YOUR_KEY"
}
```

### 3. FRED - Federal Reserve Economic Data (Free API key)

**What it does:** Access to 840,000+ economic time series from the Federal Reserve Bank of St. Louis.
The most comprehensive source of US macroeconomic data.

**Get free API key:** https://fred.stlouisfed.org/docs/api/api_key.html

**Use cases in CBT:**
- M2 money supply trends (crypto correlation analysis)
- Yield curve data (recession indicators)
- Fed funds rate history (risk-on/risk-off regime detection)
- Unemployment, housing, consumer sentiment data
- Build macro-aware trading strategies
- Validate strategy robustness across economic cycles

**Config:**
```json
"fred": {
  "command": "npx",
  "args": ["-y", "fred-mcp-server"],
  "env": {
    "FRED_API_KEY": "YOUR_KEY"
  }
}
```

## Setting Up MCP Servers

### Via CBT Framework Installer (Recommended)

```bash
npx cbt-framework
```

The installer walks you through each MCP server:
1. Explains what it does
2. Shows where to get the free API key
3. Asks you to paste the key
4. Configures everything in `~/.claude/.mcp.json`

### Manual Setup

Edit `~/.claude/.mcp.json` directly:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "alphavantage": {
      "url": "https://mcp.alphavantage.co/mcp?apikey=YOUR_ALPHA_VANTAGE_KEY"
    },
    "fred": {
      "command": "npx",
      "args": ["-y", "fred-mcp-server"],
      "env": {
        "FRED_API_KEY": "YOUR_FRED_KEY"
      }
    }
  }
}
```

Then restart Claude Code.

### Verifying MCP Setup

In Claude Code, test each server:
- **Context7:** "Look up ccxt create_order documentation"
- **Alpha Vantage:** "Get BTC price history from Alpha Vantage"
- **FRED:** "Pull M2 money supply data from FRED"

## Available Libraries via Context7

Useful for CBT Framework development:

| Library | Use Case |
|---------|----------|
| ccxt | Exchange API interaction (live trading) |
| polars | Fast data loading and manipulation |
| numba | JIT compilation for backtest loops |
| pandas | Standard data manipulation |
| numpy | Numerical operations |
| matplotlib | Plotting and visualization |
| seaborn | Statistical visualizations |
| mplfinance | Candlestick charts |
| scikit-learn | ML models for complex strategies |
| scipy | Statistical tests for EDA |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MCP server not connecting | Check `~/.claude/.mcp.json` syntax (valid JSON?) |
| "Command not found" | Ensure Node.js/npx is installed |
| Alpha Vantage not responding | Verify API key at alphavantage.co |
| FRED returning errors | Verify API key at fred.stlouisfed.org |
| Slow responses | MCP servers add latency; use sparingly |
| Incorrect docs | Specify library version in your query |

## Security Notes

- Context7 runs locally, fetches only public documentation
- Alpha Vantage connects to their remote API (your key is in the URL)
- FRED runs locally via npx, connects to FRED API with your key
- None of these servers have access to your trading API keys or .env files
- API keys are stored in `~/.claude/.mcp.json` - do not commit this file to git
