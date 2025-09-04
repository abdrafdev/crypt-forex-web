"""
Wallet model for multi-currency support
"""

from sqlalchemy import Column, String, Numeric, ForeignKey, DateTime, Enum as SQLEnum, UniqueConstraint, func
from sqlalchemy.orm import relationship
import enum
from app.core.database import Base

class WalletType(enum.Enum):
    FIAT = "FIAT"
    CRYPTO = "CRYPTO"
    STABLECOIN = "STABLECOIN"

class Wallet(Base):
    __tablename__ = "wallets"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    currency = Column(String, nullable=False, index=True)
    balance = Column(Numeric(18, 8), default=0, nullable=False)
    locked_balance = Column(Numeric(18, 8), default=0, nullable=False)
    wallet_type = Column(SQLEnum(WalletType), nullable=False)
    address = Column(String, nullable=True)  # For crypto wallets
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="wallets")
    
    # Unique constraint
    __table_args__ = (
        UniqueConstraint('user_id', 'currency', 'wallet_type', name='_user_currency_type_uc'),
    )
    
    @property
    def available_balance(self):
        """Calculate available balance (total - locked)"""
        return float(self.balance - self.locked_balance)
    
    def can_withdraw(self, amount: float) -> bool:
        """Check if withdrawal is possible"""
        return self.available_balance >= amount
