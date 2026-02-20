# Live Trading Reference

> Exchange API patterns, rate limits, and best practices for live bot deployment

## Supported Exchanges

| Exchange | Type | API | Testnet | Rate Limit |
|----------|------|-----|---------|------------|
| Bybit | CEX | REST + WebSocket | Yes | 120 req/min |
| Kraken | CEX | REST + WebSocket | No (paper sim) | 15 req/sec |
| Binance | CEX | REST + WebSocket | Yes | 1200 req/min |
| Hyperliquid | DEX | REST + WebSocket | Yes | 1200 req/min |

## Exchange-Specific Notes

### Bybit
- **Best for:** Derivatives trading, USDT perpetuals
- **Testnet:** `https://testnet.bybit.com`
- **API Docs:** `https://bybit-exchange.github.io/docs/`
- **Position modes:** One-way (default) or Hedge mode
- **Order types:** Market, Limit, Conditional
- **Subaccounts:** Supported via API headers

### Kraken
- **Best for:** Security-focused, regulated markets
- **No official testnet** - use paper trading simulation
- **API Docs:** `https://docs.kraken.com/rest/`
- **Rate limits:** Strict per-endpoint limits
- **Withdrawal:** Requires separate API key permission
- **Note:** Symbol format differs (e.g., XXBTZUSD vs BTC/USD)

### Binance
- **Best for:** Largest volume, most trading pairs
- **Testnet:** `https://testnet.binancefuture.com`
- **API Docs:** `https://binance-docs.github.io/apidocs/`
- **Position modes:** One-way or Hedge mode
- **USDT-M vs COIN-M:** Different endpoints, different contracts
- **IP whitelisting:** Recommended for security

### Hyperliquid
- **Best for:** Decentralized perpetuals, on-chain settlement
- **Testnet:** Available on testnet
- **API Docs:** `https://hyperliquid.gitbook.io/`
- **Wallet-based auth:** Uses private key, not API key
- **No custody risk:** Funds stay in your wallet
- **Gas fees:** L1 fees for settlement

## Common API Patterns

### Authentication
```python
# All exchanges via ccxt
import ccxt

exchange = ccxt.bybit({
    'apiKey': os.getenv('EXCHANGE_API_KEY'),
    'secret': os.getenv('EXCHANGE_API_SECRET'),
    'sandbox': True,  # Use testnet
    'enableRateLimit': True,
})
```

### Fetching Data
```python
# OHLCV candles
ohlcv = exchange.fetch_ohlcv('BTC/USDT', '1h', limit=100)

# Ticker
ticker = exchange.fetch_ticker('BTC/USDT')

# Order book
orderbook = exchange.fetch_order_book('BTC/USDT')
```

### Placing Orders
```python
# Market order
order = exchange.create_order('BTC/USDT', 'market', 'buy', 0.01)

# Limit order
order = exchange.create_order('BTC/USDT', 'limit', 'buy', 0.01, 50000)
```

### Position Management
```python
# Get positions (futures)
positions = exchange.fetch_positions(['BTC/USDT'])

# Set leverage
exchange.set_leverage(10, 'BTC/USDT')
```

## Rate Limiting Best Practices

1. **Always enable ccxt rate limiting:** `enableRateLimit: True`
2. **Add sleep between rapid calls:** `time.sleep(0.1)` minimum
3. **Use WebSocket for real-time data** instead of polling REST API
4. **Batch requests** where possible (e.g., fetch multiple symbols at once)
5. **Cache market data** - don't reload markets() every call

## Safety Checklist

Before going live:
- [ ] Paper traded for minimum 1 week (ideally 1 month)
- [ ] Kill switch configured and tested
- [ ] Max position size set
- [ ] API key has only required permissions (no withdrawal)
- [ ] IP whitelist enabled (if exchange supports it)
- [ ] Error handling covers all API error codes
- [ ] Retry logic with exponential backoff
- [ ] Notification channels tested
- [ ] .env file is gitignored
- [ ] Logs are being written and rotated
- [ ] Graceful shutdown handler in place

## Error Handling

### Common ccxt Exceptions
```python
try:
    order = exchange.create_order(...)
except ccxt.InsufficientFunds as e:
    # Not enough balance
except ccxt.InvalidOrder as e:
    # Order parameters invalid (size, price, etc.)
except ccxt.NetworkError as e:
    # Connection issue - retry
except ccxt.ExchangeError as e:
    # Exchange-side error
except ccxt.RateLimitExceeded as e:
    # Slow down!
    time.sleep(60)
```

### Retry Pattern
```python
import time

def retry_api_call(func, max_retries=3, backoff=2):
    for attempt in range(max_retries):
        try:
            return func()
        except (ccxt.NetworkError, ccxt.ExchangeNotAvailable) as e:
            if attempt < max_retries - 1:
                sleep_time = backoff ** attempt
                time.sleep(sleep_time)
            else:
                raise
```

## Cross-Exchange Setup

Use data from one exchange, trade on another:

```python
# Data source (e.g., Binance for liquidity/depth)
data_exchange = ccxt.binance({'enableRateLimit': True})

# Trading exchange (e.g., Bybit for better fees)
trade_exchange = ccxt.bybit({
    'apiKey': os.getenv('TRADE_API_KEY'),
    'secret': os.getenv('TRADE_API_SECRET'),
    'enableRateLimit': True,
})

# Fetch data from Binance
candles = data_exchange.fetch_ohlcv('BTC/USDT', '1h')

# Generate signal from data
signal = strategy.get_signal(candles)

# Execute on Bybit
if signal.direction != 0:
    trade_exchange.create_order('BTC/USDT', 'market', 'buy', size)
```

## Raspberry Pi Deployment

### Setup
```bash
# Install Docker on Raspberry Pi
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Build and run
docker compose up -d

# Check logs
docker compose logs -f
```

### Monitoring
```bash
# Check if bot is running
docker compose ps

# View recent logs
docker compose logs --tail 50

# Restart
docker compose restart
```

### Performance Tips for Pi
- Use Parquet files (smaller, faster than CSV)
- Minimize indicator computation (precompute when possible)
- Monitor memory usage: `docker stats`
- Set swap file if needed: `sudo fallocate -l 2G /swapfile`
