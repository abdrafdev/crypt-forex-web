"""
Consolidated models file for quick implementation
"""

from sqlalchemy import Column, String, Numeric, ForeignKey, DateTime, Enum as SQLEnum, UniqueConstraint, JSON, Boolean, Integer, func
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base

# Enums
class TransactionStatus(enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

class DepositMethod(enum.Enum):
    BANK_TRANSFER = "BANK_TRANSFER"
    CREDIT_CARD = "CREDIT_CARD"
    CRYPTO_TRANSFER = "CRYPTO_TRANSFER"
    STABLECOIN_TRANSFER = "STABLECOIN_TRANSFER"

class WithdrawalMethod(enum.Enum):
    BANK_TRANSFER = "BANK_TRANSFER"
    CRYPTO_TRANSFER = "CRYPTO_TRANSFER"
    STABLECOIN_TRANSFER = "STABLECOIN_TRANSFER"

class TradeType(enum.Enum):
    BUY = "BUY"
    SELL = "SELL"
    SWAP = "SWAP"

class TradeSide(enum.Enum):
    LONG = "LONG"
    SHORT = "SHORT"

class OrderType(enum.Enum):
    MARKET = "MARKET"
    LIMIT = "LIMIT"
    STOP_LOSS = "STOP_LOSS"
    TAKE_PROFIT = "TAKE_PROFIT"

class TradeStatus(enum.Enum):
    PENDING = "PENDING"
    EXECUTED = "EXECUTED"
    CANCELLED = "CANCELLED"
    FAILED = "FAILED"
    PARTIALLY_FILLED = "PARTIALLY_FILLED"

class WatchlistType(enum.Enum):
    CRYPTO = "CRYPTO"
    FOREX_PAIR = "FOREX_PAIR"
    STABLECOIN = "STABLECOIN"

# Models
class Deposit(Base):
    __tablename__ = "deposits"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    currency = Column(String, nullable=False)
    amount = Column(Numeric(18, 8), nullable=False)
    method = Column(SQLEnum(DepositMethod), nullable=False)
    status = Column(SQLEnum(TransactionStatus), default=TransactionStatus.PENDING)
    tx_hash = Column(String, nullable=True)
    payment_ref = Column(String, nullable=True)
    fees = Column(Numeric(18, 8), default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="deposits")

class Withdrawal(Base):
    __tablename__ = "withdrawals"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    currency = Column(String, nullable=False)
    amount = Column(Numeric(18, 8), nullable=False)
    method = Column(SQLEnum(WithdrawalMethod), nullable=False)
    status = Column(SQLEnum(TransactionStatus), default=TransactionStatus.PENDING)
    tx_hash = Column(String, nullable=True)
    address = Column(String, nullable=True)
    bank_details = Column(JSON, nullable=True)
    fees = Column(Numeric(18, 8), default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="withdrawals")

class Stablecoin(Base):
    __tablename__ = "stablecoins"
    
    id = Column(String, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    base_currency = Column(String, nullable=False)
    contract_address = Column(String, unique=True, nullable=False)
    decimals = Column(Integer, default=18)
    total_supply = Column(Numeric(28, 18), default=0)
    reserve_amount = Column(Numeric(18, 8), default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    holdings = relationship("StablecoinHolding", back_populates="stablecoin", cascade="all, delete-orphan")
    base_pairs = relationship("ForexPair", foreign_keys="ForexPair.base_currency_id", back_populates="base_currency")
    quote_pairs = relationship("ForexPair", foreign_keys="ForexPair.quote_currency_id", back_populates="quote_currency")

class StablecoinHolding(Base):
    __tablename__ = "stablecoin_holdings"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    stablecoin_id = Column(String, ForeignKey("stablecoins.id", ondelete="CASCADE"), nullable=False)
    balance = Column(Numeric(18, 8), default=0)
    locked_balance = Column(Numeric(18, 8), default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="stablecoin_holdings")
    stablecoin = relationship("Stablecoin", back_populates="holdings")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'stablecoin_id', name='_user_stablecoin_uc'),
    )

class ForexPair(Base):
    __tablename__ = "forex_pairs"
    
    id = Column(String, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True, nullable=False)
    base_currency_id = Column(String, ForeignKey("stablecoins.id"), nullable=False)
    quote_currency_id = Column(String, ForeignKey("stablecoins.id"), nullable=False)
    contract_address = Column(String, unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    base_currency = relationship("Stablecoin", foreign_keys=[base_currency_id], back_populates="base_pairs")
    quote_currency = relationship("Stablecoin", foreign_keys=[quote_currency_id], back_populates="quote_pairs")
    holdings = relationship("ForexPairHolding", back_populates="forex_pair", cascade="all, delete-orphan")
    prices = relationship("ForexPairPrice", back_populates="forex_pair", cascade="all, delete-orphan")
    trades = relationship("Trade", back_populates="forex_pair")

class ForexPairHolding(Base):
    __tablename__ = "forex_pair_holdings"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    forex_pair_id = Column(String, ForeignKey("forex_pairs.id", ondelete="CASCADE"), nullable=False)
    balance = Column(Numeric(18, 8), default=0)
    locked_balance = Column(Numeric(18, 8), default=0)
    avg_price = Column(Numeric(18, 8), default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="forex_pair_holdings")
    forex_pair = relationship("ForexPair", back_populates="holdings")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'forex_pair_id', name='_user_forexpair_uc'),
    )

