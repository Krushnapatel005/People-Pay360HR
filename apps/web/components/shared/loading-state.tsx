import React from 'react';

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-slate-800/60 rounded-t-lg mb-px" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 px-4 py-3.5 border-b border-slate-800/60">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="h-3 bg-slate-800 rounded"
              style={{ width: `${[35, 20, 15, 15, 15][j] ?? 15}%`, opacity: 1 - i * 0.1 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-${Math.min(count, 4)} gap-4 animate-pulse`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800" />
            <div className="flex-1 space-y-2">
              <div className="h-2.5 bg-slate-800 rounded w-3/4" />
              <div className="h-2 bg-slate-800/60 rounded w-1/2" />
            </div>
          </div>
          <div className="h-6 bg-slate-800 rounded w-2/3" />
          <div className="h-2 bg-slate-800/40 rounded w-full" />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="h-16 bg-slate-800" />
      <div className="px-6 pb-5">
        <div className="flex items-end gap-4 -mt-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 shrink-0" />
          <div className="flex-1 pt-4 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-40" />
            <div className="h-3 bg-slate-800/60 rounded w-60" />
          </div>
        </div>
      </div>
    </div>
  );
}
