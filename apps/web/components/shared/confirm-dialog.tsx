'use client';
import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

type Variant = 'danger' | 'warning' | 'info';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
  loading?: boolean;
}

const VARIANT_MAP: Record<Variant, { icon: React.ReactNode; btn: string }> = {
  danger:  { icon: <Trash2 className="w-5 h-5 text-rose-400" />,       btn: 'bg-rose-600 hover:bg-rose-500 text-white' },
  warning: { icon: <AlertTriangle className="w-5 h-5 text-amber-400" />, btn: 'bg-amber-600 hover:bg-amber-500 text-white' },
  info:    { icon: <AlertTriangle className="w-5 h-5 text-brand-400" />, btn: 'bg-brand-600 hover:bg-brand-500 text-white' },
};

export function ConfirmDialog({
  open, onClose, onConfirm, title, description,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  variant = 'danger', loading = false,
}: ConfirmDialogProps) {
  const v = VARIANT_MAP[variant];

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
              {v.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-white">{title}</h2>
              {description && (
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{description}</p>
              )}
            </div>
            <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-300 rounded transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-6 pb-5 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors disabled:opacity-60 ${v.btn}`}
          >
            {loading ? 'Processing…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
