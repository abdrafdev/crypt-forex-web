"""
Standalone CryptoForex Backend Server for Testing
This server runs without external dependencies (PostgreSQL, Redis)
Uses in-memory storage for testing purposes
"""

from fastapi import FastAPI, HTTPException, Depends, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import uvicorn
import logging
import json
import uuid
import hashlib
import asyncio
import random
from jose import JWTError, jwt

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage
USERS_DB = {}
DEPOSITS_DB = {}
STABLECOINS_DB = {
    "USDfx": {"symbol": "USDfx", "name": "USD Forex Token", "base_currency": "USD", "contract_address": f"0x{'1'*40}", "total_supply": 1000000, "reserve_amount": 1000000},
    "EURfx": {"symbol": "EURfx", "name": "EUR Forex Token", "base_currency": "EUR", "contract_address": f"0x{'2'*40}", "total_supply": 500000, "reserve_amount": 500000},
    "GBPfx": {"symbol": "GBPfx", "name": "GBP Forex Token", "base_currency": "GBP", "contract_address": f"0x{'3'*40}", "total_supply": 300000, "reserve_amount": 300000},
    "JPYfx": {"symbol": "JPYfx", "name": "JPY Forex Token", "base_currency": "JPY", "contract_address": f"0x{'4'*40}", "total_supply": 200000, "reserve_amount": 200000},
}
FOREX_PAIRS_DB = {}
TRADES_DB = {}
WALLETS_DB = {}
WEBSOCKET_CONNECTIONS = set()

# Configuration
SECRET_KEY = "test-secret-key-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Security
security = HTTPBearer()

# Pydantic models
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserLogin(BaseModel):
    email_or_username: str
    password: str

class DepositCreate(BaseModel):
    amount: float
    currency: str
    method: str

class MintStablecoin(BaseModel):
    stablecoin_symbol: str
    amount: float

class CreateForexPair(BaseModel):
    base_currency: str
    quote_currency: str
    initial_amount: float
    allocation_percentage: float = 50

class PlaceOrder(BaseModel):
    symbol: str
    side: str
    amount: float
    order_type: str = "MARKET"
    price: Optional[float] = None

# Helper functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user(user_id: str = Depends(verify_token)):
    if user_id not in USERS_DB:
        raise HTTPException(status_code=404, detail="User not found")
    return USERS_DB[user_id]

# Lifespan manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting CryptoForex Test Backend...")
    # Start background task for WebSocket updates
    asyncio.create_task(broadcast_updates())
    yield
    logger.info("Shutting down CryptoForex Test Backend...")

# Create FastAPI app
app = FastAPI(
    title="CryptoForex Test API",
    description="Standalone test server with mock data",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Background task for WebSocket updates
async def broadcast_updates():
    while True:
        await asyncio.sleep(5)
        if WEBSOCKET_CONNECTIONS:
            price_update = {
                "type": "price_update",
                "data": {
                    "BTC/USD": 45000 + random.uniform(-100, 100),
                    "ETH/USD": 3000 + random.uniform(-50, 50),
                    "USD/EUR": 0.85 + random.uniform(-0.01, 0.01),
                },
                "timestamp": datetime.now().isoformat()
            }
            disconnected = set()
            for websocket in WEBSOCKET_CONNECTIONS:
                try:
                    await websocket.send_json(price_update)
                except:
                    disconnected.add(websocket)
            WEBSOCKET_CONNECTIONS.difference_update(disconnected)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "CryptoForex Test API",
        "version": "1.0.0",
        "status": "operational"
    }

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "in-memory",
        "redis": "in-memory",
        "rate_service": True,
        "websocket": True
    }

