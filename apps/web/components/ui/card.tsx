'use client';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPad?: boolean;
}

export function Card({ children, className = '', noPad = false }: CardProps) {
  return (
    <div className={`
      bg-surface-card dark:bg-slate-900 border border-surface-border dark:border-slate-800
      rounded-2xl shadow-sm overflow-hidden
      ${className}
    `}>
      {noPad ? children : <div className="p-5 sm:p-6">{children}</div>}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`
      flex items-center justify-between
      px-5 sm:px-6 py-4
      border-b border-surface-border dark:border-slate-800
      bg-surface-cardHeader/60 dark:bg-slate-800/30
      ${className}
    `}>
      <div className="flex-1 min-w-0">{children}</div>
      {action && <div className="shrink-0 ml-4">{action}</div>}
    </div>
  );
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-sm font-semibold text-white ${className}`}>{children}</h3>;
}

export function CardDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-slate-400 mt-0.5">{children}</p>;
}

export function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-5 sm:p-6 ${className}`}>{children}</div>;
}

// Stat card (dashboard widgets)
interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue';
}

const STAT_COLORS = {
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', ring: 'ring-indigo-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'ring-emerald-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'ring-amber-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', ring: 'ring-rose-500/20' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', ring: 'ring-blue-500/20' },
};

export function StatCard({ label, value, delta, deltaType = 'neutral', icon, color = 'indigo' }: StatCardProps) {
  const colors = STAT_COLORS[color];
  return (
    <div className="
      bg-surface-card dark:bg-slate-900/80 border border-surface-border dark:border-slate-800
      rounded-2xl p-5 hover:border-slate-700 transition-colors duration-200
      group cursor-default
    ">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-2xl font-bold text-white tracking-tight">{value}</p>
          {delta && (
            <p className={`mt-1 text-xs font-medium ${
              deltaType === 'up' ? 'text-emerald-400' :
              deltaType === 'down' ? 'text-rose-400' :
              'text-slate-400'
            }`}>
              {deltaType === 'up' ? '↑' : deltaType === 'down' ? '↓' : '→'} {delta}
            </p>
          )}
        </div>
        {icon && (
          <div className={`w-9 h-9 rounded-xl ${colors.bg} ring-1 ${colors.ring} flex items-center justify-center ${colors.text}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
