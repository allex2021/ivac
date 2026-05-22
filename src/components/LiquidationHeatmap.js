import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Flame, AlertTriangle } from 'lucide-react';

function HeatmapTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-dark-700 border border-dark-500 rounded-lg px-3 py-2 text-xs">
      <p className="text-white font-mono font-bold">${d.price?.toLocaleString()}</p>
      <p className="text-gray-400">{d.type} Liquidations</p>
      <p className={d.type === 'LONG' ? 'text-neon-red' : 'text-neon-green'}>
        ${(d.amount / 1e6).toFixed(1)}M at risk
      </p>
      <div className="mt-1 w-full bg-dark-600 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${d.type === 'LONG' ? 'bg-neon-red' : 'bg-neon-green'}`}
          style={{ width: `${(d.intensity * 100).toFixed(0)}%` }}
        />
      </div>
    </div>
  );
}

export default function LiquidationHeatmap({ levels, currentPrice, cascadeRisk }) {
  const risk = cascadeRisk || Math.floor(Math.random() * 60 + 20);
  const riskColor = risk > 70 ? 'text-neon-red' : risk > 40 ? 'text-neon-yellow' : 'text-neon-green';

  const chartData = (levels || []).map(l => ({
    ...l,
    displayPrice: `${(l.price / 1000).toFixed(1)}K`,
    value: l.amount / 1e6,
  }));

  const nextMajorLiq = levels?.reduce((max, l) => l.amount > (max?.amount || 0) ? l : max, null);

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-500 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-500">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-orange-400" />
          <h2 className="text-sm font-bold text-white">Liquidation Heatmap</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-500">Cascade Risk</span>
            <span className={`text-sm font-bold font-mono ${riskColor}`}>
              {risk > 70 && <AlertTriangle size={12} className="inline mr-1" />}
              {risk}%
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 py-2">
        <div className="flex items-center gap-4 mb-2 text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-neon-red" />
            <span className="text-gray-400">Long Liquidations</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-neon-green" />
            <span className="text-gray-400">Short Liquidations</span>
          </div>
          {nextMajorLiq && (
            <div className="flex items-center gap-1 ml-auto">
              <AlertTriangle size={10} className="text-neon-yellow" />
              <span className="text-neon-yellow font-mono">
                Next Major: ${nextMajorLiq.price?.toLocaleString()} (${(nextMajorLiq.amount / 1e6).toFixed(1)}M)
              </span>
            </div>
          )}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis dataKey="displayPrice" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}M`} />
            <Tooltip content={<HeatmapTooltip />} />
            {currentPrice && (
              <ReferenceLine
                x={`${(currentPrice / 1000).toFixed(1)}K`}
                stroke="#00aaff"
                strokeDasharray="3 3"
                label={{ value: 'Current', fill: '#00aaff', fontSize: 10 }}
              />
            )}
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={entry.type === 'LONG'
                    ? `rgba(255, 51, 102, ${0.3 + entry.intensity * 0.7})`
                    : `rgba(0, 255, 136, ${0.3 + entry.intensity * 0.7})`
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
