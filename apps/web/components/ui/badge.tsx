'use client';
import React from 'react';
import { STATUS_COLORS, capitalize } from '../../lib/utils';

type BadgeVariant = 'default' | 'status';

interface BadgeProps {
  children?: React.ReactNode;
  status?: string;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, status, variant = 'default', className = '' }: BadgeProps) {
  const statusClasses = status ? (STATUS_COLORS[status] ?? 'bg-slate-500/15 text-slate-400 border-slate-500/30') : '';
  const label = children ?? (status ? capitalize(status) : '');

  const base = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border';
  const cls = status ? `${base} ${statusClasses}` : `${base} bg-slate-800 text-slate-300 border-slate-700 ${className}`;

  return <span className={cls}>{label}</span>;
}

// Dot badge (for nav indicators)
export function DotBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-brand-600 rounded-full">
      {count > 9 ? '9+' : count}
    </span>
  );
}
