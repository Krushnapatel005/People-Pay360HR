'use client';
import React from 'react';

interface TabsProps {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pill';
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, variant = 'underline', className = '' }: TabsProps) {
  if (variant === 'pill') {
    return (
      <div className={`inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl gap-1 ${className}`} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150
              ${activeTab === tab.id
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}
            `}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                activeTab === tab.id ? 'bg-brand-600 text-white' : 'bg-slate-700 text-slate-400'
              }`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center border-b border-slate-800 gap-0 ${className}`} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            relative flex items-center gap-1.5 px-4 py-3 text-xs font-medium transition-all duration-150
            ${activeTab === tab.id
              ? 'text-white'
              : 'text-slate-500 hover:text-slate-300'}
          `}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
              activeTab === tab.id ? 'bg-brand-600/20 text-brand-300' : 'bg-slate-800 text-slate-500'
            }`}>{tab.count}</span>
          )}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
