import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';

function CorrelationBadge({ label, value }) {
  const absVal = Math.abs(value);
  let color = 'text-gray-400';
  if (absVal > 0.7) color = value > 0 ? 'text-neon-green' : 'text-neon-red';
  else if (absVal > 0.4) color = 'text-neon-yellow';

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-lg">
      <span className="text-[10px] text-gray-500">{label}</span>
      <span className={`text-xs font-mono font-bold ${color}`}>
        {value > 0 ? '+' : ''}{value.toFixed(2)}
      </span>
    </div>
  );
}

export default function InterMarketCorrelation() {
  const days = 30;
  const chartData = Array.from({ length: days }, (_, i) => {
    const btcBase = 95000 + Math.sin(i / 5) * 5000 + (i / days) * 8000;
    return {
      day: `D-${days - i}`,
      BTC: Math.round(btcBase + (Math.random() - 0.5) * 2000),
      DXY: parseFloat((104 - Math.sin(i / 5) * 2 + (Math.random() - 0.5)).toFixed(2)),
      'S&P500': Math.round(5200 + Math.sin(i / 7) * 200 + (i / days) * 300 + (Math.random() - 0.5) * 50),
      Gold: Math.round(2300 + Math.sin(i / 6) * 100 + (i / days) * 200 + (Math.random() - 0.5) * 30),
    };
  });

  const correlations = {
    'DXY vs BTC': -0.72,
    'S&P vs BTC': 0.65,
    'Gold vs BTC': 0.45,
  };

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-500 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-500">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-neon-blue" />
          <h2 className="text-sm font-bold text-white">Inter-Market Correlation</h2>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(correlations).map(([label, val]) => (
            <CorrelationBadge key={label} label={label} value={val} />
          ))}
        </div>
      </div>
      <div className="px-4 py-2">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis dataKey="day" tick={{ fill: '#666', fontSize: 9 }} axisLine={false} tickLine={false} interval={5} />
            <YAxis yAxisId="btc" tick={{ fill: '#00aaff', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
            <YAxis yAxisId="dxy" orientation="right" tick={{ fill: '#ff3366', fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#14141f', border: '1px solid #222233', borderRadius: 8, fontSize: 11 }}
              labelStyle={{ color: '#888' }}
            />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            <Line yAxisId="btc" type="monotone" dataKey="BTC" stroke="#00aaff" strokeWidth={2} dot={false} />
            <Line yAxisId="dxy" type="monotone" dataKey="DXY" stroke="#ff3366" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
            <Line yAxisId="btc" type="monotone" dataKey="S&P500" stroke="#00ff88" strokeWidth={1} dot={false} opacity={0.5} />
            <Line yAxisId="btc" type="monotone" dataKey="Gold" stroke="#ffcc00" strokeWidth={1} dot={false} opacity={0.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
