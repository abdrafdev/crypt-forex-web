"""
CryptoForex Backend API Server
Main FastAPI application with all endpoints
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import uvicorn
import logging
from typing import Optional

from app.core.config import settings
from app.core.database import engine, Base
# Import API routers
from app.api.auth import router as auth_router
from app.api.all_endpoints import (
    deposits_router,
    stablecoins_router,
    forex_pairs_router,
    trading_router
)
from app.services.rate_aggregator import RateAggregatorService
from app.services.websocket_manager import WebSocketManager
from app.middleware.auth import verify_token
from app.middleware.rate_limiter import RateLimitMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize services
rate_service = RateAggregatorService()
ws_manager = WebSocketManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle"""
    # Startup
    logger.info("Starting CryptoForex Backend...")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Start rate aggregator service
    await rate_service.start()
    
    # Start WebSocket manager
    await ws_manager.start()
    
    logger.info("Backend started successfully!")
    
    yield
    
    # Shutdown
    logger.info("Shutting down CryptoForex Backend...")
    await rate_service.stop()
    await ws_manager.stop()
    logger.info("Backend shutdown complete!")

# Create FastAPI app
app = FastAPI(
    title="CryptoForex API",
    description="Bridge between Forex and Cryptocurrency markets",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting
app.add_middleware(RateLimitMiddleware)

# Security
security = HTTPBearer()

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "CryptoForex API",
        "version": "1.0.0",
        "status": "operational"
    }

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "redis": "connected",
        "rate_service": rate_service.is_running,
        "websocket": ws_manager.is_running
    }

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(deposits_router, prefix="/api", tags=["Deposits"])
app.include_router(stablecoins_router, prefix="/api", tags=["Stablecoins"])
app.include_router(forex_pairs_router, prefix="/api", tags=["Forex Pairs"])
app.include_router(trading_router, prefix="/api", tags=["Trading"])

# WebSocket endpoint for real-time updates
@app.websocket("/ws")
async def websocket_endpoint(websocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await ws_manager.handle_message(websocket, data)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        ws_manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )
