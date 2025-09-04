"""
User model and authentication
"""

from sqlalchemy import Column, String, Boolean, DateTime, Enum as SQLEnum, JSON, func
from sqlalchemy.orm import relationship
from passlib.context import CryptContext
import enum
from app.core.database import Base

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class KYCStatus(enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    REQUIRES_REVIEW = "REQUIRES_REVIEW"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    email_verified = Column(DateTime, nullable=True)
    kyc_status = Column(SQLEnum(KYCStatus), default=KYCStatus.PENDING)
    kyc_data = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    wallets = relationship("Wallet", back_populates="user", cascade="all, delete-orphan")
    deposits = relationship("Deposit", back_populates="user", cascade="all, delete-orphan")
    withdrawals = relationship("Withdrawal", back_populates="user", cascade="all, delete-orphan")
    stablecoin_holdings = relationship("StablecoinHolding", back_populates="user", cascade="all, delete-orphan")
    forex_pair_holdings = relationship("ForexPairHolding", back_populates="user", cascade="all, delete-orphan")
    trades = relationship("Trade", back_populates="user", cascade="all, delete-orphan")
    watchlist_items = relationship("WatchlistItem", back_populates="user", cascade="all, delete-orphan")
    
    def verify_password(self, plain_password: str) -> bool:
        """Verify a plain password against the hash"""
        return pwd_context.verify(plain_password, self.hashed_password)
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        """Hash a password"""
        return pwd_context.hash(password)
    
    @property
    def full_name(self) -> str:
        """Get user's full name"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username
