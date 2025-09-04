"""
WebSocket Manager for real-time updates
"""

from typing import Dict, Set, List
from fastapi import WebSocket
import json
import asyncio
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class ConnectionManager:
    """Manages WebSocket connections"""
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.subscriptions: Dict[str, Set[str]] = {}
        
    async def connect(self, websocket: WebSocket, client_id: str):
        """Accept and store a new WebSocket connection"""
        await websocket.accept()
        self.active_connections[client_id] = websocket
        self.subscriptions[client_id] = set()
        logger.info(f"Client {client_id} connected")
        
    def disconnect(self, client_id: str):
        """Remove a WebSocket connection"""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            del self.subscriptions[client_id]
            logger.info(f"Client {client_id} disconnected")
            
    async def send_personal_message(self, message: str, client_id: str):
        """Send a message to a specific client"""
        if client_id in self.active_connections:
            websocket = self.active_connections[client_id]
            try:
                await websocket.send_text(message)
            except Exception as e:
                logger.error(f"Error sending message to {client_id}: {e}")
                self.disconnect(client_id)
                
    async def broadcast(self, message: str, channel: str = None):
        """Broadcast a message to all connected clients or specific channel"""
        disconnected_clients = []
        
        for client_id, websocket in self.active_connections.items():
            # If channel specified, only send to subscribed clients
            if channel and channel not in self.subscriptions.get(client_id, set()):
                continue
                
            try:
                await websocket.send_text(message)
            except Exception as e:
                logger.error(f"Error broadcasting to {client_id}: {e}")
                disconnected_clients.append(client_id)
                
        # Clean up disconnected clients
        for client_id in disconnected_clients:
            self.disconnect(client_id)
            
    def subscribe(self, client_id: str, channel: str):
        """Subscribe a client to a channel"""
        if client_id in self.subscriptions:
            self.subscriptions[client_id].add(channel)
            logger.info(f"Client {client_id} subscribed to {channel}")
            
    def unsubscribe(self, client_id: str, channel: str):
        """Unsubscribe a client from a channel"""
        if client_id in self.subscriptions:
            self.subscriptions[client_id].discard(channel)
            logger.info(f"Client {client_id} unsubscribed from {channel}")

