"""
SQLAlchemy database models
"""

from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Enum, JSON, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from datetime import datetime
from app.core.database import Base

class KYCStatus(enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    REQUIRES_REVIEW = "REQUIRES_REVIEW"

class WalletType(enum.Enum):
    FIAT = "FIAT"
    CRYPTO = "CRYPTO"
    STABLECOIN = "STABLECOIN"

class DepositMethod(enum.Enum):
    BANK_TRANSFER = "BANK_TRANSFER"
    CREDIT_CARD = "CREDIT_CARD"
    CRYPTO_TRANSFER = "CRYPTO_TRANSFER"
    STABLECOIN_TRANSFER = "STABLECOIN_TRANSFER"

class TransactionStatus(enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

class TradeType(enum.Enum):
    BUY = "BUY"
    SELL = "SELL"
    SWAP = "SWAP"

class OrderType(enum.Enum):
    MARKET = "MARKET"
    LIMIT = "LIMIT"
    STOP_LOSS = "STOP_LOSS"
    TAKE_PROFIT = "TAKE_PROFIT"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    email_verified = Column(DateTime)
    kyc_status = Column(Enum(KYCStatus), default=KYCStatus.PENDING)
    kyc_data = Column(JSON)
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    wallets = relationship("Wallet", back_populates="user", cascade="all, delete-orphan")
    deposits = relationship("Deposit", back_populates="user")
    withdrawals = relationship("Withdrawal", back_populates="user")
    trades = relationship("Trade", back_populates="user")
    stablecoin_holdings = relationship("StablecoinHolding", back_populates="user")
    forex_pair_holdings = relationship("ForexPairHolding", back_populates="user")

class Wallet(Base):
    __tablename__ = "wallets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    currency = Column(String, nullable=False)
    balance = Column(Numeric(precision=20, scale=8), default=0)
    locked_balance = Column(Numeric(precision=20, scale=8), default=0)
    wallet_type = Column(Enum(WalletType), nullable=False)
    address = Column(String)
    private_key_encrypted = Column(String)  # Encrypted private key
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="wallets")

class Deposit(Base):
    __tablename__ = "deposits"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    currency = Column(String, nullable=False)
    amount = Column(Numeric(precision=20, scale=8), nullable=False)
    method = Column(Enum(DepositMethod), nullable=False)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    tx_hash = Column(String)
    payment_ref = Column(String)
    fees = Column(Numeric(precision=20, scale=8), default=0)
    metadata = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="deposits")

class Withdrawal(Base):
    __tablename__ = "withdrawals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    currency = Column(String, nullable=False)
    amount = Column(Numeric(precision=20, scale=8), nullable=False)
    method = Column(String, nullable=False)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    tx_hash = Column(String)
    address = Column(String)
    bank_details = Column(JSON)
    fees = Column(Numeric(precision=20, scale=8), default=0)
    metadata = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="withdrawals")

class Stablecoin(Base):
    __tablename__ = "stablecoins"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    base_currency = Column(String, nullable=False)
    contract_address = Column(String, unique=True)
    decimals = Column(Integer, default=18)
    total_supply = Column(Numeric(precision=30, scale=8), default=0)
    reserve_amount = Column(Numeric(precision=30, scale=8), default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    holdings = relationship("StablecoinHolding", back_populates="stablecoin")

class StablecoinHolding(Base):
    __tablename__ = "stablecoin_holdings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stablecoin_id = Column(Integer, ForeignKey("stablecoins.id"), nullable=False)
    balance = Column(Numeric(precision=30, scale=8), default=0)
    locked_balance = Column(Numeric(precision=30, scale=8), default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="stablecoin_holdings")
    stablecoin = relationship("Stablecoin", back_populates="holdings")

class ForexPair(Base):
    __tablename__ = "forex_pairs"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True, nullable=False)
    base_currency_id = Column(Integer, ForeignKey("stablecoins.id"), nullable=False)
    quote_currency_id = Column(Integer, ForeignKey("stablecoins.id"), nullable=False)
    contract_address = Column(String, unique=True)
    total_liquidity = Column(Numeric(precision=30, scale=8), default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    base_currency = relationship("Stablecoin", foreign_keys=[base_currency_id])
    quote_currency = relationship("Stablecoin", foreign_keys=[quote_currency_id])
    holdings = relationship("ForexPairHolding", back_populates="forex_pair")
    trades = relationship("Trade", back_populates="forex_pair")

class ForexPairHolding(Base):
    __tablename__ = "forex_pair_holdings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    forex_pair_id = Column(Integer, ForeignKey("forex_pairs.id"), nullable=False)
    balance = Column(Numeric(precision=30, scale=8), default=0)
    locked_balance = Column(Numeric(precision=30, scale=8), default=0)
    avg_price = Column(Numeric(precision=20, scale=8), default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="forex_pair_holdings")
    forex_pair = relationship("ForexPair", back_populates="holdings")

class Trade(Base):
    __tablename__ = "trades"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    forex_pair_id = Column(Integer, ForeignKey("forex_pairs.id"))
    symbol = Column(String, nullable=False)
    type = Column(Enum(TradeType), nullable=False)
    side = Column(String)  # LONG or SHORT
    amount = Column(Numeric(precision=20, scale=8), nullable=False)
    price = Column(Numeric(precision=20, scale=8), nullable=False)
    total = Column(Numeric(precision=20, scale=8), nullable=False)
    fees = Column(Numeric(precision=20, scale=8), default=0)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    order_type = Column(Enum(OrderType), default=OrderType.MARKET)
    executed_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))
    metadata = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="trades")
    forex_pair = relationship("ForexPair", back_populates="trades")

class PriceHistory(Base):
    __tablename__ = "price_history"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True, nullable=False)
    price = Column(Numeric(precision=20, scale=8), nullable=False)
    volume_24h = Column(Numeric(precision=30, scale=8))
    market_cap = Column(Numeric(precision=30, scale=8))
    change_24h = Column(Float)
    high_24h = Column(Numeric(precision=20, scale=8))
    low_24h = Column(Numeric(precision=20, scale=8))
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)

class LiquidityPool(Base):
    __tablename__ = "liquidity_pools"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True, nullable=False)
    token0 = Column(String, nullable=False)
    token1 = Column(String, nullable=False)
    reserve0 = Column(Numeric(precision=30, scale=8), default=0)
    reserve1 = Column(Numeric(precision=30, scale=8), default=0)
    total_supply = Column(Numeric(precision=30, scale=8), default=0)
    fee = Column(Numeric(precision=5, scale=4), default=0.003)  # 0.3%
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
