'use client';
import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { Breadcrumbs } from '../../../../components/layout/breadcrumbs';
import { MOCK_TIME_OFF_TYPES } from '../../../../lib/mock-data';

export default function TimeOffTypesPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Time Off Types</h1>
          <p className="mt-1 text-xs text-slate-400">Configure leave types, validation rules and allocation modes</p>
        </div>
        <Link href="/time-off/types/new" className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-brand-sm transition-all">
          <Plus className="w-3.5 h-3.5" /> New Type
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_TIME_OFF_TYPES.map((type) => (
          <div key={type.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group cursor-pointer">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800" style={{ borderLeftColor: type.color, borderLeftWidth: 3 }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: type.color + '30', border: `1px solid ${type.color}40`, color: type.color }}>
                {type.code}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-white truncate">{type.name}</h2>
                <p className="text-[11px] text-slate-500">{type.allocationMode === 'no' ? 'No allocation' : `${type.daysDuration ?? '?'} days/year`}</p>
              </div>
              <Badge status={type.isActive ? 'active' : 'inactive'} />
            </div>
            <div className="px-5 py-4 grid grid-cols-2 gap-y-2.5 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">Allocation</span>
                <span className="text-slate-300 capitalize">{type.allocationMode.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">Validation</span>
                <span className="text-slate-300 uppercase">{type.leaveValidation}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">Requires Allocation</span>
                <span className="text-slate-300">{type.requiresAllocation ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">Allow Negative</span>
                <span className="text-slate-300">{type.allowNegative ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
