"""
Comprehensive API endpoints for CryptoForex platform
This file contains all endpoints for deposits, stablecoins, forex pairs, and trading
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import uuid
import json

from app.core.database import get_db, cache
from app.api.auth import get_current_user
from app.models.user import User
from app.models.wallet import Wallet, WalletType
from app.models.all_models import (
    Deposit, DepositMethod, TransactionStatus,
    Stablecoin, StablecoinHolding,
    ForexPair, ForexPairHolding, ForexPairPrice,
    Trade, TradeType, TradeSide, OrderType, TradeStatus
)

# Create routers
deposits_router = APIRouter(prefix="/deposits", tags=["Deposits"])
stablecoins_router = APIRouter(prefix="/stablecoins", tags=["Stablecoins"])
forex_pairs_router = APIRouter(prefix="/forex-pairs", tags=["Forex Pairs"])
trading_router = APIRouter(prefix="/trading", tags=["Trading"])

# ============= DEPOSITS ENDPOINTS =============

@deposits_router.post("/")
async def create_deposit(
    amount: float,
    currency: str,
    method: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new deposit request"""
    
    # Validate amount
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    # Create deposit record
    deposit = Deposit(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        currency=currency,
        amount=amount,
        method=DepositMethod[method.upper()],
        status=TransactionStatus.PENDING,
        fees=amount * 0.001  # 0.1% fee
    )
    
    db.add(deposit)
    
    # Update wallet balance (for demo, auto-approve)
    wallet = db.query(Wallet).filter(
        Wallet.user_id == current_user.id,
        Wallet.currency == currency
    ).first()
    
    if not wallet:
        # Create wallet if it doesn't exist
        wallet = Wallet(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            currency=currency,
            wallet_type=WalletType.FIAT if currency in ['USD', 'EUR', 'GBP', 'JPY'] else WalletType.CRYPTO,
            balance=0
        )
        db.add(wallet)
    
    # Add balance (in production, this would happen after payment confirmation)
    wallet.balance += amount - deposit.fees
    deposit.status = TransactionStatus.COMPLETED
    
    db.commit()
    
    return {
        "id": deposit.id,
        "amount": float(deposit.amount),
        "currency": deposit.currency,
        "status": deposit.status.value,
        "fees": float(deposit.fees),
        "created_at": deposit.created_at
    }

@deposits_router.get("/")
async def get_deposits(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 20
):
    """Get user's deposit history"""
    deposits = db.query(Deposit).filter(
        Deposit.user_id == current_user.id
    ).order_by(Deposit.created_at.desc()).offset(skip).limit(limit).all()
    
    return [{
        "id": d.id,
        "amount": float(d.amount),
        "currency": d.currency,
        "method": d.method.value,
        "status": d.status.value,
        "fees": float(d.fees),
        "created_at": d.created_at
    } for d in deposits]

# ============= STABLECOINS ENDPOINTS =============

@stablecoins_router.get("/")
async def get_stablecoins(db: Session = Depends(get_db)):
    """Get all available stablecoins"""
    
    # Check cache first
    cached = cache.get("stablecoins:list")
    if cached:
        return json.loads(cached)
    
    stablecoins = db.query(Stablecoin).filter(Stablecoin.is_active == True).all()
    
    # If no stablecoins exist, create default ones
    if not stablecoins:
        default_stablecoins = [
            {"symbol": "USDfx", "name": "USD Forex Token", "base_currency": "USD"},
            {"symbol": "EURfx", "name": "EUR Forex Token", "base_currency": "EUR"},
            {"symbol": "GBPfx", "name": "GBP Forex Token", "base_currency": "GBP"},
            {"symbol": "JPYfx", "name": "JPY Forex Token", "base_currency": "JPY"},
        ]
        
        for sc_data in default_stablecoins:
            stablecoin = Stablecoin(
                id=str(uuid.uuid4()),
                symbol=sc_data["symbol"],
                name=sc_data["name"],
                base_currency=sc_data["base_currency"],
                contract_address=f"0x{uuid.uuid4().hex[:40]}",  # Mock address
                decimals=18,
                is_active=True
            )
            db.add(stablecoin)
        
        db.commit()
        stablecoins = db.query(Stablecoin).filter(Stablecoin.is_active == True).all()
    
    result = [{
        "id": s.id,
        "symbol": s.symbol,
        "name": s.name,
        "base_currency": s.base_currency,
        "contract_address": s.contract_address,
        "total_supply": float(s.total_supply),
        "reserve_amount": float(s.reserve_amount)
    } for s in stablecoins]
    
    # Cache for 5 minutes
    cache.set("stablecoins:list", json.dumps(result), expire=300)
    
    return result

