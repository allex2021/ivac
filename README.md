# Whale Intelligence Pro

A professional crypto trading intelligence dashboard built with React + Tailwind CSS.

## Features

- **Whale Tracker**: Live whale positions with Smart Money Score
- **Liquidation Heatmap**: Visual liquidation levels with cascade risk
- **Options Flow**: Large options trades with Put/Call ratio
- **News & AI Analysis**: Breaking news with AI sentiment scoring
- **Smart Money Scoreboard**: Top wallets ranked by win rate
- **Cross-Exchange Signals**: Multi-exchange signal convergence
- **Inter-Market Correlation**: DXY, S&P 500, Gold vs BTC charts
- **Funding Rate Monitor**: Anomaly detection with squeeze probability
- **AI Trading Signals**: AI-generated signals with confidence scores
- **Whale vs Retail Divergence**: Smart money vs retail positioning
- **Alert Configuration**: Configurable alert thresholds
- **Real-time Updates**: Auto-refresh every 30 seconds

## Data Sources

- Binance, Bybit, Hyperliquid (Market Data)
- CoinGecko (Prices, Market Cap)
- OpenRouter AI (Analysis via Llama, Gemini, DeepSeek, Mistral)
- Alternative.me (Fear & Greed Index)
- CryptoPanic (News)

## Stack

- React 19
- Tailwind CSS 3
- Recharts
- Lucide React Icons

## Getting Started

```bash
# Install dependencies
npm install

# Create .env file with your API keys (see .env.example)
cp .env.example .env

# Start development server
npm start
```

## Environment Variables

See `.env.example` for required keys:
- `REACT_APP_OPENROUTER_KEY` — OpenRouter API key for AI features
- `REACT_APP_COINGECKO_KEY` — CoinGecko API key for market data

## Brand

**Whale Intelligence Pro** — Powered by Allex@Cyber2
