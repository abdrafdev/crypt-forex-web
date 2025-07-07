# ForexFX Platform - Crypto Forex Trading Platform

A Next.js-based platform that enables users to create stablecoins backed by fiat currencies and trade crypto forex pairs.

## 🚀 Features

### Core Functionality

- **Multi-Currency Deposits**: Support for fiat (USD, EUR, JPY, GBP, etc.) and crypto (BTC, ETH, USDC, USDT) deposits
- **Forex Stablecoins**: Generate blockchain-based stablecoins that represent fiat currencies (USDfx, EURfx, JPYfx)
- **Crypto Forex Pairs**: Create and trade unique crypto forex pairs (JPYGBPfx, USDEURfx)
- **Market Visualization**: Interactive crypto bubbles showing market performance
- **Real-time Analytics**: Live market data and trading insights

### User Experience

- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Live price feeds and transaction updates
- **Dashboard**: Comprehensive trading dashboard with portfolio overview

## 📁 Project Structure

```
forex-crypto-platform/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── (auth)/                       # Authentication routes
│   │   │   ├── login/page.tsx           # Login page
│   │   │   └── register/page.tsx        # Registration page
│   │   ├── (dashboard)/                  # Protected dashboard routes
│   │   │   ├── dashboard/page.tsx       # Main dashboard
│   │   │   ├── deposits/page.tsx        # Deposit management
│   │   │   ├── stablecoins/page.tsx     # Stablecoin creation
│   │   │   ├── forex-pairs/page.tsx     # Forex pair trading
│   │   │   └── analytics/page.tsx       # Market analytics & bubbles
│   │   ├── globals.css                  # Global styles
│   │   ├── layout.tsx                   # Root layout
│   │   └── page.tsx                     # Landing page
│   ├── components/                       # React components
│   │   ├── ui/                          # shadcn/ui components
│   │   ├── layout/                      # Layout components
│   │   ├── features/                    # Feature-specific components
│   │   │   ├── deposits/                # Deposit functionality
│   │   │   ├── stablecoins/             # Stablecoin management
│   │   │   ├── forex-pairs/             # Forex pair creation
│   │   │   └── crypto-bubbles/          # Market visualization
│   │   └── shared/                      # Shared/reusable components
│   ├── hooks/                           # Custom React hooks
│   ├── services/                        # API and external services
│   ├── store/                           # State management (Zustand)
│   ├── types/                           # TypeScript type definitions
│   ├── utils/                           # Utility functions
│   ├── constants/                       # Application constants
│   └── lib/                            # Library configurations
├── public/                              # Static assets
├── components.json                      # shadcn/ui configuration
├── next.config.ts                       # Next.js configuration
├── tailwind.config.ts                   # Tailwind CSS configuration
├── tsconfig.json                        # TypeScript configuration
└── package.json                         # Dependencies and scripts
```

## 🏗️ Platform Features

### 1. Deposit System (`/deposits`)

- Multi-currency deposits (fiat and crypto)
- Real-time transaction tracking
- Payment method selection
- Fee transparency

### 2. Stablecoin Generation (`/stablecoins`)

- Create forex-backed stablecoins (USDfx, EURfx, JPYfx)
- Real-time price synchronization with forex markets
- Supply management and analytics

### 3. Crypto Forex Pairs (`/forex-pairs`)

- Create unique trading pairs (JPYGBPfx, USDEURfx)
- 50/50 allocation with customizable ratios
- Position management and P&L tracking

### 4. Market Analytics (`/analytics`)

- Interactive crypto bubbles visualization
- Real-time market data
- Performance metrics and insights

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Run the development server**

```bash
npm run dev
```

3. **Open the application**
   Navigate to `http://localhost:3000`

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## 🎯 Core Workflow

### User Journey

1. **Deposit Funds** → Add fiat or crypto to wallet
2. **Create Stablecoins** → Generate forex-backed tokens
3. **Create Forex Pairs** → Combine stablecoins into tradeable pairs
4. **Trade & Monitor** → Execute trades and view analytics

### Example Use Case

1. User deposits $1,000,000 USD
2. Selects JPY and GBP for forex pair creation
3. Platform creates:
   - $500k → JPYfx stablecoin
   - $500k → GBPfx stablecoin
   - Combined → JPYGBPfx crypto forex pair
4. User can trade the JPYGBPfx pair and view performance in crypto bubbles

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Custom hooks, Zustand-ready
- **Charts**: Recharts, custom SVG visualizations
- **Development**: ESLint, TypeScript strict mode

## 📈 Future Enhancements

- [ ] User authentication system.
- [ ] Wallet integration (MetaMask, WalletConnect)
- [ ] Real banking/crypto deposit integration
- [ ] Smart contract deployment
- [ ] Advanced charting tools
- [ ] Mobile application

---

**ForexFX Platform** - Revolutionizing forex trading with blockchain technology.
