"""
Database configuration and session management
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import redis
from .config import settings

# PostgreSQL setup
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Redis setup
redis_client = redis.from_url(
    settings.REDIS_URL,
    decode_responses=True,
    socket_connect_timeout=5,
    socket_timeout=5,
    retry_on_timeout=True,
    health_check_interval=30
)

def get_db() -> Generator[Session, None, None]:
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_redis() -> redis.Redis:
    """Get Redis client"""
    return redis_client

# Cache utilities
class CacheManager:
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.prefix = settings.REDIS_PREFIX
    
    def get(self, key: str):
        """Get value from cache"""
        return self.redis.get(f"{self.prefix}{key}")
    
    def set(self, key: str, value: str, expire: int = 300):
        """Set value in cache with expiration"""
        return self.redis.setex(f"{self.prefix}{key}", expire, value)
    
    def delete(self, key: str):
        """Delete key from cache"""
        return self.redis.delete(f"{self.prefix}{key}")
    
    def exists(self, key: str) -> bool:
        """Check if key exists"""
        return self.redis.exists(f"{self.prefix}{key}") > 0
    
    def flush_pattern(self, pattern: str):
        """Delete all keys matching pattern"""
        cursor = 0
        while True:
            cursor, keys = self.redis.scan(
                cursor, 
                match=f"{self.prefix}{pattern}*",
                count=100
            )
            if keys:
                self.redis.delete(*keys)
            if cursor == 0:
                break

# Create cache manager instance
cache = CacheManager(redis_client)