# Authentication endpoints
@app.post("/api/auth/register")
async def register(user: UserCreate):
    # Check if user exists
    for uid, u in USERS_DB.items():
        if u["email"] == user.email or u["username"] == user.username:
            raise HTTPException(status_code=400, detail="User already exists")
    
    user_id = str(uuid.uuid4())
    USERS_DB[user_id] = {
        "id": user_id,
        "email": user.email,
        "username": user.username,
        "password": hash_password(user.password),
        "first_name": user.first_name,
        "last_name": user.last_name,
        "kyc_status": "PENDING",
        "created_at": datetime.now().isoformat()
    }
    
    # Create wallet
    WALLETS_DB[user_id] = {
        "USD": {"balance": 10000, "locked": 0},
        "EUR": {"balance": 5000, "locked": 0},
        "BTC": {"balance": 0.5, "locked": 0},
        "ETH": {"balance": 10, "locked": 0}
    }
    
    token = create_access_token({"sub": user_id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {k: v for k, v in USERS_DB[user_id].items() if k != "password"}
    }

@app.post("/api/auth/login")
async def login(user: UserLogin):
    for uid, u in USERS_DB.items():
        if (u["email"] == user.email_or_username or u["username"] == user.email_or_username):
            if verify_password(user.password, u["password"]):
                token = create_access_token({"sub": uid})
                return {
                    "access_token": token,
                    "token_type": "bearer",
                    "user": {k: v for k, v in u.items() if k != "password"}
                }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/auth/me")
async def get_me(current_user = Depends(get_current_user)):
    return {k: v for k, v in current_user.items() if k != "password"}

@app.post("/api/auth/logout")
async def logout():
    return {"message": "Successfully logged out"}

@app.post("/api/auth/refresh")
async def refresh_token(current_user = Depends(get_current_user)):
    token = create_access_token({"sub": current_user["id"]})
    return {"access_token": token, "token_type": "bearer"}

# Deposits endpoints
@app.post("/api/deposits")
async def create_deposit(deposit: DepositCreate, current_user = Depends(get_current_user)):
    deposit_id = str(uuid.uuid4())
    DEPOSITS_DB[deposit_id] = {
        "id": deposit_id,
        "user_id": current_user["id"],
        "amount": deposit.amount,
        "currency": deposit.currency,
        "method": deposit.method,
        "status": "COMPLETED",
        "fees": deposit.amount * 0.001,
        "created_at": datetime.now().isoformat()
    }
    
    # Update wallet
    if current_user["id"] in WALLETS_DB:
        if deposit.currency not in WALLETS_DB[current_user["id"]]:
            WALLETS_DB[current_user["id"]][deposit.currency] = {"balance": 0, "locked": 0}
        WALLETS_DB[current_user["id"]][deposit.currency]["balance"] += deposit.amount
    
    return DEPOSITS_DB[deposit_id]

@app.get("/api/deposits")
async def get_deposits(current_user = Depends(get_current_user)):
    user_deposits = [d for d in DEPOSITS_DB.values() if d["user_id"] == current_user["id"]]
    return user_deposits

# Stablecoins endpoints
@app.get("/api/stablecoins")
async def get_stablecoins():
    return list(STABLECOINS_DB.values())

@app.post("/api/stablecoins/mint")
async def mint_stablecoin(mint: MintStablecoin, current_user = Depends(get_current_user)):
    if mint.stablecoin_symbol not in STABLECOINS_DB:
        raise HTTPException(status_code=404, detail="Stablecoin not found")
    
    # Check balance
    base_currency = STABLECOINS_DB[mint.stablecoin_symbol]["base_currency"]
    if current_user["id"] not in WALLETS_DB or base_currency not in WALLETS_DB[current_user["id"]]:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    if WALLETS_DB[current_user["id"]][base_currency]["balance"] < mint.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Deduct balance and mint
    WALLETS_DB[current_user["id"]][base_currency]["balance"] -= mint.amount
    
    # Add minted stablecoins
    if mint.stablecoin_symbol not in WALLETS_DB[current_user["id"]]:
        WALLETS_DB[current_user["id"]][mint.stablecoin_symbol] = {"balance": 0, "locked": 0}
    WALLETS_DB[current_user["id"]][mint.stablecoin_symbol]["balance"] += mint.amount
    
    return {
        "symbol": mint.stablecoin_symbol,
        "amount_minted": mint.amount,
        "new_balance": WALLETS_DB[current_user["id"]][mint.stablecoin_symbol]["balance"],
        "transaction_id": str(uuid.uuid4())
    }

# Forex pairs endpoints
@app.get("/api/forex-pairs")
async def get_forex_pairs():
    if not FOREX_PAIRS_DB:
        # Create default pairs
        FOREX_PAIRS_DB["USDEUR"] = {
            "id": str(uuid.uuid4()),
            "symbol": "USDEUR",
            "base_currency": "USDfx",
            "quote_currency": "EURfx",
            "contract_address": f"0x{'5'*40}"
        }
    return list(FOREX_PAIRS_DB.values())

@app.post("/api/forex-pairs/create")
async def create_forex_pair(pair: CreateForexPair, current_user = Depends(get_current_user)):
    symbol = f"{pair.base_currency}{pair.quote_currency}"
    
    # Check balance
    if current_user["id"] not in WALLETS_DB or "USD" not in WALLETS_DB[current_user["id"]]:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    if WALLETS_DB[current_user["id"]]["USD"]["balance"] < pair.initial_amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Deduct balance
    WALLETS_DB[current_user["id"]]["USD"]["balance"] -= pair.initial_amount
    
    # Create pair
    if symbol not in FOREX_PAIRS_DB:
        FOREX_PAIRS_DB[symbol] = {
            "id": str(uuid.uuid4()),
            "symbol": symbol,
            "base_currency": f"{pair.base_currency}fx",
            "quote_currency": f"{pair.quote_currency}fx",
            "contract_address": f"0x{uuid.uuid4().hex[:40]}"
        }
    
    return {
        "pair": symbol,
        "amount_invested": pair.initial_amount,
        "base_allocation": pair.initial_amount * (pair.allocation_percentage / 100),
        "quote_allocation": pair.initial_amount * ((100 - pair.allocation_percentage) / 100),
        "transaction_id": str(uuid.uuid4())
    }

# Trading endpoints
@app.post("/api/trading/place-order")
async def place_order(order: PlaceOrder, current_user = Depends(get_current_user)):
    order_id = str(uuid.uuid4())
    price = order.price if order.price else 1.0
    total = order.amount * price
    fees = total * 0.001
    
    # Check balance
    if order.side == "BUY":
        if current_user["id"] not in WALLETS_DB or "USD" not in WALLETS_DB[current_user["id"]]:
            raise HTTPException(status_code=400, detail="Insufficient balance")
        if WALLETS_DB[current_user["id"]]["USD"]["balance"] < (total + fees):
            raise HTTPException(status_code=400, detail="Insufficient balance")
        WALLETS_DB[current_user["id"]]["USD"]["balance"] -= (total + fees)
    
    TRADES_DB[order_id] = {
        "order_id": order_id,
        "user_id": current_user["id"],
        "symbol": order.symbol,
        "side": order.side,
        "amount": order.amount,
        "price": price,
        "total": total,
        "fees": fees,
        "status": "EXECUTED" if order.order_type == "MARKET" else "PENDING",
        "order_type": order.order_type,
        "created_at": datetime.now().isoformat(),
        "executed_at": datetime.now().isoformat() if order.order_type == "MARKET" else None
    }
    
    return TRADES_DB[order_id]

@app.get("/api/trading/orders")
async def get_orders(current_user = Depends(get_current_user)):
    user_orders = [t for t in TRADES_DB.values() if t["user_id"] == current_user["id"]]
    return user_orders

@app.delete("/api/trading/cancel/{order_id}")
async def cancel_order(order_id: str, current_user = Depends(get_current_user)):
    if order_id not in TRADES_DB:
        raise HTTPException(status_code=404, detail="Order not found")
    if TRADES_DB[order_id]["user_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    if TRADES_DB[order_id]["status"] != "PENDING":
        raise HTTPException(status_code=400, detail="Can only cancel pending orders")
    
    TRADES_DB[order_id]["status"] = "CANCELLED"
    return {"message": "Order cancelled successfully", "order_id": order_id}

# Market data endpoints
@app.get("/api/market/data")
async def get_market_data():
    return {
        "total_market_cap": 2150000000000 + random.uniform(-50000000000, 50000000000),
        "total_volume_24h": 125000000000 + random.uniform(-10000000000, 10000000000),
        "btc_dominance": 45.5 + random.uniform(-2, 2),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/market/prices")
async def get_prices(symbols: str):
    symbol_list = symbols.split(",")
    prices = {}
    for symbol in symbol_list:
        if symbol == "BTC":
            prices[symbol] = 45000 + random.uniform(-500, 500)
        elif symbol == "ETH":
            prices[symbol] = 3000 + random.uniform(-100, 100)
        elif symbol == "USD":
            prices[symbol] = 1.0
        elif symbol == "EUR":
            prices[symbol] = 1.10
        else:
            prices[symbol] = random.uniform(0.1, 100)
    return prices

@app.get("/api/market/bubbles")
async def get_bubbles():
    return [
        {"id": "btc", "symbol": "BTC", "name": "Bitcoin", "marketCap": 880000000000, "priceChange24h": random.uniform(-5, 5), "volume24h": 25000000000, "category": "crypto", "color": "#f7931a", "size": 100},
        {"id": "eth", "symbol": "ETH", "name": "Ethereum", "marketCap": 360000000000, "priceChange24h": random.uniform(-5, 5), "volume24h": 15000000000, "category": "crypto", "color": "#627eea", "size": 80},
        {"id": "usdfx", "symbol": "USDfx", "name": "USD Forex Token", "marketCap": 15000000000, "priceChange24h": random.uniform(-1, 1), "volume24h": 1000000000, "category": "stablecoin", "color": "#3b82f6", "size": 40},
        {"id": "eurfx", "symbol": "EURfx", "name": "EUR Forex Token", "marketCap": 12000000000, "priceChange24h": random.uniform(-1, 1), "volume24h": 800000000, "category": "stablecoin", "color": "#3b82f6", "size": 35},
    ]

@app.get("/api/market/forex/rates")
async def get_forex_rates():
    return [
        {"pair": "USD/EUR", "rate": 0.85 + random.uniform(-0.01, 0.01), "bid": 0.8495, "ask": 0.8505, "timestamp": datetime.now().isoformat()},
        {"pair": "GBP/USD", "rate": 1.27 + random.uniform(-0.01, 0.01), "bid": 1.2695, "ask": 1.2705, "timestamp": datetime.now().isoformat()},
        {"pair": "USD/JPY", "rate": 110 + random.uniform(-1, 1), "bid": 109.95, "ask": 110.05, "timestamp": datetime.now().isoformat()},
    ]

@app.get("/api/market/crypto/rates")
async def get_crypto_rates():
    return [
        {"symbol": "BTC", "price": 45000 + random.uniform(-500, 500), "change_24h": random.uniform(-5, 5), "volume_24h": 25000000000, "timestamp": datetime.now().isoformat()},
        {"symbol": "ETH", "price": 3000 + random.uniform(-100, 100), "change_24h": random.uniform(-5, 5), "volume_24h": 15000000000, "timestamp": datetime.now().isoformat()},
        {"symbol": "USDT", "price": 1.0, "change_24h": 0, "volume_24h": 50000000000, "timestamp": datetime.now().isoformat()},
    ]

@app.get("/api/market/chart/{symbol}")
async def get_chart_data(symbol: str, interval: str = "1h", limit: int = 24):
    chart_data = []
    base_price = 100
    for i in range(limit):
        open_price = base_price * (1 + random.uniform(-0.02, 0.02))
        high = open_price * (1 + random.uniform(0, 0.03))
        low = open_price * (1 - random.uniform(0, 0.03))
        close = random.uniform(low, high)
        chart_data.append({
            "timestamp": int((datetime.now() - timedelta(hours=limit-i)).timestamp() * 1000),
            "open": open_price,
            "high": high,
            "low": low,
            "close": close,
            "volume": random.uniform(1000000, 10000000)
        })
        base_price = close
    return chart_data

@app.get("/api/market/stats")
async def get_market_stats():
    return {
        "24h_volume": 125000000000 + random.uniform(-10000000000, 10000000000),
        "24h_trades": random.randint(1000000, 2000000),
        "active_traders": random.randint(50000, 100000),
        "timestamp": datetime.now().isoformat()
    }

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    WEBSOCKET_CONNECTIONS.add(websocket)
    
    # Send initial connection message
    await websocket.send_json({
        "type": "connection",
        "status": "connected",
        "timestamp": datetime.now().isoformat()
    })
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "subscribe":
                await websocket.send_json({
                    "type": "subscription",
                    "channel": message.get("channel"),
                    "status": "subscribed",
                    "timestamp": datetime.now().isoformat()
                })
            elif message.get("type") == "ping":
                await websocket.send_json({
                    "type": "pong",
                    "timestamp": datetime.now().isoformat()
                })
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        WEBSOCKET_CONNECTIONS.remove(websocket)

if __name__ == "__main__":
    print("\n" + "="*50)
    print("🚀 CryptoForex Standalone Test Server")
    print("="*50)
    print("\n✅ Starting server on http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("\n⚠️  This is a test server with in-memory storage")
    print("Data will be lost when the server stops\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
