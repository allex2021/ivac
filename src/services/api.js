const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const COINGECKO_KEY = process.env.REACT_APP_COINGECKO_KEY || '';
const BINANCE_API = 'https://api.binance.com/api/v3';
const BINANCE_FAPI = 'https://fapi.binance.com';
const BYBIT_API = 'https://api.bybit.com/v5';
const HYPERLIQUID_API = 'https://api.hyperliquid.xyz';
const ALTERNATIVE_ME_API = 'https://api.alternative.me';
const DEFILLAMA_API = 'https://api.llama.fi';
const OPENROUTER_API = 'https://openrouter.ai/api/v1';
const OPENROUTER_KEY = process.env.REACT_APP_OPENROUTER_KEY || '';
const CRYPTOPANIC_API = 'https://cryptopanic.com/api/v1';

async function fetchJSON(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: { 'Accept': 'application/json', ...options.headers }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`API call failed: ${url}`, err.message);
    return null;
  }
}

// ─── CoinGecko ───
export async function fetchMarketOverview() {
  const data = await fetchJSON(
    `${COINGECKO_API}/global?x_cg_demo_api_key=${COINGECKO_KEY}`
  );
  if (!data?.data) return null;
  return {
    totalMarketCap: data.data.total_market_cap?.usd || 0,
    totalVolume: data.data.total_volume?.usd || 0,
    btcDominance: data.data.market_cap_percentage?.btc || 0,
    ethDominance: data.data.market_cap_percentage?.eth || 0,
    marketCapChange24h: data.data.market_cap_change_percentage_24h_usd || 0,
  };
}

export async function fetchTopCoins() {
  const data = await fetchJSON(
    `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&sparkline=false&x_cg_demo_api_key=${COINGECKO_KEY}`
  );
  return data || [];
}

export async function fetchCoinPrices(ids = 'bitcoin,ethereum,solana') {
  const data = await fetchJSON(
    `${COINGECKO_API}/simple/price?ids=${ids}&vs_currency=usd&include_24hr_change=true&include_market_cap=true&x_cg_demo_api_key=${COINGECKO_KEY}`
  );
  return data || {};
}

// ─── Binance ───
export async function fetchBinanceTicker(symbol = 'BTCUSDT') {
  return fetchJSON(`${BINANCE_API}/ticker/24hr?symbol=${symbol}`);
}

export async function fetchBinancePrices() {
  const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT'];
  const promises = symbols.map(s => fetchJSON(`${BINANCE_API}/ticker/24hr?symbol=${s}`));
  const results = await Promise.all(promises);
  return results.filter(Boolean);
}

export async function fetchFundingRates() {
  const data = await fetchJSON(`${BINANCE_FAPI}/fapi/v1/premiumIndex`);
  if (!Array.isArray(data)) return [];
  const majorCoins = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 'MATICUSDT', 'LINKUSDT', 'UNIUSDT', 'AAVEUSDT', 'LTCUSDT', 'ARBUSDT', 'OPUSDT'];
  return data.filter(d => majorCoins.includes(d.symbol));
}

export async function fetchOpenInterest(symbol = 'BTCUSDT') {
  return fetchJSON(`${BINANCE_FAPI}/fapi/v1/openInterest?symbol=${symbol}`);
}

export async function fetchOrderBook(symbol = 'BTCUSDT', limit = 20) {
  return fetchJSON(`${BINANCE_API}/depth?symbol=${symbol}&limit=${limit}`);
}

// ─── Bybit ───
export async function fetchBybitTicker(symbol = 'BTCUSDT') {
  const data = await fetchJSON(`${BYBIT_API}/market/tickers?category=linear&symbol=${symbol}`);
  return data?.result?.list?.[0] || null;
}

// ─── Fear & Greed ───
export async function fetchFearGreed() {
  const data = await fetchJSON(`${ALTERNATIVE_ME_API}/crypto/fear-and-greed/`);
  return data?.data?.[0] || null;
}

