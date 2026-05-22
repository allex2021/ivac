import React from 'react';
import { AlertTriangle, X, Bell, TrendingUp, TrendingDown, Zap } from 'lucide-react';

const ICONS = {
  whale: Bell,
  liquidation: AlertTriangle,
  funding: Zap,
  news: TrendingUp,
  signal: TrendingDown,
};

const COLORS = {
  critical: 'border-neon-red bg-neon-red/10',
  warning: 'border-neon-yellow bg-neon-yellow/10',
  info: 'border-neon-blue bg-neon-blue/10',
  success: 'border-neon-green bg-neon-green/10',
};

export default function AlertNotification({ alerts, onDismiss }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 space-y-2 max-w-sm">
      {alerts.slice(0, 5).map(alert => {
        const Icon = ICONS[alert.type] || Bell;
        const colorClass = COLORS[alert.severity] || COLORS.info;

        return (
          <div
            key={alert.id}
            className={`animate-slide-in rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm ${colorClass}`}
          >
            <div className="flex items-start gap-2">
              <Icon size={14} className="mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white">{alert.title}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{alert.message}</p>
              </div>
              <button
                onClick={() => onDismiss(alert.id)}
                className="text-gray-500 hover:text-white transition-colors shrink-0"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
