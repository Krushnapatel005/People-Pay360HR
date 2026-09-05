'use client';
import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:   'bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white shadow-brand-sm focus:ring-brand-500',
  secondary: 'bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 border border-slate-700 focus:ring-slate-500',
  ghost:     'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 focus:ring-slate-500',
  danger:    'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-sm shadow-red-600/30 focus:ring-red-500',
  outline:   'bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white focus:ring-slate-500',
};

const SIZES: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1   text-xs  gap-1  rounded-md',
  sm: 'px-3   py-1.5 text-xs  gap-1.5 rounded-lg',
  md: 'px-4   py-2   text-sm  gap-2  rounded-lg',
  lg: 'px-5   py-2.5 text-sm  gap-2  rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'sm',
  loading = false,
  icon,
  iconRight,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';
  const cls = `${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  return (
    <button className={cls} disabled={disabled || loading} {...props}>
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}
