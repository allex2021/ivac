import React from 'react';
import { ArrowUpRight, ArrowDownRight, Zap, Clock } from 'lucide-react';

function PutCallGauge({ flows }) {
  const calls = (flows || []).filter(f => f.type === 'CALL').length;
  const puts = (flows || []).filter(f => f.type === 'PUT').length;
  const total = calls + puts || 1;
  const ratio = (calls / (puts || 1)).toFixed(2);
  const callPct = ((calls / total) * 100).toFixed(0);

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-500">P/C Ratio</span>
      <div className="w-24 h-2 bg-dark-600 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full transition-all duration-500"
          style={{ width: `${callPct}%` }}
        />
      </div>
      <span className="text-xs font-mono text-white">{ratio}</span>
    </div>
  );
}

export default function OptionsFlow({ flows }) {
  const unusualFlows = (flows || []).filter(f => f.unusual);

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-500 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-500">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-neon-yellow" />
          <h2 className="text-sm font-bold text-white">Options Flow</h2>
          {unusualFlows.length > 0 && (
            <span className="text-[10px] bg-neon-yellow/20 text-neon-yellow px-2 py-0.5 rounded-full animate-pulse">
              {unusualFlows.length} unusual
            </span>
          )}
        </div>
        <PutCallGauge flows={flows} />
      </div>
      <div className="max-h-64 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-dark-800">
            <tr className="text-gray-500 border-b border-dark-600">
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Strike</th>
              <th className="px-3 py-2 text-left">Expiry</th>
              <th className="px-3 py-2 text-left">Size</th>
              <th className="px-3 py-2 text-left">Premium</th>
              <th className="px-3 py-2 text-left">Signal</th>
            </tr>
          </thead>
          <tbody>
            {(flows || []).map((f, i) => (
              <tr
                key={f.id || i}
                className={`border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors ${
                  f.unusual ? 'bg-neon-yellow/5' : ''
                }`}
              >
                <td className="px-3 py-2">
                  <span className={`flex items-center gap-1 font-mono font-bold ${
                    f.type === 'CALL' ? 'text-neon-green' : 'text-neon-red'
                  }`}>
                    {f.type === 'CALL' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {f.type}
                  </span>
                </td>
                <td className="px-3 py-2 font-mono text-white">${f.strike?.toLocaleString()}</td>
                <td className="px-3 py-2 font-mono text-gray-400 flex items-center gap-1">
                  <Clock size={9} />
                  {f.expiry}
                </td>
                <td className="px-3 py-2 font-mono text-white">{f.size}</td>
                <td className="px-3 py-2 font-mono text-neon-cyan">{f.notional}</td>
                <td className="px-3 py-2">
                  {f.unusual ? (
                    <span className="text-neon-yellow font-bold flex items-center gap-1">
                      <Zap size={10} /> UNUSUAL
                    </span>
                  ) : (
                    <span className={f.sentiment === 'BULLISH' ? 'text-neon-green' : 'text-neon-red'}>
                      {f.sentiment}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
