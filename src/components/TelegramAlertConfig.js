import React, { useState } from 'react';
import { Bell, Send, Settings, CheckCircle, Volume2 } from 'lucide-react';

function ToggleSwitch({ enabled, onChange, label }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`w-8 h-4 rounded-full transition-colors relative ${
          enabled ? 'bg-neon-green/30' : 'bg-dark-600'
        }`}
      >
        <span className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${
          enabled ? 'right-0.5 bg-neon-green' : 'left-0.5 bg-gray-500'
        }`} />
      </button>
    </div>
  );
}

export default function TelegramAlertConfig() {
  const [config, setConfig] = useState({
    whalePosition: true,
    liquidationRisk: true,
    fundingAnomaly: true,
    breakingNews: true,
    smartWallet: true,
    crossExchange: false,
    optionsFlow: false,
    retailDivergence: true,
    tokenUnlock: true,
    whaleLiquidation: true,
  });

  const [thresholds, setThresholds] = useState({
    positionSize: 1000000,
    cascadeRisk: 70,
    newsScore: 8,
    smartScore: 90,
  });

  const [testSent, setTestSent] = useState(false);

  const toggleSetting = (key) => (value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleTest = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-500 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-500">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-neon-yellow" />
          <h2 className="text-sm font-bold text-white">Alert Configuration</h2>
        </div>
        <div className="flex items-center gap-2">
          <Settings size={12} className="text-gray-500" />
          <Volume2 size={12} className="text-gray-500" />
        </div>
      </div>
      <div className="px-4 py-3 space-y-3">
        <div>
          <div className="text-[10px] text-gray-500 uppercase mb-2">Alert Triggers</div>
          <div className="space-y-0.5">
            <ToggleSwitch enabled={config.whalePosition} onChange={toggleSetting('whalePosition')} label="Whale opens position > $1M" />
            <ToggleSwitch enabled={config.liquidationRisk} onChange={toggleSetting('liquidationRisk')} label="Liquidation cascade risk > 70%" />
            <ToggleSwitch enabled={config.fundingAnomaly} onChange={toggleSetting('fundingAnomaly')} label="Funding rate anomaly" />
            <ToggleSwitch enabled={config.breakingNews} onChange={toggleSetting('breakingNews')} label="Major breaking news (AI > 8)" />
            <ToggleSwitch enabled={config.smartWallet} onChange={toggleSetting('smartWallet')} label="Smart wallet (score 90+) position" />
            <ToggleSwitch enabled={config.crossExchange} onChange={toggleSetting('crossExchange')} label="Cross-exchange convergence" />
            <ToggleSwitch enabled={config.optionsFlow} onChange={toggleSetting('optionsFlow')} label="Large options flow" />
            <ToggleSwitch enabled={config.retailDivergence} onChange={toggleSetting('retailDivergence')} label="Whale vs Retail divergence" />
            <ToggleSwitch enabled={config.tokenUnlock} onChange={toggleSetting('tokenUnlock')} label="Token unlock within 24h" />
            <ToggleSwitch enabled={config.whaleLiquidation} onChange={toggleSetting('whaleLiquidation')} label="Whale near liquidation" />
          </div>
        </div>
        <div>
          <div className="text-[10px] text-gray-500 uppercase mb-2">Thresholds</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Min Position Size</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono text-white">${(thresholds.positionSize / 1e6).toFixed(1)}M</span>
                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="100000"
                  value={thresholds.positionSize}
                  onChange={e => setThresholds(prev => ({ ...prev, positionSize: parseInt(e.target.value) }))}
                  className="w-20 h-1 accent-neon-blue"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Cascade Risk Threshold</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono text-white">{thresholds.cascadeRisk}%</span>
                <input
                  type="range"
                  min="30"
                  max="95"
                  value={thresholds.cascadeRisk}
                  onChange={e => setThresholds(prev => ({ ...prev, cascadeRisk: parseInt(e.target.value) }))}
                  className="w-20 h-1 accent-neon-blue"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Min News AI Score</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono text-white">{thresholds.newsScore}/10</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={thresholds.newsScore}
                  onChange={e => setThresholds(prev => ({ ...prev, newsScore: parseInt(e.target.value) }))}
                  className="w-20 h-1 accent-neon-blue"
                />
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleTest}
          className={`w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            testSent
              ? 'bg-neon-green/20 text-neon-green'
              : 'bg-neon-blue/20 text-neon-blue hover:bg-neon-blue/30'
          }`}
        >
          {testSent ? (
            <><CheckCircle size={14} /> Test Alert Sent!</>
          ) : (
            <><Send size={14} /> Send Test Alert</>
          )}
        </button>
      </div>
    </div>
  );
}
