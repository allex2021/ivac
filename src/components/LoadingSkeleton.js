import React from 'react';

export function CardSkeleton({ title, height = 'h-48' }) {
  return (
    <div className="bg-dark-800 rounded-xl border border-dark-500 overflow-hidden animate-pulse">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-dark-500">
        <div className="w-4 h-4 rounded bg-dark-600" />
        <div className="w-24 h-3 rounded bg-dark-600" />
      </div>
      <div className={`px-4 py-4 ${height}`}>
        <div className="space-y-3">
          <div className="h-2 bg-dark-600 rounded w-3/4" />
          <div className="h-2 bg-dark-600 rounded w-1/2" />
          <div className="h-2 bg-dark-600 rounded w-5/6" />
          <div className="h-2 bg-dark-600 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 8 }) {
  return (
    <tr className="border-b border-dark-700/50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-3 py-3">
          <div className="h-3 bg-dark-600 rounded w-16 animate-pulse" />
        </td>
      ))}
    </tr>
  );
}
