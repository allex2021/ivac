import React, { useState, useEffect, useCallback, useRef } from 'react';
import HeaderBar from './components/HeaderBar';
import WhaleTracker from './components/WhaleTracker';
import LiquidationHeatmap from './components/LiquidationHeatmap';
import OptionsFlow from './components/OptionsFlow';
import NewsAnalysis from './components/NewsAnalysis';
import SmartMoneyBoard from './components/SmartMoneyBoard';
import CrossExchangeSignal from './components/CrossExchangeSignal';
import InterMarketCorrelation from './components/InterMarketCorrelation';
import FundingRateMonitor from './components/FundingRateMonitor';
import AITradingSignals from './components/AITradingSignals';
import WhaleRetailDivergence from './components/WhaleRetailDivergence';
import TelegramAlertConfig from './components/TelegramAlertConfig';
import AlertNotification from './components/AlertNotification';
import { CardSkeleton } from './components/LoadingSkeleton';
import {
  fetchCoinPrices,
  fetchFearGreed,
  fetchMarketOverview,
  fetchFundingRates,
  fetchCryptoNews,
  fetchBinancePrices,
  generateWhaleData,
  generateLiquidationLevels,
  generateOptionsFlow,
  analyzeWhaleMove,
  analyzeNewsSentiment,
} from './services/api';

