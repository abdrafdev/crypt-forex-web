// Core platform types

export interface User {
  id: string;
  email: string;
  username: string;
  password?: string; // Optional for frontend types
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  avatar?: string | null;
  isActive: boolean;
  emailVerified?: Date | null;
  kycStatus: KYCStatus;
  kycData?: any | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  balance: number; // Using number for frontend, Prisma handles Decimal conversion
  lockedBalance: number;
  walletType: WalletType;
  address?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deposit {
  id: string;
  userId: string;
  currency: string;
  amount: number;
  method: DepositMethod;
  status: TransactionStatus;
  txHash?: string | null;
  paymentRef?: string | null;
  fees: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Withdrawal {
  id: string;
  userId: string;
  currency: string;
  amount: number;
  method: WithdrawalMethod;
  status: TransactionStatus;
  txHash?: string | null;
  address?: string | null;
  bankDetails?: any | null;
  fees: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stablecoin {
  id: string;
  symbol: string;
  name: string;
  baseCurrency: string;
  contractAddress: string;
  decimals: number;
  totalSupply: number;
  reserveAmount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StablecoinHolding {
  id: string;
  userId: string;
  stablecoinId: string;
  balance: number;
  lockedBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForexPair {
  id: string;
  symbol: string;
  baseCurrencyId: string;
  quoteCurrencyId: string;
  contractAddress: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  baseCurrency?: Stablecoin;
  quoteCurrency?: Stablecoin;
}

export interface ForexPairHolding {
  id: string;
  userId: string;
  forexPairId: string;
  balance: number;
  lockedBalance: number;
  avgPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForexPairPrice {
  id: string;
  forexPairId: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  timestamp: Date;
}

export interface Trade {
  id: string;
  userId: string;
  forexPairId?: string | null;
  symbol: string;
  type: TradeType;
  side: TradeSide;
  amount: number;
  price: number;
  total: number;
  fees: number;
  status: TradeStatus;
  orderType: OrderType;
  executedAt?: Date | null;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  symbol: string;
  type: WatchlistType;
  createdAt: Date;
}

export interface CryptoPrice {
  id: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface LiquidityPool {
  id: string;
  symbol: string;
  token0: string;
  token1: string;
  reserve0: number;
  reserve1: number;
  totalSupply: number;
  fee: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Enums matching Prisma schema
export enum KYCStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  REQUIRES_REVIEW = "REQUIRES_REVIEW",
}

export enum WalletType {
  FIAT = "FIAT",
  CRYPTO = "CRYPTO",
  STABLECOIN = "STABLECOIN",
}

export enum DepositMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  CREDIT_CARD = "CREDIT_CARD",
  CRYPTO_TRANSFER = "CRYPTO_TRANSFER",
  STABLECOIN_TRANSFER = "STABLECOIN_TRANSFER",
}

export enum WithdrawalMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  CRYPTO_TRANSFER = "CRYPTO_TRANSFER",
  STABLECOIN_TRANSFER = "STABLECOIN_TRANSFER",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export enum TradeType {
  BUY = "BUY",
  SELL = "SELL",
  SWAP = "SWAP",
}

export enum TradeSide {
  LONG = "LONG",
  SHORT = "SHORT",
}

export enum OrderType {
  MARKET = "MARKET",
  LIMIT = "LIMIT",
  STOP_LOSS = "STOP_LOSS",
  TAKE_PROFIT = "TAKE_PROFIT",
}

export enum TradeStatus {
  PENDING = "PENDING",
  EXECUTED = "EXECUTED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  PARTIALLY_FILLED = "PARTIALLY_FILLED",
}

export enum WatchlistType {
  CRYPTO = "CRYPTO",
  FOREX_PAIR = "FOREX_PAIR",
  STABLECOIN = "STABLECOIN",
}

// Legacy interfaces for backward compatibility (will be removed gradually)
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