class ForexPairPrice(Base):
    __tablename__ = "forex_pair_prices"
    
    id = Column(String, primary_key=True, index=True)
    forex_pair_id = Column(String, ForeignKey("forex_pairs.id", ondelete="CASCADE"), nullable=False)
    price = Column(Numeric(18, 8), nullable=False)
    change_24h = Column(Numeric(10, 4), default=0)
    volume_24h = Column(Numeric(20, 8), default=0)
    high_24h = Column(Numeric(18, 8), nullable=False)
    low_24h = Column(Numeric(18, 8), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    forex_pair = relationship("ForexPair", back_populates="prices")

class Trade(Base):
    __tablename__ = "trades"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    forex_pair_id = Column(String, ForeignKey("forex_pairs.id"), nullable=True)
    symbol = Column(String, nullable=False, index=True)
    type = Column(SQLEnum(TradeType), nullable=False)
    side = Column(SQLEnum(TradeSide), nullable=False)
    amount = Column(Numeric(18, 8), nullable=False)
    price = Column(Numeric(18, 8), nullable=False)
    total = Column(Numeric(18, 8), nullable=False)
    fees = Column(Numeric(18, 8), default=0)
    status = Column(SQLEnum(TradeStatus), default=TradeStatus.PENDING)
    order_type = Column(SQLEnum(OrderType), default=OrderType.MARKET)
    executed_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="trades")
    forex_pair = relationship("ForexPair", back_populates="trades")

class WatchlistItem(Base):
    __tablename__ = "watchlist_items"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    symbol = Column(String, nullable=False)
    type = Column(SQLEnum(WatchlistType), default=WatchlistType.CRYPTO)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="watchlist_items")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'symbol', name='_user_symbol_uc'),
    )

class CryptoPrice(Base):
    __tablename__ = "crypto_prices"
    
    id = Column(String, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True, nullable=False)
    price = Column(Numeric(18, 8), nullable=False)
    change_24h = Column(Numeric(10, 4), default=0)
    volume_24h = Column(Numeric(20, 8), default=0)
    market_cap = Column(Numeric(20, 8), default=0)
    high_24h = Column(Numeric(18, 8), nullable=False)
    low_24h = Column(Numeric(18, 8), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class LiquidityPool(Base):
    __tablename__ = "liquidity_pools"
    
    id = Column(String, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True, nullable=False)
    token0 = Column(String, nullable=False)
    token1 = Column(String, nullable=False)
    reserve0 = Column(Numeric(28, 18), default=0)
    reserve1 = Column(Numeric(28, 18), default=0)
    total_supply = Column(Numeric(28, 18), default=0)
    fee = Column(Numeric(5, 4), default=0.003)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
