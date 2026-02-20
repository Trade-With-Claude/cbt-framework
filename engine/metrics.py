"""
Metrics Calculation Module
CBT Framework

Standalone metrics calculation for backtest results.
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
from dataclasses import dataclass


@dataclass
class Trade:
    """Trade record for metrics calculation."""
    entry_time: str
    exit_time: str
    direction: int
    entry_price: float
    exit_price: float
    size: float
    pnl: float
    pnl_percent: float
    exit_reason: str
    duration_seconds: int
    fees: float


def calculate_returns(equity_curve: List[float]) -> pd.Series:
    """Calculate period returns from equity curve."""
    equity = pd.Series(equity_curve)
    returns = equity.pct_change().dropna()
    return returns


def calculate_sharpe_ratio(returns: pd.Series,
                          risk_free_rate: float = 0.0,
                          periods_per_year: int = 252 * 24) -> float:
    """
    Calculate Sharpe ratio.

    Args:
        returns: Series of period returns
        risk_free_rate: Annual risk-free rate
        periods_per_year: Number of periods in a year (default: hourly)

    Returns:
        Annualized Sharpe ratio
    """
    if len(returns) < 2 or returns.std() == 0:
        return 0.0

    excess_returns = returns - (risk_free_rate / periods_per_year)
    sharpe = excess_returns.mean() / returns.std() * np.sqrt(periods_per_year)

    return float(sharpe)


def calculate_sortino_ratio(returns: pd.Series,
                           risk_free_rate: float = 0.0,
                           periods_per_year: int = 252 * 24) -> float:
    """
    Calculate Sortino ratio (downside risk-adjusted return).

    Args:
        returns: Series of period returns
        risk_free_rate: Annual risk-free rate
        periods_per_year: Number of periods in a year

    Returns:
        Annualized Sortino ratio
    """
    if len(returns) < 2:
        return 0.0

    excess_returns = returns - (risk_free_rate / periods_per_year)
    negative_returns = returns[returns < 0]

    if len(negative_returns) < 2 or negative_returns.std() == 0:
        return 0.0

    sortino = excess_returns.mean() / negative_returns.std() * np.sqrt(periods_per_year)

    return float(sortino)


def calculate_max_drawdown(equity_curve: List[float]) -> tuple:
    """
    Calculate maximum drawdown.

    Args:
        equity_curve: List of equity values

    Returns:
        Tuple of (max_drawdown_percent, max_drawdown_duration)
    """
    equity = pd.Series(equity_curve)
    rolling_max = equity.expanding().max()
    drawdown = (equity - rolling_max) / rolling_max * 100

    max_dd = drawdown.min()

    # Calculate duration
    in_drawdown = drawdown < 0
    if not in_drawdown.any():
        return 0.0, 0

    # Find longest drawdown period
    drawdown_groups = (in_drawdown != in_drawdown.shift()).cumsum()
    max_duration = in_drawdown.groupby(drawdown_groups).sum().max()

    return float(max_dd), int(max_duration)


def calculate_calmar_ratio(total_return: float,
                          max_drawdown: float) -> float:
    """
    Calculate Calmar ratio (return / max drawdown).

    Args:
        total_return: Total return percentage
        max_drawdown: Maximum drawdown percentage (negative)

    Returns:
        Calmar ratio
    """
    if max_drawdown == 0:
        return 0.0

    return abs(total_return / max_drawdown)


def calculate_win_rate(trades: List[Trade]) -> float:
    """Calculate win rate percentage."""
    if not trades:
        return 0.0

    winners = sum(1 for t in trades if t.pnl > 0)
    return winners / len(trades) * 100


def calculate_profit_factor(trades: List[Trade]) -> float:
    """Calculate profit factor (gross profit / gross loss)."""
    if not trades:
        return 0.0

    gross_profit = sum(t.pnl for t in trades if t.pnl > 0)
    gross_loss = abs(sum(t.pnl for t in trades if t.pnl < 0))

    if gross_loss == 0:
        return float('inf') if gross_profit > 0 else 0.0

    return gross_profit / gross_loss


def calculate_expectancy(trades: List[Trade]) -> float:
    """
    Calculate expected value per trade.

    expectancy = (win_rate * avg_win) - (loss_rate * avg_loss)
    """
    if not trades:
        return 0.0

    winners = [t for t in trades if t.pnl > 0]
    losers = [t for t in trades if t.pnl <= 0]

    if not winners and not losers:
        return 0.0

    win_rate = len(winners) / len(trades)
    loss_rate = 1 - win_rate

    avg_win = np.mean([t.pnl for t in winners]) if winners else 0
    avg_loss = abs(np.mean([t.pnl for t in losers])) if losers else 0

    return (win_rate * avg_win) - (loss_rate * avg_loss)


def calculate_consecutive_runs(trades: List[Trade]) -> tuple:
    """
    Calculate max consecutive wins and losses.

    Returns:
        Tuple of (max_consecutive_wins, max_consecutive_losses)
    """
    if not trades:
        return 0, 0

    outcomes = [1 if t.pnl > 0 else 0 for t in trades]

    max_wins = 0
    max_losses = 0
    current_wins = 0
    current_losses = 0

    for outcome in outcomes:
        if outcome == 1:
            current_wins += 1
            current_losses = 0
            max_wins = max(max_wins, current_wins)
        else:
            current_losses += 1
            current_wins = 0
            max_losses = max(max_losses, current_losses)

    return max_wins, max_losses


def calculate_trade_stats(trades: List[Trade]) -> Dict[str, Any]:
    """
    Calculate comprehensive trade statistics.

    Args:
        trades: List of Trade objects

    Returns:
        Dictionary of trade statistics
    """
    if not trades:
        return {
            'total_trades': 0,
            'winning_trades': 0,
            'losing_trades': 0,
            'win_rate': 0.0,
            'profit_factor': 0.0,
            'avg_trade': 0.0,
            'avg_winner': 0.0,
            'avg_loser': 0.0,
            'largest_winner': 0.0,
            'largest_loser': 0.0,
            'avg_duration_seconds': 0,
            'max_consecutive_wins': 0,
            'max_consecutive_losses': 0,
            'expectancy': 0.0
        }

    pnls = [t.pnl for t in trades]
    winners = [t for t in trades if t.pnl > 0]
    losers = [t for t in trades if t.pnl <= 0]
    max_wins, max_losses = calculate_consecutive_runs(trades)

    return {
        'total_trades': len(trades),
        'winning_trades': len(winners),
        'losing_trades': len(losers),
        'win_rate': round(calculate_win_rate(trades), 2),
        'profit_factor': round(calculate_profit_factor(trades), 2),
        'avg_trade': round(np.mean(pnls), 2),
        'avg_winner': round(np.mean([t.pnl for t in winners]), 2) if winners else 0.0,
        'avg_loser': round(np.mean([t.pnl for t in losers]), 2) if losers else 0.0,
        'largest_winner': round(max(pnls), 2) if pnls else 0.0,
        'largest_loser': round(min(pnls), 2) if pnls else 0.0,
        'avg_duration_seconds': int(np.mean([t.duration_seconds for t in trades])),
        'max_consecutive_wins': max_wins,
        'max_consecutive_losses': max_losses,
        'expectancy': round(calculate_expectancy(trades), 2)
    }


def calculate_prop_firm_metrics(
    equity_curve: List[float],
    initial_capital: float,
    timestamps: Optional[List[Any]] = None,
    max_drawdown_percent: float = 10.0,
    daily_loss_percent: float = 5.0,
    target_percent: float = 10.0,
) -> Dict[str, Any]:
    """
    Calculate prop firm challenge compliance metrics.

    Tracks:
    - Max drawdown from initial capital (fixed, not trailing)
    - Daily loss from previous day's closing equity
    - Phase target reached (bar index / timestamp)
    - Breach detection (which bar, which rule)

    Args:
        equity_curve: List of equity values at each bar
        initial_capital: Starting capital
        timestamps: Optional list of bar timestamps (for day detection)
        max_drawdown_percent: Max allowed drawdown from initial capital
        daily_loss_percent: Max allowed daily loss from prev day equity
        target_percent: Profit target percentage

    Returns:
        Dictionary of prop firm metrics
    """
    if not equity_curve:
        return {
            'compliant': False,
            'max_drawdown_from_initial': 0.0,
            'max_drawdown_limit': max_drawdown_percent,
            'drawdown_breached': False,
            'drawdown_breach_bar': None,
            'daily_loss_breaches': 0,
            'daily_loss_breach_bars': [],
            'worst_daily_loss': 0.0,
            'daily_loss_limit': daily_loss_percent,
            'target_reached': False,
            'target_bar': None,
            'target_percent': target_percent,
            'compliance_percent': 0.0,
        }

    equity = np.array(equity_curve, dtype=np.float64)
    n = len(equity)

    # --- Max drawdown from initial capital (fixed) ---
    drawdown_from_initial = (equity - initial_capital) / initial_capital * 100
    max_dd_from_initial = float(drawdown_from_initial.min())

    drawdown_breached = max_dd_from_initial <= -max_drawdown_percent
    drawdown_breach_bar = None
    if drawdown_breached:
        breach_idx = np.where(drawdown_from_initial <= -max_drawdown_percent)[0]
        drawdown_breach_bar = int(breach_idx[0])

    # --- Daily loss tracking ---
    daily_loss_breaches = 0
    daily_loss_breach_bars = []
    worst_daily_loss = 0.0

    if timestamps is not None and len(timestamps) == n:
        # Convert timestamps to detect day boundaries
        ts_series = pd.Series(timestamps)
        try:
            ts_dates = pd.to_datetime(ts_series).dt.date
        except Exception:
            ts_dates = None

        if ts_dates is not None:
            prev_day_equity = initial_capital
            current_day = ts_dates.iloc[0]

            for i in range(n):
                bar_date = ts_dates.iloc[i]

                # New day detected
                if bar_date != current_day:
                    prev_day_equity = equity[i - 1]
                    current_day = bar_date

                # Check daily loss from previous day equity
                if prev_day_equity > 0:
                    daily_drawdown = (equity[i] - prev_day_equity) / prev_day_equity * 100
                    if daily_drawdown < worst_daily_loss:
                        worst_daily_loss = daily_drawdown
                    if daily_drawdown <= -daily_loss_percent:
                        daily_loss_breaches += 1
                        daily_loss_breach_bars.append(i)
    else:
        # No timestamps - skip daily loss tracking
        pass

    # --- Target reached ---
    profit_pct = (equity - initial_capital) / initial_capital * 100
    target_reached = bool(np.any(profit_pct >= target_percent))
    target_bar = None
    if target_reached:
        target_bar = int(np.where(profit_pct >= target_percent)[0][0])

    # --- Compliance ---
    compliant = not drawdown_breached and daily_loss_breaches == 0

    # Compliance percentage: fraction of bars without any breach
    bars_in_breach = 0
    if drawdown_breach_bar is not None:
        bars_in_breach = max(bars_in_breach, n - drawdown_breach_bar)
    # Daily loss breach bars count individually
    bars_in_breach = max(bars_in_breach, len(set(daily_loss_breach_bars)))
    compliance_percent = round((1 - bars_in_breach / n) * 100, 2) if n > 0 else 0.0

    return {
        'compliant': compliant,
        'max_drawdown_from_initial': round(max_dd_from_initial, 2),
        'max_drawdown_limit': max_drawdown_percent,
        'drawdown_breached': drawdown_breached,
        'drawdown_breach_bar': drawdown_breach_bar,
        'daily_loss_breaches': daily_loss_breaches,
        'daily_loss_breach_bars': daily_loss_breach_bars,
        'worst_daily_loss': round(worst_daily_loss, 2),
        'daily_loss_limit': daily_loss_percent,
        'target_reached': target_reached,
        'target_bar': target_bar,
        'target_percent': target_percent,
        'compliance_percent': compliance_percent,
    }


def calculate_all_metrics(equity_curve: List[float],
                         trades: List[Trade],
                         initial_capital: float,
                         periods_per_year: int = 252 * 24) -> Dict[str, Any]:
    """
    Calculate all backtest metrics.

    Args:
        equity_curve: List of equity values
        trades: List of Trade objects
        initial_capital: Starting capital
        periods_per_year: Periods per year for annualization

    Returns:
        Dictionary of all metrics
    """
    # Calculate returns
    returns = calculate_returns(equity_curve)
    final_equity = equity_curve[-1] if equity_curve else initial_capital

    # Performance metrics
    total_return = (final_equity - initial_capital) / initial_capital * 100
    sharpe = calculate_sharpe_ratio(returns, periods_per_year=periods_per_year)
    sortino = calculate_sortino_ratio(returns, periods_per_year=periods_per_year)
    max_dd, max_dd_duration = calculate_max_drawdown(equity_curve)
    calmar = calculate_calmar_ratio(total_return, max_dd)

    # Trade metrics
    trade_stats = calculate_trade_stats(trades)

    # Average drawdown
    equity = pd.Series(equity_curve)
    rolling_max = equity.expanding().max()
    drawdown = (equity - rolling_max) / rolling_max * 100
    avg_dd = drawdown[drawdown < 0].mean() if (drawdown < 0).any() else 0.0

    return {
        'initial_capital': initial_capital,
        'final_equity': round(final_equity, 2),
        'total_return': round(total_return, 2),
        'sharpe_ratio': round(sharpe, 2),
        'sortino_ratio': round(sortino, 2),
        'max_drawdown': round(max_dd, 2),
        'max_drawdown_duration': max_dd_duration,
        'calmar_ratio': round(calmar, 2),
        'avg_drawdown': round(avg_dd, 2),
        **trade_stats
    }
