import React from 'react';
import { GitMerge, ArrowUpRight, ArrowDownRight, Signal } from 'lucide-react';

function SignalStrength({ strength }) {
  const bars = 5;
  const active = Math.ceil(strength * bars);
  return (
    <div className="flex items-end gap-0.5 h-3">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-sm transition-all ${
            i < active
              ? strength > 0.7 ? 'bg-neon-green' : strength > 0.4 ? 'bg-neon-yellow' : 'bg-neon-red'
              : 'bg-dark-600'
          }`}
          style={{ height: `${((i + 1) / bars) * 100}%` }}
        />
      ))}
    </div>
  );
}

export default function CrossExchangeSignal({ binancePrices, bybitData }) {
  const signals = [
    { coin: 'BTC', binance: 'Bullish', bybit: 'Bullish', hyperliquid: 'Bullish', convergence: 0.95, direction: 'LONG' },
    { coin: 'ETH', binance: 'Bullish', bybit: 'Neutral', hyperliquid: 'Bullish', convergence: 0.72, direction: 'LONG' },
    { coin: 'SOL', binance: 'Bearish', bybit: 'Bearish', hyperliquid: 'Neutral', convergence: 0.68, direction: 'SHORT' },
    { coin: 'BNB', binance: 'Neutral', bybit: 'Bullish', hyperliquid: 'Neutral', convergence: 0.45, direction: 'NEUTRAL' },
    { coin: 'XRP', binance: 'Bullish', bybit: 'Bullish', hyperliquid: 'Bullish', convergence: 0.88, direction: 'LONG' },
    { coin: 'DOGE', binance: 'Bearish', bybit: 'Neutral', hyperliquid: 'Bearish', convergence: 0.61, direction: 'SHORT' },
  ];

  const getColor = (signal) => {
    if (signal === 'Bullish') return 'text-neon-green';
    if (signal === 'Bearish') return 'text-neon-red';
    return 'text-gray-400';
  };

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-500 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-500">
        <div className="flex items-center gap-2">
          <GitMerge size={16} className="text-neon-purple" />
          <h2 className="text-sm font-bold text-white">Cross-Exchange Signals</h2>
        </div>
        <div className="flex items-center gap-1">
          <Signal size={12} className="text-neon-green" />
          <span className="text-[10px] text-gray-500">3 exchanges</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500 border-b border-dark-600">
              <th className="px-3 py-2 text-left">Coin</th>
              <th className="px-3 py-2 text-left">Binance</th>
              <th className="px-3 py-2 text-left">Bybit</th>
              <th className="px-3 py-2 text-left">Hyperliquid</th>
              <th className="px-3 py-2 text-left">Convergence</th>
              <th className="px-3 py-2 text-left">Signal</th>
              <th className="px-3 py-2 text-left">Strength</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((s, i) => (
              <tr key={i} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                <td className="px-3 py-2 font-mono font-bold text-white">{s.coin}</td>
                <td className={`px-3 py-2 font-mono ${getColor(s.binance)}`}>{s.binance}</td>
                <td className={`px-3 py-2 font-mono ${getColor(s.bybit)}`}>{s.bybit}</td>
                <td className={`px-3 py-2 font-mono ${getColor(s.hyperliquid)}`}>{s.hyperliquid}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1.5 bg-dark-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          s.convergence > 0.8 ? 'bg-neon-green' : s.convergence > 0.5 ? 'bg-neon-yellow' : 'bg-neon-red'
                        }`}
                        style={{ width: `${s.convergence * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-gray-400">{(s.convergence * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <span className={`flex items-center gap-0.5 font-mono font-bold ${
                    s.direction === 'LONG' ? 'text-neon-green' : s.direction === 'SHORT' ? 'text-neon-red' : 'text-gray-400'
                  }`}>
                    {s.direction === 'LONG' ? <ArrowUpRight size={10} /> : s.direction === 'SHORT' ? <ArrowDownRight size={10} /> : null}
                    {s.direction}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <SignalStrength strength={s.convergence} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