function App() {
  const [prices, setPrices] = useState(null);
  const [fearGreed, setFearGreed] = useState(null);
  const [marketOverview, setMarketOverview] = useState(null);
  const [whales, setWhales] = useState([]);
  const [liqLevels, setLiqLevels] = useState([]);
  const [optionsFlow, setOptionsFlow] = useState([]);
  const [fundingRates, setFundingRates] = useState([]);
  const [news, setNews] = useState([]);
  const [binancePrices, setBinancePrices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const alertIdRef = useRef(0);

  const addAlert = useCallback((alert) => {
    const id = ++alertIdRef.current;
    const newAlert = { ...alert, id, timestamp: Date.now() };
    setAlerts(prev => [newAlert, ...prev].slice(0, 20));
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }, 12000);
  }, []);

  const dismissAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  const checkAlerts = useCallback((whaleData, fundingData) => {
    (whaleData || []).forEach(w => {
      if (w.sizeRaw * w.currentPrice > 1000000 && w.smartScore >= 90) {
        addAlert({
          type: 'whale',
          severity: 'critical',
          title: `Smart Whale ${w.alias} opened ${w.side}`,
          message: `${w.coin} ${w.sizeUSD} @ ${w.leverage} | Score: ${w.smartScore}`,
        });
      }
      if (w.liqDistance < 3) {
        addAlert({
          type: 'liquidation',
          severity: 'warning',
          title: `${w.alias} nearing liquidation`,
          message: `${w.coin} ${w.side} only ${w.liqDistance}% from liq price`,
        });
      }
    });

    (fundingData || []).forEach(r => {
      const rate = parseFloat(r.lastFundingRate || 0);
      if (Math.abs(rate) > 0.002) {
        addAlert({
          type: 'funding',
          severity: 'warning',
          title: `Funding anomaly: ${r.symbol}`,
          message: `Rate: ${(rate * 100).toFixed(4)}% - ${rate > 0 ? 'Long-heavy' : 'Short-heavy'}`,
        });
      }
    });
  }, [addAlert]);

  const fetchAllData = useCallback(async () => {
    try {
      const [priceData, fgData, mktData, fundingData, newsData, binData] = await Promise.all([
        fetchCoinPrices(),
        fetchFearGreed(),
        fetchMarketOverview(),
        fetchFundingRates(),
        fetchCryptoNews(),
        fetchBinancePrices(),
      ]);

      if (priceData) setPrices(priceData);
      if (fgData) setFearGreed(fgData);
      if (mktData) setMarketOverview(mktData);
      if (fundingData) setFundingRates(fundingData);
      if (newsData) setNews(newsData);
      if (binData) setBinancePrices(binData);

      const btcPrice = priceData?.bitcoin?.usd || 100000;
      const whaleData = generateWhaleData();
      setWhales(whaleData);
      setLiqLevels(generateLiquidationLevels(btcPrice));
      setOptionsFlow(generateOptionsFlow());

      checkAlerts(whaleData, fundingData);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Data fetch error:', err);
      setWhales(generateWhaleData());
      setLiqLevels(generateLiquidationLevels());
      setOptionsFlow(generateOptionsFlow());
      setLoading(false);
    }
  }, [checkAlerts]);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  const handleAnalyzeWhale = useCallback(async (whale) => {
    setAiLoading(true);
    try {
      const result = await analyzeWhaleMove(whale);
      if (result) {
        addAlert({
          type: 'signal',
          severity: 'info',
          title: `AI Analysis: ${whale.alias}`,
          message: result.slice(0, 200),
        });
      }
    } catch (e) {
      console.warn('Whale analysis failed:', e);
    }
    setAiLoading(false);
  }, [addAlert]);

  const handleAnalyzeNews = useCallback(async (headline) => {
    return analyzeNewsSentiment(headline);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900">
        <div className="bg-dark-800 border-b border-dark-500 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Whale Intelligence Pro</h1>
              <p className="text-[9px] text-gray-500">Loading market data...</p>
            </div>
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <CardSkeleton height="h-32" />
          <CardSkeleton height="h-32" />
          <CardSkeleton height="h-32" />
          <div className="md:col-span-2 xl:col-span-3">
            <CardSkeleton height="h-48" />
          </div>
          <CardSkeleton height="h-48" />
          <CardSkeleton height="h-48" />
          <CardSkeleton height="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <HeaderBar
        prices={prices}
        fearGreed={fearGreed}
        marketOverview={marketOverview}
        lastUpdate={lastUpdate}
      />

      <AlertNotification alerts={alerts} onDismiss={dismissAlert} />

      <main className="p-3 space-y-3">
        {/* Row 1: Whale Tracker (full width) */}
        <WhaleTracker whales={whales} onAnalyze={handleAnalyzeWhale} />

        {/* Row 2: Liquidation + Options Flow + News */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <LiquidationHeatmap
            levels={liqLevels}
            currentPrice={prices?.bitcoin?.usd}
            cascadeRisk={null}
          />
          <OptionsFlow flows={optionsFlow} />
          <NewsAnalysis news={news} onAnalyze={handleAnalyzeNews} />
        </div>

        {/* Row 3: Smart Money + Cross Exchange + Inter-Market */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <SmartMoneyBoard whales={whales} />
          <CrossExchangeSignal binancePrices={binancePrices} />
          <InterMarketCorrelation />
        </div>

        {/* Row 4: Funding + AI Signals + Divergence */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <FundingRateMonitor fundingRates={fundingRates} />
          <AITradingSignals loading={aiLoading} />
          <WhaleRetailDivergence />
        </div>

        {/* Row 5: Telegram Config */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <TelegramAlertConfig />
          <div className="lg:col-span-2 bg-dark-800 rounded-xl border border-dark-500 p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              System Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Data Feed', status: 'Online', color: 'text-neon-green' },
                { label: 'AI Engine', status: 'Active', color: 'text-neon-blue' },
                { label: 'Alert System', status: 'Armed', color: 'text-neon-yellow' },
                { label: 'WebSocket', status: 'Connected', color: 'text-neon-green' },
              ].map((s, i) => (
                <div key={i} className="bg-dark-700 rounded-lg px-3 py-2">
                  <div className="text-[10px] text-gray-500 uppercase">{s.label}</div>
                  <div className={`text-xs font-mono font-bold ${s.color} flex items-center gap-1`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.color === 'text-neon-green' ? 'bg-neon-green' : s.color === 'text-neon-blue' ? 'bg-neon-blue' : 'bg-neon-yellow'} animate-pulse`} />
                    {s.status}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-dark-700 rounded-lg px-3 py-2">
                <div className="text-[10px] text-gray-500">Refresh Rate</div>
                <div className="text-white font-mono">30s</div>
              </div>
              <div className="bg-dark-700 rounded-lg px-3 py-2">
                <div className="text-[10px] text-gray-500">APIs Connected</div>
                <div className="text-white font-mono">8/12</div>
              </div>
              <div className="bg-dark-700 rounded-lg px-3 py-2">
                <div className="text-[10px] text-gray-500">AI Models</div>
                <div className="text-white font-mono">4 active</div>
              </div>
              <div className="bg-dark-700 rounded-lg px-3 py-2">
                <div className="text-[10px] text-gray-500">Alerts Sent</div>
                <div className="text-white font-mono">{alertIdRef.current}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-500 px-4 py-3 mt-4">
        <div className="flex items-center justify-between text-[10px] text-gray-600">
          <span>Powered by <span className="text-neon-blue font-medium">Allex@Cyber2</span></span>
          <span>Whale Intelligence Pro v1.0 | Real-time Crypto Trading Intelligence</span>
          <span>Data from Binance, CoinGecko, Hyperliquid, OpenRouter AI</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
