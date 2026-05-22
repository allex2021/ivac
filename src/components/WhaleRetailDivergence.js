import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

export default function WhaleRetailDivergence() {
  const coins = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'DOGE', 'AVAX', 'LINK'];
  const data = coins.map(coin => {
    const whaleLong = Math.random() * 80 + 10;
    const retailLong = Math.random() * 80 + 10;
    const divergence = Math.abs(whaleLong - retailLong);
    return {
      coin,
      whaleLong: parseFloat(whaleLong.toFixed(1)),
      retailLong: parseFloat(retailLong.toFixed(1)),
      whaleShort: parseFloat((100 - whaleLong).toFixed(1)),
      retailShort: parseFloat((100 - retailLong).toFixed(1)),
      divergence: parseFloat(divergence.toFixed(1)),
      isDiverging: divergence > 30,
      whaleDirection: whaleLong > 50 ? 'LONG' : 'SHORT',
      retailDirection: retailLong > 50 ? 'LONG' : 'SHORT',
    };
  });

  const majorDivergences = data.filter(d => d.isDiverging);
  const historicalAccuracy = 73.5;

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-500 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-500">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-neon-blue" />
          <h2 className="text-sm font-bold text-white">Whale vs Retail Divergence</h2>
          {majorDivergences.length > 0 && (
            <span className="text-[10px] bg-neon-yellow/20 text-neon-yellow px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertTriangle size={9} />
              {majorDivergences.length} divergences
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500">Historical Accuracy:</span>
          <span className="text-xs font-mono text-neon-green font-bold">{historicalAccuracy}%</span>
        </div>
      </div>
      <div className="px-4 py-2">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis dataKey="coin" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#666', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#14141f', border: '1px solid #222233', borderRadius: 8, fontSize: 11 }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="whaleLong" name="Whale Long %" fill="#00aaff" radius={[2, 2, 0, 0]} />
            <Bar dataKey="retailLong" name="Retail Long %" fill="#aa55ff" radius={[2, 2, 0, 0]} opacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {majorDivergences.length > 0 && (
        <div className="px-4 pb-3 space-y-1">
          <div className="text-[10px] text-gray-500 uppercase mb-1">Divergence Alerts</div>
          {majorDivergences.map((d, i) => (
            <div key={i} className="flex items-center justify-between px-2 py-1.5 bg-dark-700 rounded text-xs">
              <span className="font-mono text-white font-bold">{d.coin}</span>
              <div className="flex items-center gap-2">
                <span className="text-neon-blue flex items-center gap-0.5">
                  {d.whaleDirection === 'LONG' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  Whales: {d.whaleDirection}
                </span>
                <span className="text-neon-purple flex items-center gap-0.5">
                  {d.retailDirection === 'LONG' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  Retail: {d.retailDirection}
                </span>
              </div>
              <span className="text-neon-yellow font-mono">{d.divergence}% div</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