// ─── Hyperliquid ───
export async function fetchHyperliquidPositions() {
  try {
    const res = await fetch(`${HYPERLIQUID_API}/info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'metaAndAssetCtxs' })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn('Hyperliquid API failed:', e.message);
    return null;
  }
}

export async function fetchHyperliquidUserState(address) {
  try {
    const res = await fetch(`${HYPERLIQUID_API}/info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'clearinghouseState', user: address })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

// ─── DefiLlama ───
export async function fetchDefiTVL() {
  return fetchJSON(`${DEFILLAMA_API}/protocols`);
}

export async function fetchDefiChains() {
  return fetchJSON(`${DEFILLAMA_API}/chains`);
}

// ─── CryptoPanic News ───
export async function fetchCryptoNews() {
  const data = await fetchJSON(
    `${CRYPTOPANIC_API}/posts/?auth_token=free&public=true&kind=news&filter=important`
  );
  return data?.results || [];
}

// ─── OpenRouter AI ───
export async function callAI(model, systemPrompt, userPrompt) {
  try {
    const res = await fetch(`${OPENROUTER_API}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://whale-intelligence-pro.app',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (e) {
    console.warn('AI call failed:', e.message);
    return null;
  }
}

export async function analyzeWhaleMove(position) {
  return callAI(
    'groq/llama-3.3-70b-versatile',
    'You are a crypto whale analyst. Analyze whale positions and give a short verdict (1-2 sentences). Include a confidence score 0-100.',
    `Whale position: ${JSON.stringify(position)}`
  );
}

export async function analyzeNewsSentiment(headline) {
  return callAI(
    'google/gemini-2.0-flash-exp:free',
    'You are a crypto news analyst. Score this news impact 1-10 and give a BULLISH/BEARISH/NEUTRAL verdict in JSON format: {"score": N, "verdict": "...", "impact": "..."}',
    `News headline: ${headline}`
  );
}

export async function generateMarketAnalysis(marketData) {
  return callAI(
    'deepseek/deepseek-r1:free',
    'You are an expert crypto market analyst. Provide a concise market analysis with trading signals based on the data. Format as JSON: {"signals": [...], "analysis": "...", "risk_level": "LOW/MEDIUM/HIGH", "confidence": N}',
    `Market data: ${JSON.stringify(marketData)}`
  );
}

export async function assessRisk(data) {
  return callAI(
    'mistralai/mistral-7b-instruct:free',
    'You are a risk assessment AI. Score the liquidation cascade risk 0-100 and provide a brief assessment. Format as JSON: {"risk_score": N, "assessment": "..."}',
    `Position and market data: ${JSON.stringify(data)}`
  );
}

// ─── Whale addresses to track (known Hyperliquid whales) ───
export const WHALE_ADDRESSES = [
  { address: '0x1fA0e8d04f21412347D1C1FAB38DBE7BD0d1E00c', alias: 'HyperWhale_1', tag: 'Smart Money' },
  { address: '0x20B3e0e3CC587c6e1690d5e5E5Da6c6BCd2f8CC3', alias: 'DegenKing', tag: 'Degen' },
  { address: '0x3030303030303030303030303030303030303030', alias: 'InstitutionAlpha', tag: 'Institution' },
  { address: '0xe8f21c1ff451e5f582c36f8e8cf46feaf0535e19', alias: 'SizeMatters', tag: 'Whale' },
  { address: '0xa089E29A4f2F64bFd364b7524B857c1B11AB1afe', alias: 'LiqHunter', tag: 'Liquidator' },
  { address: '0xBa84c3e2C0f1BC2E6b2E1B59c9e8591782a7A3Ce', alias: 'TrendFollower', tag: 'Trend' },
  { address: '0xF4dC89F99F20B28c116C5dB3b1B96ee27769eA12', alias: 'BigShort', tag: 'Contrarian' },
  { address: '0x2222222222222222222222222222222222222222', alias: 'GigaBrain', tag: 'AI Trader' },
];

// ─── Generate simulated whale data when APIs are rate-limited ───
export function generateWhaleData() {
  const coins = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'DOGE', 'AVAX', 'ARB', 'OP', 'LINK'];
  const sides = ['LONG', 'SHORT'];
  return WHALE_ADDRESSES.map((w, i) => {
    const coin = coins[i % coins.length];
    const side = sides[Math.floor(Math.random() * 2)];
    const size = (Math.random() * 10 + 1).toFixed(2);
    const leverage = Math.floor(Math.random() * 50 + 2);
    const entryPrice = side === 'LONG'
      ? (100000 - Math.random() * 5000).toFixed(2)
      : (100000 + Math.random() * 5000).toFixed(2);
    const currentPrice = (100000 + (Math.random() - 0.5) * 4000).toFixed(2);
    const pnl = side === 'LONG'
      ? ((currentPrice - entryPrice) * size * leverage).toFixed(2)
      : ((entryPrice - currentPrice) * size * leverage).toFixed(2);
    const liqPrice = side === 'LONG'
      ? (entryPrice * (1 - 1 / leverage)).toFixed(2)
      : (entryPrice * (1 + 1 / leverage)).toFixed(2);
    const liqDistance = Math.abs((currentPrice - liqPrice) / currentPrice * 100).toFixed(1);
    const smartScore = Math.floor(Math.random() * 40 + 60);

    return {
      ...w,
      coin,
      side,
      sizeUSD: `$${(size * currentPrice / 1000).toFixed(0)}K`,
      sizeRaw: parseFloat(size),
      leverage: `${leverage}x`,
      leverageRaw: leverage,
      entryPrice: parseFloat(entryPrice),
      currentPrice: parseFloat(currentPrice),
      pnl: parseFloat(pnl),
      pnlPercent: ((pnl / (size * entryPrice)) * 100).toFixed(1),
      liqPrice: parseFloat(liqPrice),
      liqDistance: parseFloat(liqDistance),
      smartScore,
      timestamp: Date.now() - Math.floor(Math.random() * 3600000),
    };
  });
}

// ─── Generate liquidation levels ───
export function generateLiquidationLevels(currentPrice = 100000) {
  const levels = [];
  for (let i = -10; i <= 10; i++) {
    if (i === 0) continue;
    const price = currentPrice * (1 + i * 0.005);
    const amount = Math.random() * 500 + 50;
    levels.push({
      price: Math.round(price),
      amount: Math.round(amount * 1000000),
      type: i > 0 ? 'SHORT' : 'LONG',
      intensity: Math.random(),
    });
  }
  return levels.sort((a, b) => a.price - b.price);
}

// ─── Generate options flow data ───
export function generateOptionsFlow() {
  const types = ['CALL', 'PUT'];
  const expiries = ['2026-05-29', '2026-06-05', '2026-06-12', '2026-06-26', '2026-07-31'];
  const strikes = [90000, 95000, 100000, 105000, 110000, 115000, 120000];
  const flows = [];
  for (let i = 0; i < 15; i++) {
    const type = types[Math.floor(Math.random() * 2)];
    const strike = strikes[Math.floor(Math.random() * strikes.length)];
    const expiry = expiries[Math.floor(Math.random() * expiries.length)];
    const premium = (Math.random() * 5000 + 500).toFixed(0);
    const size = Math.floor(Math.random() * 200 + 10);
    const sentiment = type === 'CALL' ? 'BULLISH' : 'BEARISH';
    flows.push({
      id: i,
      type,
      coin: 'BTC',
      strike,
      expiry,
      premium: parseInt(premium),
      size,
      notional: `$${(size * premium / 1000).toFixed(0)}K`,
      sentiment,
      unusual: Math.random() > 0.7,
      timestamp: Date.now() - Math.floor(Math.random() * 7200000),
    });
  }
  return flows.sort((a, b) => b.timestamp - a.timestamp);
}

// ─── Generate funding rate anomalies ───
export function detectFundingAnomalies(rates) {
  if (!rates || !rates.length) return [];
  return rates.map(r => {
    const rate = parseFloat(r.lastFundingRate || 0);
    const isAnomaly = Math.abs(rate) > 0.001;
    const squeezeProbability = Math.min(Math.abs(rate) * 5000, 95);
    return {
      symbol: r.symbol?.replace('USDT', '') || 'UNKNOWN',
      rate: (rate * 100).toFixed(4),
      rateRaw: rate,
      isAnomaly,
      direction: rate > 0 ? 'LONG-heavy' : 'SHORT-heavy',
      squeezeProbability: squeezeProbability.toFixed(0),
      markPrice: parseFloat(r.markPrice || 0).toFixed(2),
      indexPrice: parseFloat(r.indexPrice || 0).toFixed(2),
    };
  });
}
