/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `high24h` to the `crypto_prices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `low24h` to the `crypto_prices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketCap` to the `crypto_prices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `side` to the `trades` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REQUIRES_REVIEW');

-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('FIAT', 'CRYPTO', 'STABLECOIN');

-- CreateEnum
CREATE TYPE "DepositMethod" AS ENUM ('BANK_TRANSFER', 'CREDIT_CARD', 'CRYPTO_TRANSFER', 'STABLECOIN_TRANSFER');

-- CreateEnum
CREATE TYPE "WithdrawalMethod" AS ENUM ('BANK_TRANSFER', 'CRYPTO_TRANSFER', 'STABLECOIN_TRANSFER');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TradeSide" AS ENUM ('LONG', 'SHORT');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('MARKET', 'LIMIT', 'STOP_LOSS', 'TAKE_PROFIT');

-- CreateEnum
CREATE TYPE "WatchlistType" AS ENUM ('CRYPTO', 'FOREX_PAIR', 'STABLECOIN');

-- AlterEnum
ALTER TYPE "TradeStatus" ADD VALUE 'PARTIALLY_FILLED';

-- AlterEnum
ALTER TYPE "TradeType" ADD VALUE 'SWAP';

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "crypto_prices" ADD COLUMN     "high24h" DECIMAL(18,8) NOT NULL,
ADD COLUMN     "low24h" DECIMAL(18,8) NOT NULL,
ADD COLUMN     "marketCap" DECIMAL(20,8) NOT NULL;

-- AlterTable
ALTER TABLE "trades" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "fees" DECIMAL(18,8) NOT NULL DEFAULT 0,
ADD COLUMN     "forexPairId" TEXT,
ADD COLUMN     "orderType" "OrderType" NOT NULL DEFAULT 'MARKET',
ADD COLUMN     "side" "TradeSide" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "kycData" JSONB,
ADD COLUMN     "kycStatus" "KYCStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "watchlist_items" ADD COLUMN     "type" "WatchlistType" NOT NULL DEFAULT 'CRYPTO';

-- DropTable
DROP TABLE "Session";

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "balance" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "lockedBalance" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "walletType" "WalletType" NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposits" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "amount" DECIMAL(18,8) NOT NULL,
    "method" "DepositMethod" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "txHash" TEXT,
    "paymentRef" TEXT,
    "fees" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "amount" DECIMAL(18,8) NOT NULL,
    "method" "WithdrawalMethod" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "txHash" TEXT,
    "address" TEXT,
    "bankDetails" JSONB,
    "fees" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stablecoins" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseCurrency" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL DEFAULT 18,
    "totalSupply" DECIMAL(28,18) NOT NULL DEFAULT 0,
    "reserveAmount" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stablecoins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stablecoin_holdings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stablecoinId" TEXT NOT NULL,
    "balance" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "lockedBalance" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stablecoin_holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forex_pairs" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "baseCurrencyId" TEXT NOT NULL,
    "quoteCurrencyId" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forex_pairs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forex_pair_holdings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "forexPairId" TEXT NOT NULL,
    "balance" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "lockedBalance" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "avgPrice" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forex_pair_holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forex_pair_prices" (
    "id" TEXT NOT NULL,
    "forexPairId" TEXT NOT NULL,
    "price" DECIMAL(18,8) NOT NULL,
    "change24h" DECIMAL(10,4) NOT NULL,
    "volume24h" DECIMAL(20,8) NOT NULL,
    "high24h" DECIMAL(18,8) NOT NULL,
    "low24h" DECIMAL(18,8) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forex_pair_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "liquidity_pools" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "token0" TEXT NOT NULL,
    "token1" TEXT NOT NULL,
    "reserve0" DECIMAL(28,18) NOT NULL DEFAULT 0,
    "reserve1" DECIMAL(28,18) NOT NULL DEFAULT 0,
    "totalSupply" DECIMAL(28,18) NOT NULL DEFAULT 0,
    "fee" DECIMAL(5,4) NOT NULL DEFAULT 0.003,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "liquidity_pools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_userId_currency_walletType_key" ON "wallets"("userId", "currency", "walletType");

-- CreateIndex
CREATE UNIQUE INDEX "stablecoins_symbol_key" ON "stablecoins"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "stablecoins_contractAddress_key" ON "stablecoins"("contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "stablecoin_holdings_userId_stablecoinId_key" ON "stablecoin_holdings"("userId", "stablecoinId");

-- CreateIndex
CREATE UNIQUE INDEX "forex_pairs_symbol_key" ON "forex_pairs"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "forex_pairs_contractAddress_key" ON "forex_pairs"("contractAddress");

-- CreateIndex
CREATE UNIQUE INDEX "forex_pair_holdings_userId_forexPairId_key" ON "forex_pair_holdings"("userId", "forexPairId");

-- CreateIndex
CREATE UNIQUE INDEX "liquidity_pools_symbol_key" ON "liquidity_pools"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_key_key" ON "system_config"("key");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposits" ADD CONSTRAINT "deposits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stablecoin_holdings" ADD CONSTRAINT "stablecoin_holdings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stablecoin_holdings" ADD CONSTRAINT "stablecoin_holdings_stablecoinId_fkey" FOREIGN KEY ("stablecoinId") REFERENCES "stablecoins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forex_pairs" ADD CONSTRAINT "forex_pairs_baseCurrencyId_fkey" FOREIGN KEY ("baseCurrencyId") REFERENCES "stablecoins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forex_pairs" ADD CONSTRAINT "forex_pairs_quoteCurrencyId_fkey" FOREIGN KEY ("quoteCurrencyId") REFERENCES "stablecoins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forex_pair_holdings" ADD CONSTRAINT "forex_pair_holdings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forex_pair_holdings" ADD CONSTRAINT "forex_pair_holdings_forexPairId_fkey" FOREIGN KEY ("forexPairId") REFERENCES "forex_pairs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forex_pair_prices" ADD CONSTRAINT "forex_pair_prices_forexPairId_fkey" FOREIGN KEY ("forexPairId") REFERENCES "forex_pairs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_forexPairId_fkey" FOREIGN KEY ("forexPairId") REFERENCES "forex_pairs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
