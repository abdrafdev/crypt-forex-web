"""
Market Data API endpoints
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict
import json

from app.services.rate_aggregator import RateAggregatorService
from app.core.database import cache

router = APIRouter()
rate_service = RateAggregatorService()

@router.get("/rates")
async def get_forex_rates(
    pairs: Optional[str] = Query(None, description="Comma-separated list of pairs")
):
    """
    Get real-time forex and crypto rates
    """
    try:
        # Get all rates
        all_rates = await rate_service.get_all_rates()
        
        # Filter if specific pairs requested
        if pairs:
            requested_pairs = pairs.split(",")
            filtered_rates = {
                pair: data 
                for pair, data in all_rates.items() 
                if pair in requested_pairs
            }
            return {
                "success": True,
                "data": filtered_rates,
                "count": len(filtered_rates)
            }
        
        return {
            "success": True,
            "data": all_rates,
            "count": len(all_rates)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/rates/{pair}")
async def get_rate(pair: str):
    """
    Get rate for a specific currency pair
    Format: USD/EUR, BTC/USD, etc.
    """
    try:
        # Replace hyphen with slash for flexibility
        pair = pair.replace("-", "/")
        
        rate_data = await rate_service.get_rate(pair)
        
        if not rate_data:
            raise HTTPException(status_code=404, detail=f"Rate not found for {pair}")
        
        return {
            "success": True,
            "data": rate_data
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/historical/{symbol}")
async def get_historical_data(
    symbol: str,
    interval: str = Query("1d", regex="^(1h|1d|1w|1m)$"),
    limit: int = Query(100, ge=1, le=1000)
):
    """
    Get historical price data for a symbol
    """
    try:
        symbol = symbol.replace("-", "/")
        
        historical_data = await rate_service.get_historical_rates(
            symbol=symbol,
            interval=interval,
            limit=limit
        )
        
        return {
            "success": True,
            "symbol": symbol,
            "interval": interval,
            "data": historical_data,
            "count": len(historical_data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/convert")
async def convert_currency(
    amount: float = Query(..., gt=0),
    from_currency: str = Query(...),
    to_currency: str = Query(...)
):
    """
    Convert amount between currencies
    """
    try:
        converted_amount = await rate_service.convert_currency(
            amount=amount,
            from_currency=from_currency.upper(),
            to_currency=to_currency.upper()
        )
        
        return {
            "success": True,
            "from_currency": from_currency.upper(),
            "to_currency": to_currency.upper(),
            "amount": amount,
            "converted_amount": converted_amount,
            "rate": converted_amount / amount if amount > 0 else 0
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/bubbles")
async def get_crypto_bubbles():
    """
    Get data for crypto bubbles visualization
    """
    try:
        # Get all rates
        all_rates = await rate_service.get_all_rates()
        
        # Create bubble data
        bubbles = []
        bubble_id = 1
        
        # Add forex stablecoins
        stablecoins = ["USDfx", "EURfx", "JPYfx", "GBPfx", "CHFfx"]
        for stable in stablecoins:
            base_currency = stable.replace("fx", "")
            
            # Get USD conversion rate for market cap calculation
            if base_currency != "USD":
                pair = f"USD/{base_currency}"
                if pair in all_rates:
                    rate = all_rates[pair]["price"]
                    market_cap = 1000000 / rate  # $1M worth
                else:
                    market_cap = 1000000
            else:
                market_cap = 1000000
            
            bubbles.append({
                "id": str(bubble_id),
                "symbol": stable,
                "name": f"{base_currency} Stablecoin",
                "marketCap": market_cap,
                "priceChange24h": all_rates.get(f"USD/{base_currency}", {}).get("change_24h", 0),
                "volume24h": all_rates.get(f"USD/{base_currency}", {}).get("volume_24h", 500000),
                "category": "stablecoin",
                "color": "#3b82f6",
                "size": min(100, max(20, market_cap / 10000))
            })
            bubble_id += 1
        
        # Add forex pairs
        forex_pairs_list = [
            ("JPYGBPfx", "JPY", "GBP"),
            ("USDEURfx", "USD", "EUR"),
            ("EURCHFfx", "EUR", "CHF"),
            ("GBPUSDfx", "GBP", "USD"),
            ("AUDUSDfx", "AUD", "USD")
        ]
        
        for pair_symbol, base, quote in forex_pairs_list:
            forex_pair = f"{base}/{quote}"
            if forex_pair in all_rates:
                rate_data = all_rates[forex_pair]
                market_cap = 2000000  # $2M default for pairs
                
                bubbles.append({
                    "id": str(bubble_id),
                    "symbol": pair_symbol,
                    "name": f"{base}/{quote} Forex Pair",
                    "marketCap": market_cap,
                    "priceChange24h": rate_data.get("change_24h", 0),
                    "volume24h": rate_data.get("volume_24h", 1000000),
                    "category": "forex-pair",
                    "color": "#8b5cf6",
                    "size": min(100, max(20, market_cap / 20000))
                })
                bubble_id += 1
        
        # Add crypto
        crypto_list = ["BTC", "ETH", "USDC", "USDT"]
        for crypto in crypto_list:
            pair = f"{crypto}/USD"
            if pair in all_rates:
                rate_data = all_rates[pair]
                price = rate_data["price"]
                
                # Simulated market cap
                supply = {"BTC": 21000000, "ETH": 120000000, "USDC": 30000000000, "USDT": 85000000000}
                market_cap = price * supply.get(crypto, 1000000)
                
                bubbles.append({
                    "id": str(bubble_id),
                    "symbol": crypto,
                    "name": crypto,
                    "marketCap": market_cap,
                    "priceChange24h": rate_data.get("change_24h", 0),
                    "volume24h": rate_data.get("volume_24h", 10000000),
                    "category": "crypto",
                    "color": "#f59e0b",
                    "size": min(100, max(20, market_cap / 1000000000))
                })
                bubble_id += 1
        
        return {
            "success": True,
            "data": bubbles,
            "count": len(bubbles)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/data")
async def get_market_data():
    """
    Get comprehensive market data for dashboard
    """
    try:
        # Get all rates
        all_rates = await rate_service.get_all_rates()
        
        # Calculate market statistics
        total_volume = sum(
            rate.get("volume_24h", 0) 
            for rate in all_rates.values()
        )
        
        # Get top gainers and losers
        sorted_by_change = sorted(
            [(pair, data) for pair, data in all_rates.items()],
            key=lambda x: x[1].get("change_24h", 0)
        )
        
        top_gainers = [
            {
                "symbol": pair,
                "price": data["price"],
                "change": data.get("change_24h", 0),
                "volume": data.get("volume_24h", 0)
            }
            for pair, data in sorted_by_change[-5:][::-1]
            if data.get("change_24h", 0) > 0
        ]
        
        top_losers = [
            {
                "symbol": pair,
                "price": data["price"],
                "change": data.get("change_24h", 0),
                "volume": data.get("volume_24h", 0)
            }
            for pair, data in sorted_by_change[:5]
            if data.get("change_24h", 0) < 0
        ]
        
        return {
            "success": True,
            "data": {
                "total_market_cap": 7850000,  # Simulated
                "total_volume_24h": total_volume,
                "active_pairs": len(all_rates),
                "top_gainers": top_gainers,
                "top_losers": top_losers,
                "rates": all_rates
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/prices")
async def get_prices():
    """
    Get current prices for all supported assets
    """
    try:
        all_rates = await rate_service.get_all_rates()
        
        prices = {
            pair: {
                "price": data["price"],
                "bid": data.get("bid", data["price"]),
                "ask": data.get("ask", data["price"]),
                "change_24h": data.get("change_24h", 0),
                "volume_24h": data.get("volume_24h", 0),
                "timestamp": data.get("timestamp")
            }
            for pair, data in all_rates.items()
        }
        
        return {
            "success": True,
            "data": prices,
            "count": len(prices)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
