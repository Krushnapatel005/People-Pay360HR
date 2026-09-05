'use client';
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: string;
  deltaType?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue' | 'violet' | 'cyan' | 'orange';
  chart?: number[]; // mini sparkline values 0–100
  onClick?: () => void;
}

const COLOR_MAP = {
  indigo:  { ring: 'ring-indigo-500/20',  iconBg: 'bg-indigo-500/10',  icon: 'text-indigo-400',  bar: 'bg-indigo-500' },
  emerald: { ring: 'ring-emerald-500/20', iconBg: 'bg-emerald-500/10', icon: 'text-emerald-400', bar: 'bg-emerald-500' },
  amber:   { ring: 'ring-amber-500/20',   iconBg: 'bg-amber-500/10',   icon: 'text-amber-400',   bar: 'bg-amber-500' },
  rose:    { ring: 'ring-rose-500/20',    iconBg: 'bg-rose-500/10',    icon: 'text-rose-400',    bar: 'bg-rose-500' },
  blue:    { ring: 'ring-blue-500/20',    iconBg: 'bg-blue-500/10',    icon: 'text-blue-400',    bar: 'bg-blue-500' },
  violet:  { ring: 'ring-violet-500/20',  iconBg: 'bg-violet-500/10',  icon: 'text-violet-400',  bar: 'bg-violet-500' },
  cyan:    { ring: 'ring-cyan-500/20',    iconBg: 'bg-cyan-500/10',    icon: 'text-cyan-400',    bar: 'bg-cyan-500' },
  orange:  { ring: 'ring-orange-500/20',  iconBg: 'bg-orange-500/10',  icon: 'text-orange-400',  bar: 'bg-orange-500' },
};

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (!values.length) return null;
  const max = Math.max(...values, 1);
  const w = 56;
  const h = 24;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DashboardWidget({
  title, value, subtitle, delta, deltaType = 'neutral',
  icon, color = 'indigo', chart, onClick,
}: DashboardWidgetProps) {
  const c = COLOR_MAP[color];

  const DeltaIcon =
    deltaType === 'up' ? TrendingUp :
    deltaType === 'down' ? TrendingDown : Minus;

  const deltaColor =
    deltaType === 'up' ? 'text-emerald-400' :
    deltaType === 'down' ? 'text-rose-400' : 'text-slate-400';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`group relative bg-surface-card dark:bg-slate-900/80 border border-surface-border dark:border-slate-800 rounded-2xl p-5 overflow-hidden transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-slate-700 hover:shadow-lg' : ''} ring-1 ring-transparent hover:${c.ring}`}
    >
      {/* Background glow */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${c.iconBg} blur-2xl opacity-40 pointer-events-none`} />

      <div className="relative flex items-start justify-between gap-3">
        {/* Icon */}
        <div className={`w-9 h-9 rounded-xl ${c.iconBg} border border-white/5 flex items-center justify-center shrink-0 ring-1 ${c.ring}`}>
          <span className={c.icon}>{icon}</span>
        </div>

        {/* Sparkline */}
        {chart && (
          <Sparkline
            values={chart}
            color={c.bar.replace('bg-', '#').replace('bg-emerald-500', '#10b981').replace('bg-indigo-500', '#6366f1').replace('bg-amber-500', '#f59e0b').replace('bg-rose-500', '#f43f5e').replace('bg-blue-500', '#3b82f6').replace('bg-violet-500', '#8b5cf6')}
          />
        )}
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
        {subtitle && <p className="mt-0.5 text-[11px] text-slate-400">{subtitle}</p>}
      </div>

      {delta && (
        <div className={`mt-3 flex items-center gap-1.5 text-[11px] ${deltaColor}`}>
          <DeltaIcon className="w-3 h-3 shrink-0" />
          <span>{delta}</span>
        </div>
      )}
    </div>
  );
}

// Grid wrapper
export function WidgetGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {children}
    </div>
  );
}
