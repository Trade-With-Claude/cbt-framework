"""
CBT Framework Backtest Engine

A lightweight, from-scratch backtesting engine for trading strategies.
No external backtesting libraries required.
"""

from .metrics import (
    calculate_sharpe_ratio,
    calculate_sortino_ratio,
    calculate_max_drawdown,
    calculate_calmar_ratio,
    calculate_win_rate,
    calculate_profit_factor,
    calculate_expectancy,
    calculate_all_metrics,
    calculate_trade_stats
)

__version__ = '1.0.0'

__all__ = [
    'calculate_sharpe_ratio',
    'calculate_sortino_ratio',
    'calculate_max_drawdown',
    'calculate_calmar_ratio',
    'calculate_win_rate',
    'calculate_profit_factor',
    'calculate_expectancy',
    'calculate_all_metrics',
    'calculate_trade_stats'
]
