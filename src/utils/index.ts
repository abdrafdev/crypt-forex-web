import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency formatting utilities
export function formatCurrency(
  amount: number,
  currency: string,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const { minimumFractionDigits = 2, maximumFractionDigits = 6 } = options;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    // currency: currency === "USDC" || currency === "USDT" ? "USD" : currency,
    currency: "USD",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

export function formatNumber(
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    notation?: "standard" | "scientific" | "engineering" | "compact";
  } = {}
): string {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    notation = "standard",
  } = options;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits,
    maximumFractionDigits,
    notation,
  }).format(value);
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

// Price calculation utilities
export function calculatePriceChange(
  currentPrice: number,
  previousPrice: number
): number {
  return ((currentPrice - previousPrice) / previousPrice) * 100;
}

export function calculatePnL(
  entryPrice: number,
  currentPrice: number,
  amount: number
): { pnl: number; pnlPercentage: number } {
  const pnl = (currentPrice - entryPrice) * amount;
  const pnlPercentage = ((currentPrice - entryPrice) / entryPrice) * 100;

  return { pnl, pnlPercentage };
}

// Stablecoin utilities
export function generateStablecoinSymbol(baseCurrency: string): string {
  return `${baseCurrency}fx`;
}

export function extractBaseCurrency(stablecoinSymbol: string): string {
  return stablecoinSymbol.replace("fx", "");
}

export function generateForexPairSymbol(
  baseCurrency: string,
  quoteCurrency: string
): string {
  return `${baseCurrency}${quoteCurrency}fx`;
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidAmount(
  amount: number,
  min: number = 0,
  max: number = Infinity
): boolean {
  return amount > min && amount <= max && !isNaN(amount);
}

export function isValidCurrency(
  currency: string,
  supportedCurrencies: readonly string[]
): boolean {
  return supportedCurrencies.includes(currency);
}

// Date utilities
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(dateObj);
}

export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return formatDate(dateObj, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Color utilities for crypto bubbles
export function getPriceChangeColor(change: number): string {
  if (change > 0) return "#10b981"; // green
  if (change < 0) return "#ef4444"; // red
  return "#6b7280"; // gray
}

export function getBubbleSize(
  marketCap: number,
  maxMarketCap: number,
  minSize: number = 20,
  maxSize: number = 100
): number {
  const ratio = marketCap / maxMarketCap;
  return minSize + (maxSize - minSize) * ratio;
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Local storage utilities
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove from localStorage:", error);
  }
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError && error.message.includes("fetch");
}

// API utilities
export function buildApiUrl(
  endpoint: string,
  params?: Record<string, string | number>
): string {
  const url = new URL(
    endpoint,
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  return url.toString();
}

// Crypto utilities
export function generateWalletAddress(): string {
  // This is a mock implementation - in production, use proper crypto libraries
  const chars = "0123456789abcdef";
  let result = "0x";
  for (let i = 0; i < 40; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function truncateAddress(
  address: string,
  start: number = 6,
  end: number = 4
): string {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}
