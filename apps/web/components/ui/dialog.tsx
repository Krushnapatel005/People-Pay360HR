'use client';
import React from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const SIZES = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-5xl',
};

export function Dialog({ open, onClose, title, description, children, size = 'md', className = '' }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div className={`
        relative z-10 w-full ${SIZES[size]}
        bg-surface-card dark:bg-slate-900 border border-surface-border dark:border-slate-800
        rounded-2xl shadow-card animate-scale-in overflow-hidden
        ${className}
      `}>
        {(title || description) && (
          <div className="flex items-start justify-between px-6 py-5 border-b border-slate-800">
            <div>
              {title && <h2 className="text-base font-semibold text-white">{title}</h2>}
              {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="ml-4 shrink-0 p-1.5 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogFooter({ children, className = '' }: DialogFooterProps) {
  return (
    <div className={`flex items-center justify-end gap-3 pt-5 border-t border-slate-800 mt-2 ${className}`}>
      {children}
    </div>
  );
}
