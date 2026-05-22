---
name: testing-whale-dashboard
description: Test the Whale Intelligence Pro crypto dashboard end-to-end. Use when verifying dashboard UI, data rendering, interactive features, or API integrations.
---

# Testing Whale Intelligence Pro Dashboard

## Overview
React + Tailwind CSS crypto trading dashboard with 12 sections, real-time data from multiple APIs, AI analysis via OpenRouter, and an alert system.

## Prerequisites
- Node.js 22+ installed
- `.env` file in the project root with API keys (see `.env.example`)
- Dev server runs on `http://localhost:3000`

## Devin Secrets Needed
- `REACT_APP_OPENROUTER_KEY` — OpenRouter API key for AI analysis features
- `REACT_APP_COINGECKO_KEY` — CoinGecko API key for market data

## Setup
```bash
npm install
npm start  # runs on port 3000
```

## Key Test Areas

### 1. Dashboard Load
- Navigate to `http://localhost:3000`
- Verify header shows branding, Fear & Greed index, Market Cap, BTC Dominance, timestamp
- Note: BTC/ETH/SOL prices might show `$-- --` if CoinGecko API is rate-limited or failing

### 2. Whale Tracker Filtering
- Click LONG/SHORT/ALL filter buttons
- Verify position count updates and only matching rows are shown
- Verify active button has blue highlight

### 3. Whale Tracker Sorting
- Click any column header (e.g., PnL)
- Verify rows reorder and sort chevron appears
- Click again to reverse sort direction

### 4. AI News Sentiment (requires working OpenRouter API)
- Click "AI Score" button on a news item
- Expected: loading spinner → score (1-10) + verdict badge
- Known issue: The 30-second auto-refresh might reset component state before API response arrives, causing the result to be lost. Consider temporarily disabling auto-refresh for this test.

### 5. Alert Configuration
- Toggle switches should change from blue↔gray on click
- "Send Test Alert" button should show "Test Alert Sent!" with checkmark for ~3 seconds
- Range sliders should be interactive

### 6. Funding Rate Monitor
- Known issue: Might show "Loading funding rates..." permanently if Binance Futures API is blocked or rate-limited
- Check browser console for API errors if this occurs

### 7. Footer & Branding
- Scroll to bottom of page
- Verify "Powered by Allex@Cyber2" and "Whale Intelligence Pro v1.0"

## Testing Tips

### Scrolling
The computer use tool's scroll action may not work reliably on this page. Use Playwright via CDP instead:
```javascript
const { chromium } = require('playwright');
const browser = await chromium.connectOverCDP('http://localhost:29229');
const page = browser.contexts()[0].pages().find(p => p.url().includes('localhost:3000'));
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
```

### Auto-refresh Interference
The dashboard auto-refreshes every 30 seconds. This can:
- Reset component local state (like AI analysis results)
- Change whale position data between screenshots
- Update timestamps and rankings

### Button Click Issues
If button clicks via coordinate don't register, use Playwright CDP to click elements directly:
```javascript
const btn = await page.$('button:has-text("Send Test Alert")');
await btn.click();
```

### API Dependencies
Many sections use simulated/fallback data when APIs fail. This means:
- Sections still render even without live API access
- Data will be randomly generated each refresh cycle
- The alert system will still trigger based on simulated thresholds

## Known Issues
- Funding Rate Monitor might be stuck on loading state due to Binance Futures API access
- AI Score buttons might not respond if OpenRouter API key is invalid or CORS blocks the request
- Header prices might show placeholder values if CoinGecko is rate-limited
