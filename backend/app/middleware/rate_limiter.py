"""
Rate limiting middleware
"""

from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings
from app.core.database import cache
import time
import json

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware"""
    
    async def dispatch(self, request: Request, call_next):
        # Get client IP
        client_ip = request.client.host
        
        # Create rate limit key
        key = f"rate_limit:{client_ip}"
        
        # Get current request count
        current = cache.get(key)
        
        if current:
            data = json.loads(current)
            count = data["count"]
            start_time = data["start_time"]
            
            # Check if period has expired
            if time.time() - start_time > settings.RATE_LIMIT_PERIOD:
                # Reset counter
                data = {"count": 1, "start_time": time.time()}
                cache.set(key, json.dumps(data), expire=settings.RATE_LIMIT_PERIOD)
            elif count >= settings.RATE_LIMIT_REQUESTS:
                # Rate limit exceeded
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Rate limit exceeded. Please try again later."
                )
            else:
                # Increment counter
                data["count"] += 1
                cache.set(key, json.dumps(data), expire=settings.RATE_LIMIT_PERIOD)
        else:
            # First request
            data = {"count": 1, "start_time": time.time()}
            cache.set(key, json.dumps(data), expire=settings.RATE_LIMIT_PERIOD)
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers
        response.headers["X-RateLimit-Limit"] = str(settings.RATE_LIMIT_REQUESTS)
        response.headers["X-RateLimit-Remaining"] = str(
            settings.RATE_LIMIT_REQUESTS - data["count"]
        )
        response.headers["X-RateLimit-Reset"] = str(
            int(data["start_time"] + settings.RATE_LIMIT_PERIOD)
        )
        
        return response
