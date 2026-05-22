import React, { useState } from 'react';
import { Newspaper, TrendingUp, TrendingDown, Minus, Loader2, ExternalLink } from 'lucide-react';

function SentimentBadge({ verdict }) {
  if (!verdict) return <span className="text-gray-500 text-[10px]">—</span>;
  const v = verdict.toUpperCase();
  if (v.includes('BULL')) return <span className="text-neon-green flex items-center gap-0.5"><TrendingUp size={10} /> Bullish</span>;
  if (v.includes('BEAR')) return <span className="text-neon-red flex items-center gap-0.5"><TrendingDown size={10} /> Bearish</span>;
  return <span className="text-gray-400 flex items-center gap-0.5"><Minus size={10} /> Neutral</span>;
}

function ImpactScore({ score }) {
  if (!score) return <span className="text-gray-600">—</span>;
  const s = parseInt(score);
  let color = 'text-gray-400';
  if (s >= 8) color = 'text-neon-red';
  else if (s >= 6) color = 'text-neon-yellow';
  else if (s >= 4) color = 'text-neon-blue';

  return (
    <div className="flex items-center gap-1">
      <span className={`font-mono font-bold ${color}`}>{s}</span>
      <div className="w-12 h-1.5 bg-dark-600 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            s >= 8 ? 'bg-neon-red' : s >= 6 ? 'bg-neon-yellow' : 'bg-neon-blue'
          }`}
          style={{ width: `${s * 10}%` }}
        />
      </div>
    </div>
  );
}

export default function NewsAnalysis({ news, onAnalyze }) {
  const [analyses, setAnalyses] = useState({});
  const [loading, setLoading] = useState({});

  const handleAnalyze = async (item) => {
    const key = item.title || item.id;
    if (analyses[key] || loading[key]) return;
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      const result = await onAnalyze(item.title);
      if (result) {
        try {
          const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const parsed = JSON.parse(cleaned);
          setAnalyses(prev => ({ ...prev, [key]: parsed }));
        } catch {
          setAnalyses(prev => ({ ...prev, [key]: { score: 5, verdict: 'NEUTRAL', impact: result } }));
        }
      }
    } catch (e) {
      console.warn('Analysis failed:', e);
    }
    setLoading(prev => ({ ...prev, [key]: false }));
  };

  const items = news || [];
  const fallbackNews = items.length === 0 ? [
    { title: 'Bitcoin approaches new all-time high amid institutional buying', source: { title: 'CoinDesk' }, published_at: new Date().toISOString() },
    { title: 'Ethereum ETF sees record inflows for third consecutive week', source: { title: 'Bloomberg' }, published_at: new Date().toISOString() },
    { title: 'Major whale moves $500M in BTC to cold storage', source: { title: 'WhaleAlert' }, published_at: new Date().toISOString() },
    { title: 'Solana DeFi TVL surges past $10B milestone', source: { title: 'DeFiLlama' }, published_at: new Date().toISOString() },
    { title: 'Fed signals potential rate cuts in upcoming meeting', source: { title: 'Reuters' }, published_at: new Date().toISOString() },
  ] : items;

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-500 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-500">
        <div className="flex items-center gap-2">
          <Newspaper size={16} className="text-neon-cyan" />
          <h2 className="text-sm font-bold text-white">News & AI Analysis</h2>
        </div>
        <span className="text-[10px] text-gray-500">{fallbackNews.length} stories</span>
      </div>
      <div className="max-h-80 overflow-y-auto divide-y divide-dark-700/50">
        {fallbackNews.slice(0, 10).map((item, i) => {
          const key = item.title || item.id || i;
          const analysis = analyses[key];
          return (
            <div key={i} className="px-4 py-3 hover:bg-dark-700/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white font-medium leading-snug truncate">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-500">{item.source?.title || 'Unknown'}</span>
                    <span className="text-[10px] text-gray-600">•</span>
                    <span className="text-[10px] text-gray-600">
                      {item.published_at ? new Date(item.published_at).toLocaleTimeString() : 'now'}
                    </span>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-neon-blue">
                        <ExternalLink size={9} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {analysis ? (
                    <>
                      <ImpactScore score={analysis.score} />
                      <SentimentBadge verdict={analysis.verdict} />
                    </>
                  ) : (
                    <button
                      onClick={() => handleAnalyze(item)}
                      disabled={loading[key]}
                      className="px-2 py-1 text-[10px] bg-neon-cyan/20 text-neon-cyan rounded hover:bg-neon-cyan/30 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      {loading[key] ? <Loader2 size={10} className="animate-spin" /> : null}
                      AI Score
                    </button>
                  )}
                </div>
              </div>
              {analysis?.impact && (
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                  {analysis.impact}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
