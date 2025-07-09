// Core platform types

export interface User {
  id: string;
  email: string;
  name?: string | null;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  image?: string | null;
  avatar?: string | null;
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: Record<string, number>; // currency -> amount
  fiatBalance: Record<string, number>; // fiat currency -> amount
  cryptoBalance: Record<string, number>; // crypto currency -> amount
}

export interface Deposit {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: "fiat" | "crypto";
  status: "pending" | "confirmed" | "failed";
  transactionHash?: string;
  createdAt: Date;
  confirmedAt?: Date;
}

export interface Stablecoin {
  id: string;
  symbol: string;
  name: string;
  baseCurrency: string; // USD, EUR, JPY, etc.
  currentPrice: number;
  totalSupply: number;
  marketCap: number;
  priceChange24h: number;
  contractAddress?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ForexPair {
  id: string;
  name: string;
  symbol: string; // e.g., "JPYGBPfx"
  baseCurrency: string;
  quoteCurrency: string;
  baseStablecoin: Stablecoin;
  quoteStablecoin: Stablecoin;
  currentPrice: number;
  priceChange24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  totalLiquidity: number;
  isActive: boolean;
  createdAt: Date;
}

export interface UserPosition {
  id: string;
  userId: string;
  forexPairId: string;
  forexPair: ForexPair;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
  status: "active" | "closed";
  createdAt: Date;
  closedAt?: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "deposit" | "withdraw" | "swap" | "create_pair" | "close_position";
  amount: number;
  currency: string;
  fromCurrency?: string;
  toCurrency?: string;
  status: "pending" | "completed" | "failed";
  transactionHash?: string;
  fee: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface MarketData {
  symbol: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  timestamp: Date;
}

export interface CryptoBubbleData {
  id: string;
  symbol: string;
  name: string;
  marketCap: number;
  priceChange24h: number;
  volume24h: number;
  category: "stablecoin" | "forex-pair" | "crypto";
  color: string;
  size: number; // relative size for bubble visualization
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Form types
export interface DepositForm {
  amount: number;
  currency: string;
  type: "fiat" | "crypto";
  paymentMethod?: string;
}

export interface CreateForexPairForm {
  baseCurrency: string;
  quoteCurrency: string;
  initialAmount: number;
  allocationPercentage: number; // 50% default
}

export interface SwapForm {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  slippage: number;
}

// Chart types
export interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// WebSocket types
export interface WebSocketMessage {
  type: "price_update" | "transaction_update" | "notification" | "market_data";
  payload: any;
  timestamp: Date;
}

export interface PriceUpdate {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  timestamp: Date;
}
