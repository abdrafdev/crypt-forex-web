# 🌐 Forex Crypto Trading Platform

A modern, full-stack decentralized trading platform that combines traditional forex trading with cryptocurrency markets. Built with Next.js, TypeScript, and Web3 technologies.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Ethereum](https://img.shields.io/badge/Ethereum-Smart%20Contracts-627EEA)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Project Structure](#project-structure)
- [Smart Contracts](#smart-contracts)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Forex Crypto Trading Platform is a comprehensive trading solution that bridges traditional forex markets with the cryptocurrency ecosystem. It provides users with a seamless interface to trade, analyze, and manage both forex pairs and cryptocurrencies in a single platform.

### Key Highlights

- **Dual Market Access**: Trade both forex pairs and cryptocurrencies
- **Web3 Integration**: Connect with MetaMask and other Web3 wallets
- **Real-time Data**: Live market data and price updates
- **Advanced Analytics**: Comprehensive charts and technical indicators
- **Secure Trading**: Smart contract-based trading with blockchain security
- **User Authentication**: Secure authentication with Clerk
- **Responsive Design**: Fully responsive UI for all devices

## ✨ Features

### Trading Features
- 📊 **Real-time Trading**: Execute trades with live market data
- 💱 **Forex Trading**: Major, minor, and exotic currency pairs
- ₿ **Crypto Trading**: Bitcoin, Ethereum, and major altcoins
- 📈 **Advanced Charts**: Interactive charts with D3.js and Recharts
- 🔄 **Cross-chain Swaps**: Seamless token swaps across networks
- 💰 **Portfolio Management**: Track and manage your trading portfolio
- 📱 **Mobile Responsive**: Trade on any device

### Technical Features
- 🔐 **Web3 Authentication**: MetaMask and WalletConnect integration
- 🏦 **Smart Contracts**: Ethereum-based trading contracts
- 🔒 **Secure API**: JWT-based authentication and authorization
- 📡 **WebSocket Support**: Real-time price updates
- 💾 **PostgreSQL Database**: Reliable data persistence
- 🚀 **Optimized Performance**: Next.js with server-side rendering
- 🎨 **Modern UI**: Built with Tailwind CSS and Radix UI

### User Features
- 👤 **User Dashboard**: Personalized trading dashboard
- 📊 **Trading History**: Complete transaction history
- 🔔 **Price Alerts**: Customizable price notifications
- 📈 **Analytics**: Detailed trading analytics and reports
- 💳 **Multi-wallet Support**: Connect multiple wallets
- 🌍 **Multi-language**: Support for multiple languages
- 🌙 **Dark/Light Mode**: Theme customization

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.3
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Web3**: Wagmi, Viem, Ethers.js
- **Charts**: D3.js, Recharts
- **Forms**: React Hook Form + Zod
- **Authentication**: Clerk

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Clerk Webhooks
- **Email**: Nodemailer
- **WebSocket**: WS library

### Blockchain
- **Smart Contracts**: Solidity
- **Development**: Hardhat
- **Libraries**: OpenZeppelin Contracts
- **Network**: Ethereum, Polygon

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend (Next.js)            │
│  ┌─────────────┐  ┌──────────┐  ┌────────────┐│
│  │   Pages     │  │   API    │  │   Components││
│  └─────────────┘  └──────────┘  └────────────┘│
└─────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────┐
│                Backend Services                 │
│  ┌─────────────┐  ┌──────────┐  ┌────────────┐│
│  │   Prisma    │  │WebSocket │  │   Auth     ││
│  └─────────────┘  └──────────┘  └────────────┘│
└─────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────┐
│              Infrastructure Layer               │
│  ┌─────────────┐  ┌──────────┐  ┌────────────┐│
│  │ PostgreSQL  │  │Blockchain│  │   Redis    ││
│  └─────────────┘  └──────────┘  └────────────┘│
└─────────────────────────────────────────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.0 or higher
- npm or yarn package manager
- PostgreSQL database
- Git

### Optional
- Docker & Docker Compose (for containerized setup)
- MetaMask browser extension (for Web3 features)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/crypt-forex-web.git
cd crypt-forex-web
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Database

```bash
# Run PostgreSQL (if not already running)
docker-compose up -d postgres

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

### 4. Deploy Smart Contracts

```bash
# Compile contracts
npx hardhat compile

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet (e.g., Sepolia)
npx hardhat run scripts/deploy.js --network sepolia
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/forexcrypto"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Web3
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_INFURA_API_KEY=your_infura_key

# Smart Contract Addresses
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_TOKEN_CONTRACT=0x...

# API Keys
FOREX_API_KEY=your_forex_api_key
CRYPTO_API_KEY=your_crypto_api_key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Security
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_encryption_key
```

## 💻 Development

### Running the Development Server

```bash
# Start the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run prisma:studio # Open Prisma Studio
```

### Development with Docker

```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up --build
```

## 📁 Project Structure

```
crypt-forex-web/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── ui/          # UI components
│   │   ├── trading/     # Trading-specific components
│   │   └── layout/      # Layout components
│   ├── lib/             # Utility functions
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand stores
│   ├── types/           # TypeScript type definitions
│   └── styles/          # Global styles
├── contracts/           # Smart contracts
│   ├── TradingPlatform.sol
│   └── Token.sol
├── scripts/            # Deployment and utility scripts
├── backend/            # Backend services
│   ├── api/           # API routes
│   ├── services/      # Business logic
│   └── utils/         # Utility functions
├── prisma/            # Database schema
│   └── schema.prisma
├── public/            # Static assets
└── tests/             # Test files
```

## 📜 Smart Contracts

### Main Contracts

1. **TradingPlatform.sol**
   - Core trading functionality
   - Order management
   - Fee distribution

2. **Token.sol**
   - ERC-20 token implementation
   - Liquidity pool integration

### Deployment

```bash
# Local deployment
npx hardhat run scripts/deploy.js --network localhost

# Mainnet deployment
npx hardhat run scripts/deploy.js --network mainnet

# Verify contracts
npx hardhat verify --network mainnet CONTRACT_ADDRESS
```

## 📡 API Documentation

### Authentication Endpoints

```typescript
POST   /api/auth/register    # User registration
POST   /api/auth/login       # User login
POST   /api/auth/logout      # User logout
GET    /api/auth/me         # Get current user
```

### Trading Endpoints

```typescript
GET    /api/trading/pairs    # Get available trading pairs
GET    /api/trading/price    # Get current prices
POST   /api/trading/order    # Place an order
GET    /api/trading/orders   # Get user orders
DELETE /api/trading/order    # Cancel order
```

### Market Data

```typescript
GET    /api/market/ticker    # Get market ticker
GET    /api/market/chart     # Get chart data
GET    /api/market/orderbook # Get order book
WS     /ws/market           # WebSocket for real-time data
```

## 🔒 Security

### Security Features
- JWT token authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- SQL injection prevention with Prisma
- XSS protection
- CORS configuration
- Environment variable encryption
- Smart contract auditing

### Best Practices
- Never commit sensitive data
- Use environment variables for configuration
- Regular dependency updates
- Security audits for smart contracts
- Implement proper error handling
- Use HTTPS in production

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write unit tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenZeppelin for smart contract libraries
- Clerk for authentication services
- Vercel for hosting and deployment
- The open-source community for amazing tools and libraries

## 📞 Contact & Support

- **Email**: support@forexcrypto.com
- **Discord**: [Join our community](https://discord.gg/forexcrypto)
- **Twitter**: [@ForexCryptoPlatform](https://twitter.com/forexcrypto)
- **Documentation**: [docs.forexcrypto.com](https://docs.forexcrypto.com)

---

**Built with ❤️ by the Forex Crypto Team**
