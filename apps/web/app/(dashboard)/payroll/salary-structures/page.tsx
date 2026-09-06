'use client';
import React from 'react';
import Link from 'next/link';
import { Plus, Code, Hash } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { Breadcrumbs } from '../../../../components/layout/breadcrumbs';
import { useQuery } from '@tanstack/react-query';
import { payrollApi } from '../../../../lib/payroll-api';

export default function SalaryStructuresPage() {
  const { data: structures = [], isLoading } = useQuery({
    queryKey: ['salary-structures'],
    queryFn: payrollApi.getSalaryStructures,
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Salary Structures</h1>
          <p className="mt-1 text-xs text-slate-400">Define salary structures and their salary rules</p>
        </div>
        <Link href="/payroll/salary-structures/new" className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-brand-sm transition-all">
          <Plus className="w-3.5 h-3.5" /> New Structure
        </Link>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-sm">Loading structures...</div>
      ) : structures.length === 0 ? (
        <div className="py-16 text-center text-slate-500 text-sm">No structures found</div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {structures.map((ss: any) => (
          <Link key={ss.id} href={`/payroll/salary-structures/${ss.id}`} className="block bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-brand-500/30 transition-all group">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <Hash className="w-4 h-4 text-brand-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">{ss.name}</h2>
                  <p className="text-[11px] text-slate-500 font-mono">{ss.code}</p>
                </div>
              </div>
              <Badge status={ss.isActive ? 'active' : 'inactive'} />
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-slate-500">Rules</span>
                <span className="text-white font-semibold">{ss.rules?.length ?? 0}</span>
              </div>
              {ss.parentName && (
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-slate-500">Parent</span>
                  <span className="text-slate-300">{ss.parentName}</span>
                </div>
              )}
              <div className="space-y-1.5 mt-3">
                {(ss.rules || []).slice(0, 4).map((rule: any) => (
                  <div key={rule.id} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-mono">{rule.code}</span>
                    <span className="text-slate-400">{rule.name}</span>
                  </div>
                ))}
                {(ss.rules?.length ?? 0) > 4 && (
                  <p className="text-[11px] text-slate-600">+{(ss.rules?.length ?? 0) - 4} more rules</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
}
