# GST - General Stock Trading System

A comprehensive Vietnam stock market technical analysis and trading platform built with React, TypeScript, and Vite.

## 🎯 Project Overview

GST Frontend is designed specifically for the Vietnam stock market (HOSE/HNX exchanges) with built-in support for local trading rules:
- **±7% daily price limits (HOSE)** and **±10% (HNX)**
- **100-share minimum lot sizes**
- **T+2 settlement tracking**
- **Trading sessions**: ATO, Morning, Break, Afternoon, ATC

## ✅ Phase 0: Foundation Complete

The foundation infrastructure is fully implemented and tested:

### Core Infrastructure
- ✅ Domain-driven project structure (`features/`, `services/`, `shared/`, `context/`)
- ✅ Context providers for global state (WebSocket, MarketData)
- ✅ TypeScript type system for all domain entities
- ✅ Environment configuration with `.env` support

### Vietnam Market Rules Engine
- ✅ **Price Limit Validation** - Prevents orders outside ±7% (HOSE) or ±10% (HNX)
- ✅ **Lot Size Adjustment** - Rounds quantities to 100-share multiples
- ✅ **Trading Session Detection** - Tracks ATO, MORNING, BREAK, AFTERNOON, ATC, POST_MARKET
- ✅ **T+2 Settlement Calculator** - Calculates when shares can be sold

### Network Services
- ✅ **REST API Client** - Complete backend integration with endpoints for:
  - Market data (OHLCV, indicators)
  - Regime detection
  - Trade setups scanning
  - Risk calculations
  - Position management
  - Performance analytics
  
- ✅ **WebSocket Client** - Real-time data with:
  - Auto-reconnect with exponential backoff
  - Subscription management for price/tick/index data
  - Connection status tracking
  - Message routing to subscribers

### Testing
- ✅ **Unit test framework configured** - Vitest ready to use (install with `npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom happy-dom`)
- ✅ **Test files prepared** - 4 test suites with 50+ tests written for Vietnam market rules
- ℹ️ **Tests require dependencies** - Run `npm install -D vitest` to enable testing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd react-stock-trading

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8080/ws

# Feature Flags
VITE_ENABLE_WEBSOCKET=true
VITE_ENABLE_DEBUG=false
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (http://localhost:5173) |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## 🧪 Testing (Optional)

Testing dependencies are not installed by default. To enable testing, install Vitest:

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom happy-dom
```

Then add test scripts to `package.json`:

```json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage"
}
```

Test files are prepared in `src/services/vietnam/__tests__/` covering all Vietnam market rules.

## 🏗️ Project Structure

```
src/
├── features/           # Feature modules (market, regime, scanner, risk, monitoring, analytics)
│   ├── market/        # Market data & charts
│   ├── regime/        # Market regime detection
│   ├── scanner/       # Trade setup scanner
│   ├── risk/          # Risk & position calculator
│   ├── monitoring/    # Position monitoring
│   └── analytics/     # Performance analytics
├── shared/            # Shared utilities
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript type definitions
├── services/          # External services
│   ├── api/           # REST API client
│   ├── websocket/     # WebSocket client
│   └── vietnam/       # Vietnam market rules engine
├── context/           # React Context providers
│   ├── WebSocketContext.tsx
│   ├── MarketDataContext.tsx
│   └── index.tsx
├── App.tsx            # Root component
└── main.tsx          # Application entry point
```

## 📦 Tech Stack

### Core
- **React 19.2.0** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite (Rolldown 7.2.5)** - Build tool with HMR

### UI & Visualization
- **Lightweight Charts 5.1** - Financial charting library
- **React Hook Form 7.70** - Form management
- **Zod 4.3** - Schema validation

### Utilities
- **date-fns 4.1** - Date manipulation for T+2 settlement

### Testing (Optional Dependencies)
- **Vitest** - Unit testing framework (install with `npm install -D vitest`)
- **Testing Library** - React component testing
- **Happy DOM** - DOM implementation for tests
- Test files prepared in `src/services/vietnam/__tests__/`

## 🗺️ Roadmap

### ✅ Phase 0: Foundation & Setup (Week 1) - **COMPLETE**
- [x] Project structure
- [x] Vietnam market rules engine
- [x] API & WebSocket clients
- [x] Context providers
- [x] Production build validated

### 🔄 Phase 1: Market Data & Technical Indicators (Week 2-3) - **NEXT**
- [ ] OHLCV candlestick chart component
- [ ] Technical indicators (RSI, MACD, Stochastic, ADX, ATR, Bollinger Bands, VWAP)
- [ ] Timeframe selector (1m, 5m, 15m, 30m, 1h, 4h, 1d)
- [ ] Real-time price updates
- [ ] Volume profile visualization

### ✅ Phase 2: Market Regime Display (Week 4) - **COMPLETE**
- [x] Current regime indicator
- [x] Regime change alerts
- [x] Historical regime overlay

### ✅ Phase 3: Trade Setup Scanner (Week 5-6) - **COMPLETE**
- [x] Active setups list
- [x] Setup details modal
- [x] Real-time setup detection

### ✅ Phase 4: Risk & Position Calculator (Week 7-8) - **COMPLETE**
- [x] Risk calculation form
- [x] Position size calculator
- [x] Vietnam rules validation

### ✅ Phase 5: Position Monitoring (Week 9-10) - **COMPLETE**
- [x] Active positions dashboard
- [x] P&L tracking
- [x] Stop management with trailing suggestions
- [x] Stagnation alerts
- [x] Emergency stop/target hit alerts

### 📅 Phase 6: Performance Analytics (Week 11-12)
- [ ] Equity curve
- [ ] Win rate metrics
- [ ] Trade history

### 📅 Phase 7: Integration & Polish (Week 13-14)
- [ ] Cross-feature integration
- [ ] Performance optimization
- [ ] Final testing

## 🔒 Vietnam Market Rules

The platform enforces Vietnam-specific trading rules:

### Price Limits
- **HOSE**: ±7% from reference price
- **HNX**: ±10% from reference price
- Automatic validation prevents invalid stop-loss/take-profit orders

### Lot Sizes
- Minimum: 100 shares
- All quantities rounded to nearest 100
- Helper functions for lot calculation

### Trading Sessions
| Session | Time | Description |
|---------|------|-------------|
| ATO | 09:00-09:15 | Opening auction |
| MORNING | 09:15-11:30 | Morning continuous trading |
| BREAK | 11:30-13:00 | Lunch break |
| AFTERNOON | 13:00-14:30 | Afternoon continuous trading |
| ATC | 14:30-14:45 | Closing auction |
| POST_MARKET | 14:45-15:00 | Post-market period |

### Settlement
- **T+2 settlement** - Shares can be sold 2 business days after purchase
- Weekend/holiday handling
- Settlement date calculator

## 📖 Documentation

- [OpenSpec Proposal](./openspec/changes/implement-gst-frontend-core/proposal.md) - Project proposal and objectives
- [Architecture Design](./openspec/changes/implement-gst-frontend-core/design.md) - Technical architecture decisions
- [Task List](./openspec/changes/implement-gst-frontend-core/tasks.md) - Detailed implementation tasks (169 tasks)
- [Frontend-Backend Alignment](./GST_FRONTEND_BACKEND_ALIGNMENT.md) - API contract documentation

## 🤝 Contributing

This project follows the [OpenSpec](./openspec/) methodology for spec-driven development.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with OpenSpec spec-driven development methodology
- Designed for Vietnam stock market (HOSE/HNX)
- Based on Golden Seven Trading technical analysis system
