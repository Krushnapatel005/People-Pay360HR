import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({ icon: Icon, title, description, action, size = 'md' }: EmptyStateProps) {
  const sizeMap = {
    sm: { wrap: 'py-8', icon: 'w-8 h-8', iconWrap: 'w-12 h-12', title: 'text-sm', desc: 'text-xs' },
    md: { wrap: 'py-14', icon: 'w-9 h-9', iconWrap: 'w-16 h-16', title: 'text-base', desc: 'text-sm' },
    lg: { wrap: 'py-20', icon: 'w-10 h-10', iconWrap: 'w-20 h-20', title: 'text-lg', desc: 'text-sm' },
  };
  const s = sizeMap[size];

  return (
    <div className={`flex flex-col items-center justify-center ${s.wrap} px-4 text-center`}>
      <div className={`${s.iconWrap} rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mb-4`}>
        <Icon className={`${s.icon} text-slate-500`} />
      </div>
      <p className={`${s.title} font-semibold text-slate-300 mb-1.5`}>{title}</p>
      {description && (
        <p className={`${s.desc} text-slate-500 max-w-xs`}>{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