class WebSocketManager:
    """Main WebSocket manager for the application"""
    
    def __init__(self):
        self.manager = ConnectionManager()
        self.is_running = False
        self.update_tasks = []
        
    async def start(self):
        """Start the WebSocket manager"""
        self.is_running = True
        logger.info("WebSocket Manager started")
        
        # Start background tasks for real-time updates
        self.update_tasks = [
            asyncio.create_task(self._price_update_loop()),
            asyncio.create_task(self._market_data_loop()),
        ]
        
    async def stop(self):
        """Stop the WebSocket manager"""
        self.is_running = False
        
        # Cancel all update tasks
        for task in self.update_tasks:
            task.cancel()
            
        # Wait for tasks to complete
        await asyncio.gather(*self.update_tasks, return_exceptions=True)
        
        logger.info("WebSocket Manager stopped")
        
    async def connect(self, websocket: WebSocket):
        """Handle a new WebSocket connection"""
        import uuid
        client_id = str(uuid.uuid4())
        await self.manager.connect(websocket, client_id)
        
        # Send initial connection success message
        await websocket.send_json({
            "type": "connection",
            "status": "connected",
            "client_id": client_id,
            "timestamp": datetime.now().isoformat()
        })
        
        return client_id
        
    def disconnect(self, websocket: WebSocket):
        """Handle WebSocket disconnection"""
        # Find and remove the client
        client_id = None
        for cid, ws in self.manager.active_connections.items():
            if ws == websocket:
                client_id = cid
                break
                
        if client_id:
            self.manager.disconnect(client_id)
            
    async def handle_message(self, websocket: WebSocket, data: str):
        """Handle incoming WebSocket messages"""
        try:
            message = json.loads(data)
            message_type = message.get("type")
            
            # Find client ID
            client_id = None
            for cid, ws in self.manager.active_connections.items():
                if ws == websocket:
                    client_id = cid
                    break
                    
            if not client_id:
                return
                
            # Handle different message types
            if message_type == "subscribe":
                channel = message.get("channel")
                if channel:
                    self.manager.subscribe(client_id, channel)
                    await self.manager.send_personal_message(
                        json.dumps({
                            "type": "subscription",
                            "channel": channel,
                            "status": "subscribed",
                            "timestamp": datetime.now().isoformat()
                        }),
                        client_id
                    )
                    
            elif message_type == "unsubscribe":
                channel = message.get("channel")
                if channel:
                    self.manager.unsubscribe(client_id, channel)
                    await self.manager.send_personal_message(
                        json.dumps({
                            "type": "subscription",
                            "channel": channel,
                            "status": "unsubscribed",
                            "timestamp": datetime.now().isoformat()
                        }),
                        client_id
                    )
                    
            elif message_type == "ping":
                await self.manager.send_personal_message(
                    json.dumps({
                        "type": "pong",
                        "timestamp": datetime.now().isoformat()
                    }),
                    client_id
                )
                
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON received: {data}")
        except Exception as e:
            logger.error(f"Error handling message: {e}")
            
    async def _price_update_loop(self):
        """Send price updates to subscribed clients"""
        while self.is_running:
            try:
                # This would fetch real price data from the rate aggregator
                # For now, we'll send mock updates
                import random
                
                price_update = {
                    "type": "price_update",
                    "data": {
                        "BTC/USD": 45000 + random.uniform(-100, 100),
                        "ETH/USD": 3000 + random.uniform(-50, 50),
                        "USD/EUR": 0.85 + random.uniform(-0.01, 0.01),
                        "GBP/USD": 1.37 + random.uniform(-0.01, 0.01),
                    },
                    "timestamp": datetime.now().isoformat()
                }
                
                await self.manager.broadcast(
                    json.dumps(price_update),
                    channel="prices"
                )
                
                await asyncio.sleep(5)  # Update every 5 seconds
                
            except Exception as e:
                logger.error(f"Error in price update loop: {e}")
                await asyncio.sleep(5)
                
    async def _market_data_loop(self):
        """Send market data updates to subscribed clients"""
        while self.is_running:
            try:
                # This would fetch real market data
                # For now, we'll send mock updates
                import random
                
                market_update = {
                    "type": "market_data",
                    "data": {
                        "total_market_cap": 2000000000000 + random.uniform(-50000000000, 50000000000),
                        "total_volume": 100000000000 + random.uniform(-5000000000, 5000000000),
                        "btc_dominance": 45 + random.uniform(-1, 1),
                        "active_trades": random.randint(100, 500),
                    },
                    "timestamp": datetime.now().isoformat()
                }
                
                await self.manager.broadcast(
                    json.dumps(market_update),
                    channel="market"
                )
                
                await asyncio.sleep(10)  # Update every 10 seconds
                
            except Exception as e:
                logger.error(f"Error in market data loop: {e}")
                await asyncio.sleep(10)
                
    async def send_transaction_update(self, user_id: str, transaction_data: dict):
        """Send transaction update to a specific user"""
        message = {
            "type": "transaction_update",
            "data": transaction_data,
            "timestamp": datetime.now().isoformat()
        }
        
        # Find client by user_id (would need proper mapping in production)
        for client_id in self.manager.active_connections:
            await self.manager.send_personal_message(
                json.dumps(message),
                client_id
            )
            
    async def send_notification(self, user_id: str, notification: dict):
        """Send notification to a specific user"""
        message = {
            "type": "notification",
            "data": notification,
            "timestamp": datetime.now().isoformat()
        }
        
        # Find client by user_id (would need proper mapping in production)
        for client_id in self.manager.active_connections:
            await self.manager.send_personal_message(
                json.dumps(message),
                client_id
            )