@stablecoins_router.post("/mint")
async def mint_stablecoin(
    stablecoin_symbol: str,
    amount: float,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mint new stablecoins"""
    
    # Get stablecoin
    stablecoin = db.query(Stablecoin).filter(
        Stablecoin.symbol == stablecoin_symbol
    ).first()
    
    if not stablecoin:
        raise HTTPException(status_code=404, detail="Stablecoin not found")
    
    # Check user has sufficient balance in base currency
    wallet = db.query(Wallet).filter(
        Wallet.user_id == current_user.id,
        Wallet.currency == stablecoin.base_currency
    ).first()
    
    if not wallet or wallet.available_balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Deduct from wallet
    wallet.balance -= amount
    
    # Get or create stablecoin holding
    holding = db.query(StablecoinHolding).filter(
        StablecoinHolding.user_id == current_user.id,
        StablecoinHolding.stablecoin_id == stablecoin.id
    ).first()
    
    if not holding:
        holding = StablecoinHolding(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            stablecoin_id=stablecoin.id,
            balance=0
        )
        db.add(holding)
    
    # Add minted amount
    holding.balance += amount
    stablecoin.total_supply += amount
    stablecoin.reserve_amount += amount
    
    db.commit()
    
    return {
        "symbol": stablecoin.symbol,
        "amount_minted": amount,
        "new_balance": float(holding.balance),
        "transaction_id": str(uuid.uuid4())
    }

# ============= FOREX PAIRS ENDPOINTS =============

@forex_pairs_router.get("/")
async def get_forex_pairs(db: Session = Depends(get_db)):
    """Get all available forex pairs"""
    
    pairs = db.query(ForexPair).filter(ForexPair.is_active == True).all()
    
    # Create default pairs if none exist
    if not pairs:
        stablecoins = db.query(Stablecoin).filter(Stablecoin.is_active == True).all()
        if len(stablecoins) >= 2:
            # Create USD/EUR pair
            usd_fx = next((s for s in stablecoins if s.symbol == "USDfx"), None)
            eur_fx = next((s for s in stablecoins if s.symbol == "EURfx"), None)
            
            if usd_fx and eur_fx:
                pair = ForexPair(
                    id=str(uuid.uuid4()),
                    symbol="USDEUR",
                    base_currency_id=usd_fx.id,
                    quote_currency_id=eur_fx.id,
                    contract_address=f"0x{uuid.uuid4().hex[:40]}",
                    is_active=True
                )
                db.add(pair)
                db.commit()
                pairs = [pair]
    
    return [{
        "id": p.id,
        "symbol": p.symbol,
        "base_currency": p.base_currency.symbol if p.base_currency else None,
        "quote_currency": p.quote_currency.symbol if p.quote_currency else None,
        "contract_address": p.contract_address
    } for p in pairs]

@forex_pairs_router.post("/create")
async def create_forex_pair(
    base_currency: str,
    quote_currency: str,
    initial_amount: float,
    allocation_percentage: float = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new forex pair position"""
    
    # Validate allocation
    if allocation_percentage <= 0 or allocation_percentage >= 100:
        raise HTTPException(status_code=400, detail="Allocation must be between 0 and 100")
    
    # Check user balance
    wallet = db.query(Wallet).filter(
        Wallet.user_id == current_user.id,
        Wallet.currency == "USD"  # Assuming USD base for simplicity
    ).first()
    
    if not wallet or wallet.available_balance < initial_amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Calculate allocations
    base_amount = initial_amount * (allocation_percentage / 100)
    quote_amount = initial_amount * ((100 - allocation_percentage) / 100)
    
    # Deduct from wallet
    wallet.balance -= initial_amount
    
    # Create or update forex pair holding (simplified)
    symbol = f"{base_currency}{quote_currency}"
    
    # Check if pair exists
    forex_pair = db.query(ForexPair).filter(ForexPair.symbol == symbol).first()
    if not forex_pair:
        # Create the pair (in production, this would deploy a smart contract)
        forex_pair = ForexPair(
            id=str(uuid.uuid4()),
            symbol=symbol,
            base_currency_id=str(uuid.uuid4()),  # Would link to actual stablecoin
            quote_currency_id=str(uuid.uuid4()),  # Would link to actual stablecoin
            contract_address=f"0x{uuid.uuid4().hex[:40]}",
            is_active=True
        )
        db.add(forex_pair)
    
    # Get or create holding
    holding = db.query(ForexPairHolding).filter(
        ForexPairHolding.user_id == current_user.id,
        ForexPairHolding.forex_pair_id == forex_pair.id
    ).first()
    
    if not holding:
        holding = ForexPairHolding(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            forex_pair_id=forex_pair.id,
            balance=0,
            avg_price=1.0  # Current exchange rate
        )
        db.add(holding)
    
    # Add to holding
    holding.balance += initial_amount
    
    db.commit()
    
    return {
        "pair": symbol,
        "amount_invested": initial_amount,
        "base_allocation": base_amount,
        "quote_allocation": quote_amount,
        "transaction_id": str(uuid.uuid4())
    }

# ============= TRADING ENDPOINTS =============

@trading_router.post("/place-order")
async def place_order(
    symbol: str,
    side: str,  # BUY or SELL
    amount: float,
    order_type: str = "MARKET",  # MARKET, LIMIT
    price: Optional[float] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Place a trading order"""
    
    # For market orders, get current price
    if order_type == "MARKET":
        # Get price from cache or calculate
        cached_price = cache.get(f"price:{symbol}")
        price = float(cached_price) if cached_price else 1.0  # Default to 1.0 for demo
    
    if not price:
        raise HTTPException(status_code=400, detail="Price required for limit orders")
    
    # Calculate total
    total = amount * price
    fees = total * 0.001  # 0.1% trading fee
    
    # Check user balance
    if side == "BUY":
        # Check USD balance for buying
        wallet = db.query(Wallet).filter(
            Wallet.user_id == current_user.id,
            Wallet.currency == "USD"
        ).first()
        
        if not wallet or wallet.available_balance < (total + fees):
            raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Create trade record
    trade = Trade(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        symbol=symbol,
        type=TradeType.BUY if side == "BUY" else TradeType.SELL,
        side=TradeSide.LONG,
        amount=amount,
        price=price,
        total=total,
        fees=fees,
        status=TradeStatus.PENDING,
        order_type=OrderType[order_type]
    )
    
    db.add(trade)
    
    # For market orders, execute immediately (simplified)
    if order_type == "MARKET":
        trade.status = TradeStatus.EXECUTED
        trade.executed_at = datetime.utcnow()
        
        # Update balances
        if side == "BUY":
            wallet.balance -= (total + fees)
    
    db.commit()
    
    return {
        "order_id": trade.id,
        "symbol": trade.symbol,
        "side": side,
        "amount": float(trade.amount),
        "price": float(trade.price),
        "total": float(trade.total),
        "fees": float(trade.fees),
        "status": trade.status.value
    }

@trading_router.get("/orders")
async def get_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 20
):
    """Get user's trading orders"""
    
    query = db.query(Trade).filter(Trade.user_id == current_user.id)
    
    if status:
        query = query.filter(Trade.status == TradeStatus[status.upper()])
    
    orders = query.order_by(Trade.created_at.desc()).offset(skip).limit(limit).all()
    
    return [{
        "id": o.id,
        "symbol": o.symbol,
        "type": o.type.value,
        "side": o.side.value,
        "amount": float(o.amount),
        "price": float(o.price),
        "total": float(o.total),
        "fees": float(o.fees),
        "status": o.status.value,
        "order_type": o.order_type.value,
        "created_at": o.created_at,
        "executed_at": o.executed_at
    } for o in orders]

@trading_router.delete("/cancel/{order_id}")
async def cancel_order(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel a pending order"""
    
    order = db.query(Trade).filter(
        Trade.id == order_id,
        Trade.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.status != TradeStatus.PENDING:
        raise HTTPException(status_code=400, detail="Can only cancel pending orders")
    
    order.status = TradeStatus.CANCELLED
    db.commit()
    
    return {"message": "Order cancelled successfully", "order_id": order_id}
