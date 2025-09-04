"""
Application configuration using Pydantic settings
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "CryptoForex"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str = "postgresql://forexuser:forexpass@localhost:5432/cryptoforex"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_PREFIX: str = "cryptoforex:"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://cryptoforex.vercel.app"
    ]
    
    # Blockchain
    ETHEREUM_RPC_URL: str = "https://mainnet.infura.io/v3/your-infura-key"
    POLYGON_RPC_URL: str = "https://polygon-rpc.com"
    PRIVATE_KEY: str = "your-deployment-private-key"
    CONTRACT_ADDRESSES: dict = {
        "stablecoin_factory": "",
        "forex_pair_factory": "",
        "trading_engine": "",
        "treasury": ""
    }
    
    # External APIs
    ALPHA_VANTAGE_API_KEY: str = "demo"
    FOREX_COM_API_KEY: str = "your-forex-com-api-key"
    COINBASE_API_KEY: str = "your-coinbase-api-key"
    COINBASE_API_SECRET: str = "your-coinbase-api-secret"
    COINGECKO_API_KEY: str = "your-coingecko-api-key"
    
    # KYC Providers
    KYC_PROVIDER: str = "jumio"  # jumio, onfido, sumsub
    JUMIO_API_KEY: str = "your-jumio-api-key"
    JUMIO_API_SECRET: str = "your-jumio-api-secret"
    
    # Payment Providers
    STRIPE_SECRET_KEY: str = "sk_test_your-stripe-secret-key"
    STRIPE_WEBHOOK_SECRET: str = "whsec_your-stripe-webhook-secret"
    
    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = "your-email@gmail.com"
    SMTP_PASSWORD: str = "your-app-password"
    FROM_EMAIL: str = "noreply@cryptoforex.com"
    
    # Trading Settings
    MIN_DEPOSIT_USD: float = 100.0
    MAX_DEPOSIT_USD: float = 1000000.0
    TRADING_FEE_PERCENT: float = 0.1  # 0.1%
    WITHDRAWAL_FEE_PERCENT: float = 0.5  # 0.5%
    MAX_SLIPPAGE_PERCENT: float = 5.0  # 5%
    
    # Rate Limits
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60  # seconds
    
    # Monitoring
    PROMETHEUS_ENABLED: bool = True
    PROMETHEUS_PORT: int = 9090
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/cryptoforex.log"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Create necessary directories
Path("logs").mkdir(exist_ok=True)
Path("uploads").mkdir(exist_ok=True)
