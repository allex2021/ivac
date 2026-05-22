import React from 'react';
import { Activity, TrendingUp, TrendingDown, DollarSign, Clock, Wifi } from 'lucide-react';

function PriceTag({ symbol, price, change }) {
  const isPositive = change >= 0;
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-lg border border-dark-500">
      <span className="text-xs text-gray-400 font-mono">{symbol}</span>
      <span className="text-sm font-bold text-white font-mono">
        ${typeof price === 'number' ? price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '--'}
      </span>
      <span className={`text-xs font-mono flex items-center gap-0.5 ${isPositive ? 'text-neon-green' : 'text-neon-red'}`}>
        {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {change ? `${isPositive ? '+' : ''}${change.toFixed(2)}%` : '--'}
      </span>
    </div>
  );
}

function FearGreedBadge({ value, label }) {
  const v = parseInt(value) || 50;
  let color = 'text-neon-yellow';
  if (v <= 25) color = 'text-neon-red';
  else if (v <= 45) color = 'text-orange-400';
  else if (v >= 75) color = 'text-neon-green';
  else if (v >= 55) color = 'text-lime-400';

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-lg border border-dark-500">
      <Activity size={14} className={color} />
      <div className="flex flex-col">
        <span className="text-[10px] text-gray-500 uppercase">Fear & Greed</span>
        <div className="flex items-center gap-1">
          <span className={`text-sm font-bold font-mono ${color}`}>{v}</span>
          <span className="text-[10px] text-gray-400">{label || 'Neutral'}</span>
        </div>
      </div>
    </div>
  );
}

export default function HeaderBar({ prices, fearGreed, marketOverview, lastUpdate }) {
  const btc = prices?.bitcoin || {};
  const eth = prices?.ethereum || {};
  const sol = prices?.solana || {};

  return (
    <header className="bg-dark-800 border-b border-dark-500 px-4 py-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-none">Whale Intelligence Pro</h1>
              <p className="text-[9px] text-gray-500">by Allex@Cyber2</p>
            </div>
          </div>
          <div className="w-px h-8 bg-dark-500 hidden md:block" />
          <div className="flex items-center gap-2 flex-wrap">
            <PriceTag symbol="BTC" price={btc.usd} change={btc.usd_24h_change} />
            <PriceTag symbol="ETH" price={eth.usd} change={eth.usd_24h_change} />
            <PriceTag symbol="SOL" price={sol.usd} change={sol.usd_24h_change} />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FearGreedBadge
            value={fearGreed?.value}
            label={fearGreed?.value_classification}
          />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-lg border border-dark-500">
            <DollarSign size={14} className="text-neon-blue" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase">Market Cap</span>
              <span className="text-sm font-bold text-white font-mono">
                ${marketOverview?.totalMarketCap
                  ? (marketOverview.totalMarketCap / 1e12).toFixed(2) + 'T'
                  : '--'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 rounded-lg border border-dark-500">
            <span className="text-[10px] text-gray-500">BTC Dom</span>
            <span className="text-sm font-bold text-neon-yellow font-mono">
              {marketOverview?.btcDominance?.toFixed(1) || '--'}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-500">
            <Wifi size={10} className="text-neon-green animate-pulse" />
            <Clock size={10} />
            <span className="font-mono">
              {lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--:--'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
