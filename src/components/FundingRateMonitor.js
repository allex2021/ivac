import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Gauge, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

function FundingTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-xs">
      <p className="text-white font-mono font-bold">{d.symbol}</p>
      <p className={parseFloat(d.rate) > 0 ? 'text-neon-green' : 'text-neon-red'}>
        Rate: {d.rate}%
      </p>
      <p className="text-gray-400">Direction: {d.direction}</p>
      <p className="text-neon-yellow">Squeeze Prob: {d.squeezeProbability}%</p>
    </div>
  );
}

export default function FundingRateMonitor({ fundingRates }) {
  const processed = (fundingRates || []).map(r => ({
    symbol: r.symbol?.replace('USDT', '') || 'UNKNOWN',
    rate: parseFloat((parseFloat(r.lastFundingRate || 0) * 100).toFixed(4)),
    direction: parseFloat(r.lastFundingRate || 0) > 0 ? 'LONG-heavy' : 'SHORT-heavy',
    isAnomaly: Math.abs(parseFloat(r.lastFundingRate || 0)) > 0.001,
    squeezeProbability: Math.min(Math.abs(parseFloat(r.lastFundingRate || 0)) * 5000, 95).toFixed(0),
    markPrice: parseFloat(r.markPrice || 0),
  }));

  const anomalies = processed.filter(r => r.isAnomaly);

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-500 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-500">
        <div className="flex items-center gap-2">
          <Gauge size={16} className="text-neon-cyan" />
          <h2 className="text-sm font-bold text-white">Funding Rate Monitor</h2>
          {anomalies.length > 0 && (
            <span className="text-[10px] bg-neon-red/20 text-neon-red px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertTriangle size={9} />
              {anomalies.length} anomalies
            </span>
          )}
        </div>
      </div>
      <div className="px-4 py-2">
        {processed.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={processed} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <XAxis dataKey="symbol" tick={{ fill: '#888', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#666', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<FundingTooltip />} />
              <ReferenceLine y={0} stroke="#333" />
              <Bar dataKey="rate" radius={[3, 3, 0, 0]}>
                {processed.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.isAnomaly
                      ? (entry.rate > 0 ? '#ff3366' : '#00ff88')
                      : (entry.rate > 0 ? 'rgba(0, 255, 136, 0.4)' : 'rgba(255, 51, 102, 0.4)')
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-44 flex items-center justify-center text-gray-500 text-xs">
            Loading funding rates...
          </div>
        )}
      </div>
      {anomalies.length > 0 && (
        <div className="px-4 pb-3">
          <div className="text-[10px] text-gray-500 mb-1 uppercase">Anomaly Alerts</div>
          <div className="space-y-1">
            {anomalies.map((a, i) => (
              <div key={i} className="flex items-center justify-between px-2 py-1 bg-dark-700 rounded text-xs">
                <span className="font-mono text-white flex items-center gap-1">
                  {a.rate > 0 ? <TrendingUp size={10} className="text-neon-green" /> : <TrendingDown size={10} className="text-neon-red" />}
                  {a.symbol}
                </span>
                <span className={`font-mono ${a.rate > 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                  {a.rate > 0 ? '+' : ''}{a.rate}%
                </span>
                <span className="text-neon-yellow font-mono">Squeeze: {a.squeezeProbability}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
