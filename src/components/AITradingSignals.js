import React from 'react';
import { Brain, ArrowUpRight, ArrowDownRight, Shield, Loader2 } from 'lucide-react';

function ConfidenceBar({ value }) {
  let color = 'bg-neon-green';
  if (value < 50) color = 'bg-neon-red';
  else if (value < 70) color = 'bg-neon-yellow';

  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 bg-dark-600 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[10px] font-mono text-gray-400">{value}%</span>
    </div>
  );
}

function RiskBadge({ level }) {
  const colors = {
    LOW: 'bg-neon-green/20 text-neon-green',
    MEDIUM: 'bg-neon-yellow/20 text-neon-yellow',
    HIGH: 'bg-neon-red/20 text-neon-red',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${colors[level] || colors.MEDIUM}`}>
      {level}
    </span>
  );
}

export default function AITradingSignals({ signals, loading }) {
  const defaultSignals = signals || [
    {
      id: 1, coin: 'BTC', direction: 'LONG', confidence: 82, risk: 'MEDIUM',
      reason: 'Whale accumulation detected with strong funding rate support',
      evidence: ['3 whales opened $5M+ longs', 'Funding rate normalized', 'OI increasing steadily'],
      model: 'groq/llama-3.3-70b', timestamp: Date.now() - 300000,
    },
    {
      id: 2, coin: 'ETH', direction: 'LONG', confidence: 75, risk: 'LOW',
      reason: 'ETF inflow momentum with bullish cross-exchange signals',
      evidence: ['ETF saw $500M inflows', 'Bybit + Binance aligned bullish', 'Fear & Greed rising'],
      model: 'deepseek/deepseek-r1', timestamp: Date.now() - 600000,
    },
    {
      id: 3, coin: 'SOL', direction: 'SHORT', confidence: 68, risk: 'HIGH',
      reason: 'Whale distribution pattern with upcoming token unlock',
      evidence: ['2 whales closed longs', 'Token unlock in 48h', 'Retail over-leveraged long'],
      model: 'mistral-7b-instruct', timestamp: Date.now() - 900000,
    },
    {
      id: 4, coin: 'DOGE', direction: 'SHORT', confidence: 55, risk: 'HIGH',
      reason: 'Meme coin weakness with declining social sentiment',
      evidence: ['Reddit sentiment dropping', 'Whale outflow detected', 'Funding rate elevated'],
      model: 'gemini-2.0-flash', timestamp: Date.now() - 1200000,
    },
  ];

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-500 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-500">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-neon-purple" />
          <h2 className="text-sm font-bold text-white">AI Trading Signals</h2>
          {loading && <Loader2 size={14} className="text-neon-blue animate-spin" />}
        </div>
        <span className="text-[10px] text-gray-500">{defaultSignals.length} active signals</span>
      </div>
      <div className="divide-y divide-dark-700/50 max-h-80 overflow-y-auto">
        {defaultSignals.map((s, i) => (
          <div key={s.id || i} className="px-4 py-3 hover:bg-dark-700/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-white">{s.coin}</span>
                <span className={`flex items-center gap-0.5 text-xs font-mono font-bold ${
                  s.direction === 'LONG' ? 'text-neon-green' : 'text-neon-red'
                }`}>
                  {s.direction === 'LONG' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {s.direction}
                </span>
                <RiskBadge level={s.risk} />
              </div>
              <ConfidenceBar value={s.confidence} />
            </div>
            <p className="text-xs text-gray-300 mb-2">{s.reason}</p>
            <div className="flex flex-wrap gap-1 mb-1.5">
              {(s.evidence || []).map((e, j) => (
                <span key={j} className="text-[10px] bg-dark-600 text-gray-400 px-2 py-0.5 rounded">
                  {e}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-gray-600 flex items-center gap-1">
                <Shield size={8} />
                {s.model}
              </span>
              <span className="text-[9px] text-gray-600">
                {new Date(s.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
