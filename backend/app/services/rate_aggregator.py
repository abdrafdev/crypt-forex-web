"""
Rate Aggregator Service for fetching real-time forex rates
"""

import asyncio
import httpx
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import yfinance as yf
from alpha_vantage.foreignexchange import ForeignExchange
import ccxt
from decimal import Decimal

from app.core.config import settings
from app.core.database import cache, SessionLocal
# from app.models.models import PriceHistory  # Commented to avoid conflicts

logger = logging.getLogger(__name__)

class RateAggregatorService:
    """Service for aggregating forex and crypto rates from multiple sources"""
    
    def __init__(self):
        self.is_running = False
        self.update_interval = 60  # seconds
        self.forex_pairs = [
            "USD/EUR", "USD/JPY", "USD/GBP", "USD/CHF", "USD/CAD",
            "EUR/JPY", "EUR/GBP", "GBP/JPY", "AUD/USD", "NZD/USD"
        ]
        self.crypto_pairs = ["BTC/USD", "ETH/USD", "USDC/USD", "USDT/USD"]
        
        # Initialize API clients
        self.alpha_vantage = ForeignExchange(key=settings.ALPHA_VANTAGE_API_KEY)
        self.ccxt_exchange = ccxt.binance()  # Using Binance for crypto rates
        
    async def start(self):
        """Start the rate aggregator service"""
        self.is_running = True
        logger.info("Starting Rate Aggregator Service...")
        asyncio.create_task(self._update_loop())
    
    async def stop(self):
        """Stop the rate aggregator service"""
        self.is_running = False
        logger.info("Stopping Rate Aggregator Service...")
    
    async def _update_loop(self):
        """Main update loop"""
        while self.is_running:
            try:
                await self.update_all_rates()
                await asyncio.sleep(self.update_interval)
            except Exception as e:
                logger.error(f"Error in rate update loop: {e}")
                await asyncio.sleep(30)  # Wait before retry
    
    async def update_all_rates(self):
        """Update all forex and crypto rates"""
        tasks = [
            self.update_forex_rates(),
            self.update_crypto_rates()
        ]
        await asyncio.gather(*tasks, return_exceptions=True)
    
    async def update_forex_rates(self):
        """Fetch and update forex rates"""
        try:
            rates = await self.fetch_forex_rates()
            await self.store_rates(rates, "forex")
            logger.info(f"Updated {len(rates)} forex rates")
        except Exception as e:
            logger.error(f"Error updating forex rates: {e}")
    
    async def update_crypto_rates(self):
        """Fetch and update crypto rates"""
        try:
            rates = await self.fetch_crypto_rates()
            await self.store_rates(rates, "crypto")
            logger.info(f"Updated {len(rates)} crypto rates")
        except Exception as e:
            logger.error(f"Error updating crypto rates: {e}")
    
    async def fetch_forex_rates(self) -> Dict:
        """Fetch forex rates from multiple sources"""
        rates = {}
        
        # Try Alpha Vantage first
        for pair in self.forex_pairs:
            try:
                from_currency, to_currency = pair.split("/")
                data, _ = self.alpha_vantage.get_currency_exchange_rate(
                    from_currency=from_currency,
                    to_currency=to_currency
                )
                
                if data:
                    rate = float(data.get("5. Exchange Rate", 0))
                    if rate > 0:
                        rates[pair] = {
                            "price": rate,
                            "bid": rate * 0.9995,  # Simulated bid
                            "ask": rate * 1.0005,  # Simulated ask
                            "timestamp": datetime.utcnow().isoformat()
                        }
            except Exception as e:
                logger.warning(f"Failed to fetch {pair} from Alpha Vantage: {e}")
        
        # Fallback to Yahoo Finance
        if len(rates) < len(self.forex_pairs):
            await self._fetch_yahoo_finance_rates(rates)
        
        # Fallback to simulated rates for demo
        if len(rates) == 0:
            rates = self._generate_demo_forex_rates()
        
        return rates
    
    async def _fetch_yahoo_finance_rates(self, rates: Dict):
        """Fetch rates from Yahoo Finance"""
        for pair in self.forex_pairs:
            if pair not in rates:
                try:
                    yahoo_symbol = pair.replace("/", "") + "=X"
                    ticker = yf.Ticker(yahoo_symbol)
                    info = ticker.info
                    
                    if "regularMarketPrice" in info:
                        price = info["regularMarketPrice"]
                        rates[pair] = {
                            "price": price,
                            "bid": price * 0.9995,
                            "ask": price * 1.0005,
                            "timestamp": datetime.utcnow().isoformat()
                        }
                except Exception as e:
                    logger.warning(f"Failed to fetch {pair} from Yahoo Finance: {e}")
    
    def _generate_demo_forex_rates(self) -> Dict:
        """Generate demo forex rates for testing"""
        base_rates = {
            "USD/EUR": 0.92,
            "USD/JPY": 149.50,
            "USD/GBP": 0.79,
            "USD/CHF": 0.88,
            "USD/CAD": 1.36,
            "EUR/JPY": 162.50,
            "EUR/GBP": 0.86,
            "GBP/JPY": 189.00,
            "AUD/USD": 0.65,
            "NZD/USD": 0.59
        }
        
        rates = {}
        for pair, base_rate in base_rates.items():
            # Add small random variation
            import random
            variation = random.uniform(-0.002, 0.002)
            price = base_rate * (1 + variation)
            
            rates[pair] = {
                "price": price,
                "bid": price * 0.9995,
                "ask": price * 1.0005,
                "timestamp": datetime.utcnow().isoformat(),
                "volume_24h": random.randint(1000000, 10000000),
                "change_24h": random.uniform(-2, 2)
            }
        
        return rates
    
    async def fetch_crypto_rates(self) -> Dict:
        """Fetch crypto rates from exchanges"""
        rates = {}
        
        try:
            # Fetch from Binance using ccxt
            for pair in self.crypto_pairs:
                symbol = pair.replace("/", "")
                ticker = self.ccxt_exchange.fetch_ticker(symbol)
                
                if ticker:
                    rates[pair] = {
                        "price": ticker["last"],
                        "bid": ticker["bid"],
                        "ask": ticker["ask"],
                        "volume_24h": ticker["quoteVolume"],
                        "change_24h": ticker["percentage"],
                        "high_24h": ticker["high"],
                        "low_24h": ticker["low"],
                        "timestamp": datetime.utcnow().isoformat()
                    }
        except Exception as e:
            logger.error(f"Error fetching crypto rates: {e}")
            # Use demo rates as fallback
            rates = self._generate_demo_crypto_rates()
        
        return rates
    
    def _generate_demo_crypto_rates(self) -> Dict:
        """Generate demo crypto rates for testing"""
        base_rates = {
            "BTC/USD": 65000,
            "ETH/USD": 3500,
            "USDC/USD": 1.0,
            "USDT/USD": 1.0
        }
        
        rates = {}
        import random
        
        for pair, base_rate in base_rates.items():
            variation = random.uniform(-0.01, 0.01)
            price = base_rate * (1 + variation)
            
            rates[pair] = {
                "price": price,
                "bid": price * 0.999,
                "ask": price * 1.001,
                "volume_24h": random.randint(10000000, 100000000),
                "change_24h": random.uniform(-5, 5),
                "high_24h": price * 1.02,
                "low_24h": price * 0.98,
                "timestamp": datetime.utcnow().isoformat()
            }
        
        return rates
    
    async def store_rates(self, rates: Dict, rate_type: str):
        """Store rates in cache and database"""
        # Store in Redis cache
        for pair, data in rates.items():
            cache_key = f"rate:{pair}"
            cache.set(cache_key, json.dumps(data), expire=120)  # 2 minutes cache
        
        # Store aggregated data
        all_rates_key = f"rates:{rate_type}"
        cache.set(all_rates_key, json.dumps(rates), expire=120)
        
        # Store in database for historical data - commented out for now
        # db = SessionLocal()
        # try:
        #     for pair, data in rates.items():
        #         history = PriceHistory(
        #             symbol=pair,
        #             price=Decimal(str(data["price"])),
        #             volume_24h=Decimal(str(data.get("volume_24h", 0))),
        #             change_24h=data.get("change_24h", 0),
        #             high_24h=Decimal(str(data.get("high_24h", data["price"]))),
        #             low_24h=Decimal(str(data.get("low_24h", data["price"])))
        #         )
        #         db.add(history)
        #     
        #     db.commit()
        # except Exception as e:
        #     logger.error(f"Error storing rates in database: {e}")
        #     db.rollback()
        # finally:
        #     db.close()
    
    async def get_rate(self, pair: str) -> Optional[Dict]:
        """Get current rate for a specific pair"""
        # Try cache first
        cache_key = f"rate:{pair}"
        cached = cache.get(cache_key)
        
        if cached:
            return json.loads(cached)
        
        # Fetch fresh rate
        if "/" in pair and pair.split("/")[1] in ["USD", "EUR", "JPY", "GBP"]:
            rates = await self.fetch_forex_rates()
        else:
            rates = await self.fetch_crypto_rates()
        
        return rates.get(pair)
    
    async def get_all_rates(self) -> Dict:
        """Get all current rates"""
        forex_cached = cache.get("rates:forex")
        crypto_cached = cache.get("rates:crypto")
        
        forex_rates = json.loads(forex_cached) if forex_cached else {}
        crypto_rates = json.loads(crypto_cached) if crypto_cached else {}
        
        # Fetch if not cached
        if not forex_rates:
            forex_rates = await self.fetch_forex_rates()
            await self.store_rates(forex_rates, "forex")
        
        if not crypto_rates:
            crypto_rates = await self.fetch_crypto_rates()
            await self.store_rates(crypto_rates, "crypto")
        
        return {**forex_rates, **crypto_rates}
    
    async def get_historical_rates(self, symbol: str, interval: str = "1d", limit: int = 100) -> List[Dict]:
        """Get historical rates for a symbol"""
        # Temporarily return mock data until PriceHistory is properly configured
        import random
        from datetime import datetime, timedelta
        
        historical_data = []
        base_price = 100  # Base price for demo
        current_time = datetime.utcnow()
        
        for i in range(limit):
            timestamp = current_time - timedelta(hours=i)
            price = base_price * (1 + random.uniform(-0.05, 0.05))
            
            historical_data.append({
                "timestamp": timestamp.isoformat(),
                "price": price,
                "volume": random.randint(100000, 1000000),
                "change": random.uniform(-5, 5),
                "high": price * 1.02,
                "low": price * 0.98
            })
        
        return historical_data
    
    async def convert_currency(self, amount: float, from_currency: str, to_currency: str) -> float:
        """Convert amount from one currency to another"""
        if from_currency == to_currency:
            return amount
        
        # Direct conversion
        pair = f"{from_currency}/{to_currency}"
        rate_data = await self.get_rate(pair)
        
        if rate_data:
            return amount * rate_data["price"]
        
        # Try reverse pair
        reverse_pair = f"{to_currency}/{from_currency}"
        rate_data = await self.get_rate(reverse_pair)
        
        if rate_data:
            return amount / rate_data["price"]
        
        # Try USD as intermediate
        if from_currency != "USD" and to_currency != "USD":
            usd_amount = await self.convert_currency(amount, from_currency, "USD")
            return await self.convert_currency(usd_amount, "USD", to_currency)
        
        raise ValueError(f"Cannot convert {from_currency} to {to_currency}")
