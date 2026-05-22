import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, AlertTriangle, Filter, ChevronDown, ChevronUp, Eye } from 'lucide-react';

function SmartScoreBadge({ score }) {
  let color = 'bg-gray-700 text-gray-300';
  if (score >= 90) color = 'bg-neon-green/20 text-neon-green';
  else if (score >= 75) color = 'bg-lime-500/20 text-lime-400';
  else if (score >= 60) color = 'bg-neon-yellow/20 text-neon-yellow';
  else color = 'bg-orange-500/20 text-orange-400';

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${color}`}>
      {score}
    </span>
  );
}

export default function WhaleTracker({ whales, onAnalyze }) {
  const [sortField, setSortField] = useState('pnl');
  const [sortAsc, setSortAsc] = useState(false);
  const [filterSide, setFilterSide] = useState('ALL');

  const handleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  const filtered = (whales || [])
    .filter(w => filterSide === 'ALL' || w.side === filterSide)
    .sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      return sortAsc ? aVal - bVal : bVal - aVal;
    });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-500 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-500">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-neon-blue" />
          <h2 className="text-sm font-bold text-white">Whale Tracker</h2>
          <span className="text-xs text-gray-500 bg-dark-600 px-2 py-0.5 rounded-full">
            {filtered.length} positions
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={12} className="text-gray-500" />
          {['ALL', 'LONG', 'SHORT'].map(f => (
            <button
              key={f}
              onClick={() => setFilterSide(f)}
              className={`px-2 py-0.5 text-xs rounded font-mono transition-colors ${
                filterSide === f
                  ? 'bg-neon-blue/20 text-neon-blue'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-500 border-b border-dark-600">
              {[
                { key: 'alias', label: 'Wallet' },
                { key: 'coin', label: 'Coin' },
                { key: 'side', label: 'Side' },
                { key: 'sizeRaw', label: 'Size' },
                { key: 'leverageRaw', label: 'Lev' },
                { key: 'entryPrice', label: 'Entry' },
                { key: 'currentPrice', label: 'Current' },
                { key: 'pnl', label: 'PnL' },
                { key: 'liqPrice', label: 'Liq Price' },
                { key: 'smartScore', label: 'Score' },
              ].map(col => (
                <th
                  key={col.key}
                  className="px-3 py-2 text-left font-medium cursor-pointer hover:text-gray-300 select-none whitespace-nowrap"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon field={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-3 py-2 text-left font-medium">AI</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w, i) => {
              const isProfitable = w.pnl >= 0;
              const isLiqClose = w.liqDistance < 5;
              return (
                <tr
                  key={i}
                  className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors"
                >
                  <td className="px-3 py-2.5">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{w.alias}</span>
                      <span className="text-[10px] text-gray-600 font-mono">
                        {w.address?.slice(0, 6)}...{w.address?.slice(-4)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 font-mono font-bold text-white">{w.coin}</td>
                  <td className="px-3 py-2.5">
                    <span className={`flex items-center gap-1 font-mono font-bold ${
                      w.side === 'LONG' ? 'text-neon-green' : 'text-neon-red'
                    }`}>
                      {w.side === 'LONG' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {w.side}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-white">{w.sizeUSD}</td>
                  <td className="px-3 py-2.5 font-mono text-neon-yellow">{w.leverage}</td>
                  <td className="px-3 py-2.5 font-mono text-gray-300">
                    ${w.entryPrice?.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-white">
                    ${w.currentPrice?.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className={`font-mono font-bold ${isProfitable ? 'text-neon-green' : 'text-neon-red'}`}>
                      {isProfitable ? '+' : ''}{w.pnl?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      <span className="text-[10px] ml-1 opacity-70">
                        ({isProfitable ? '+' : ''}{w.pnlPercent}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`font-mono flex items-center gap-1 ${
                      isLiqClose ? 'text-neon-red animate-pulse' : 'text-gray-400'
                    }`}>
                      {isLiqClose && <AlertTriangle size={10} />}
                      ${w.liqPrice?.toLocaleString()}
                      <span className="text-[10px] opacity-60">({w.liqDistance}%)</span>
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <SmartScoreBadge score={w.smartScore} />
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => onAnalyze && onAnalyze(w)}
                      className="px-2 py-1 text-[10px] bg-neon-purple/20 text-neon-purple rounded hover:bg-neon-purple/30 transition-colors"
                    >
                      Analyze
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
