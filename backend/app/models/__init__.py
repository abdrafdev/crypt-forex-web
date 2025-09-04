"""
Database models for CryptoForex platform
"""

# Import User and KYCStatus from user.py
from .user import User, KYCStatus

# Import Wallet and WalletType from wallet.py
from .wallet import Wallet, WalletType

# Import everything else from all_models.py
from .all_models import (
    Deposit, DepositMethod,
    Withdrawal, WithdrawalMethod,
    Stablecoin, StablecoinHolding,
    ForexPair, ForexPairHolding, ForexPairPrice,
    Trade, TradeType, TradeSide, OrderType, TradeStatus,
    TransactionStatus,
    WatchlistItem, WatchlistType,
    CryptoPrice,
    LiquidityPool
)

__all__ = [
    'User', 'KYCStatus',
    'Wallet', 'WalletType',
    'Deposit', 'DepositMethod',
    'Withdrawal', 'WithdrawalMethod',
    'Stablecoin', 'StablecoinHolding',
    'ForexPair', 'ForexPairHolding', 'ForexPairPrice',
    'Trade', 'TradeType', 'TradeSide', 'OrderType', 'TradeStatus',
    'TransactionStatus',
    'WatchlistItem', 'WatchlistType',
    'CryptoPrice',
    'LiquidityPool'
]
