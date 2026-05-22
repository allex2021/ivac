import React from 'react';
import { Trophy, Star, Eye, EyeOff } from 'lucide-react';

export default function SmartMoneyBoard({ whales }) {
  const ranked = [...(whales || [])].sort((a, b) => b.smartScore - a.smartScore).slice(0, 10);

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-500 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-500">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-neon-yellow" />
          <h2 className="text-sm font-bold text-white">Smart Money Scoreboard</h2>
        </div>
        <span className="text-[10px] text-gray-500">Top 10 by Win Rate</span>
      </div>
      <div className="divide-y divide-dark-700/50">
        {ranked.map((w, i) => {
          const winRate = (50 + w.smartScore * 0.4 + Math.random() * 5).toFixed(1);
          const accuracy = (w.smartScore * 0.8 + Math.random() * 10).toFixed(1);
          return (
            <div key={i} className="px-4 py-2.5 flex items-center justify-between hover:bg-dark-700/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono font-bold w-5 text-center ${
                  i === 0 ? 'text-neon-yellow' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-gray-500'
                }`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-white font-medium">{w.alias}</span>
                    <span className="text-[9px] text-gray-600 bg-dark-600 px-1 rounded">{w.tag}</span>
                  </div>
                  <span className="text-[10px] text-gray-500">
                    {w.side} {w.coin} | {w.leverage}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-mono text-neon-green">{winRate}%</div>
                  <div className="text-[10px] text-gray-500">win rate</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-neon-blue">{accuracy}%</div>
                  <div className="text-[10px] text-gray-500">accuracy</div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-dark-600 rounded transition-colors" title="Watch">
                    <Star size={12} className="text-neon-yellow" />
                  </button>
                  <button className="p-1 hover:bg-dark-600 rounded transition-colors" title="Follow">
                    <Eye size={12} className="text-neon-blue" />
                  </button>
                  <button className="p-1 hover:bg-dark-600 rounded transition-colors" title="Ignore">
                    <EyeOff size={12} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
