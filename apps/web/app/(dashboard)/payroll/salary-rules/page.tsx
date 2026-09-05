'use client';
import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { Breadcrumbs } from '../../../../components/layout/breadcrumbs';
import { MOCK_SALARY_RULES } from '../../../../lib/mock-data';
import { capitalize } from '../../../../lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  basic:     'bg-brand-500/10 text-brand-300 border-brand-500/20',
  allowance: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  deduction: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  tax:       'bg-amber-500/10 text-amber-300 border-amber-500/20',
  net:       'bg-violet-500/10 text-violet-300 border-violet-500/20',
};

export default function SalaryRulesPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Salary Rules</h1>
          <p className="mt-1 text-xs text-slate-400">Configure individual salary computation rules</p>
        </div>
        <Link href="/payroll/salary-rules/new" className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-brand-sm transition-all">
          <Plus className="w-3.5 h-3.5" /> New Rule
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/30">
              <th className="py-3 px-4 font-semibold text-slate-300">Rule</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Code</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Category</th>
              <th className="py-3 px-4 font-semibold text-slate-300 hidden md:table-cell">Amount Type</th>
              <th className="py-3 px-4 font-semibold text-slate-300 hidden lg:table-cell">Amount</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Sequence</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {MOCK_SALARY_RULES.map((rule) => (
              <tr key={rule.id} className="hover:bg-slate-800/40 transition-colors cursor-pointer" onClick={() => window.location.href = `/payroll/salary-rules/${rule.id}`}>
                <td className="py-3.5 px-4 font-medium text-white">{rule.name}</td>
                <td className="py-3.5 px-4 font-mono text-brand-400 text-[11px]">{rule.code}</td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${CATEGORY_COLORS[rule.category] ?? ''}`}>
                    {capitalize(rule.category)}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-400 hidden md:table-cell capitalize">{rule.amountSelect}</td>
                <td className="py-3.5 px-4 text-slate-300 hidden lg:table-cell">
                  {rule.amountSelect === 'fix' ? `₹${rule.amountFix?.toLocaleString()}` :
                   rule.amountSelect === 'percentage' ? `${rule.amountPercentage}% of ${rule.amountPercentageBase}` :
                   <span className="text-slate-500 italic text-[11px]">Python compute</span>}
                </td>
                <td className="py-3.5 px-4 text-slate-400">{rule.sequence}</td>
                <td className="py-3.5 px-4"><Badge status={rule.isActive ? 'active' : 'inactive'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
