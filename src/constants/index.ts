// Supported fiat currencies
export const FIAT_CURRENCIES = {
  USD: { symbol: "USD", name: "US Dollar", flag: "🇺🇸" },
  EUR: { symbol: "EUR", name: "Euro", flag: "🇪🇺" },
  JPY: { symbol: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  GBP: { symbol: "GBP", name: "British Pound", flag: "🇬🇧" },
  CHF: { symbol: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  CAD: { symbol: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  AUD: { symbol: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  NZD: { symbol: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
  CNY: { symbol: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  KRW: { symbol: "KRW", name: "South Korean Won", flag: "🇰🇷" },
  INR: { symbol: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  SGD: { symbol: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
} as const;

// Supported cryptocurrencies for deposits
export const CRYPTO_CURRENCIES = {
  BTC: { symbol: "BTC", name: "Bitcoin", decimals: 8 },
  ETH: { symbol: "ETH", name: "Ethereum", decimals: 18 },
  USDC: { symbol: "USDC", name: "USD Coin", decimals: 6 },
  USDT: { symbol: "USDT", name: "Tether", decimals: 6 },
  DAI: { symbol: "DAI", name: "Dai Stablecoin", decimals: 18 },
  BUSD: { symbol: "BUSD", name: "Binance USD", decimals: 18 },
} as const;

// Stablecoin suffixes
export const STABLECOIN_SUFFIX = "fx" as const;

// Platform settings
export const PLATFORM_SETTINGS = {
  MIN_DEPOSIT_AMOUNT: {
    USD: 100,
    EUR: 100,
    JPY: 10000,
    GBP: 100,
    BTC: 0.001,
    ETH: 0.01,
    USDC: 100,
  },
  MAX_DEPOSIT_AMOUNT: {
    USD: 1000000,
    EUR: 1000000,
    JPY: 100000000,
    GBP: 1000000,
    BTC: 10,
    ETH: 100,
    USDC: 1000000,
  },
  DEFAULT_SLIPPAGE: 0.5, // 0.5%
  MAX_SLIPPAGE: 5, // 5%
  TRADING_FEE: 0.001, // 0.1%
  WITHDRAWAL_FEE: 0.005, // 0.5%
  MIN_LIQUIDITY_RATIO: 0.1, // 10%
  DEFAULT_ALLOCATION: 50, // 50% split for forex pairs
} as const;

// Transaction statuses
export const TRANSACTION_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;

// Transaction types
export const TRANSACTION_TYPES = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
  SWAP: "swap",
  CREATE_PAIR: "create_pair",
  CLOSE_POSITION: "close_position",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
  },
  USER: {
    PROFILE: "/api/user/profile",
    WALLET: "/api/user/wallet",
    TRANSACTIONS: "/api/user/transactions",
    POSITIONS: "/api/user/positions",
  },
  DEPOSITS: {
    CREATE: "/api/deposits",
    LIST: "/api/deposits",
    STATUS: "/api/deposits",
  },
  STABLECOINS: {
    LIST: "/api/stablecoins",
    CREATE: "/api/stablecoins",
    PRICE: "/api/stablecoins/price",
  },
  FOREX_PAIRS: {
    LIST: "/api/forex-pairs",
    CREATE: "/api/forex-pairs",
    PRICE: "/api/forex-pairs/price",
    CHART: "/api/forex-pairs/chart",
  },
  MARKET: {
    DATA: "/api/market/data",
    PRICES: "/api/market/prices",
    BUBBLES: "/api/market/bubbles",
  },
} as const;

// WebSocket events
export const WS_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  PRICE_UPDATE: "price_update",
  TRANSACTION_UPDATE: "transaction_update",
  MARKET_DATA: "market_data",
  NOTIFICATION: "notification",
} as const;

// Chart time intervals
export const CHART_INTERVALS = {
  "1m": { label: "1 Minute", value: "1m" },
  "5m": { label: "5 Minutes", value: "5m" },
  "15m": { label: "15 Minutes", value: "15m" },
  "1h": { label: "1 Hour", value: "1h" },
  "4h": { label: "4 Hours", value: "4h" },
  "1d": { label: "1 Day", value: "1d" },
  "1w": { label: "1 Week", value: "1w" },
} as const;

// Color schemes for crypto bubbles
export const BUBBLE_COLORS = {
  POSITIVE: "#10b981", // green
  NEGATIVE: "#ef4444", // red
  NEUTRAL: "#6b7280", // gray
  STABLECOIN: "#3b82f6", // blue
  FOREX_PAIR: "#8b5cf6", // purple
  CRYPTO: "#f59e0b", // amber
} as const;

// Navigation routes
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  DEPOSITS: "/deposits",
  STABLECOINS: "/stablecoins",
  FOREX_PAIRS: "/forex-pairs",
  ANALYTICS: "/analytics",
  LOGIN: "/login",
  REGISTER: "/register",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_AMOUNT: "Please enter a valid amount",
  INSUFFICIENT_BALANCE: "Insufficient balance",
  NETWORK_ERROR: "Network error occurred",
  UNAUTHORIZED: "Please log in to continue",
  FORBIDDEN: "Access denied",
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "Server error occurred",
  INVALID_CURRENCY: "Invalid currency selected",
  MIN_AMOUNT_ERROR: "Amount below minimum required",
  MAX_AMOUNT_ERROR: "Amount exceeds maximum allowed",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  DEPOSIT_CREATED: "Deposit request created successfully",
  TRANSACTION_CONFIRMED: "Transaction confirmed",
  PAIR_CREATED: "Forex pair created successfully",
  POSITION_CLOSED: "Position closed successfully",
  PROFILE_UPDATED: "Profile updated successfully",
} as const;
