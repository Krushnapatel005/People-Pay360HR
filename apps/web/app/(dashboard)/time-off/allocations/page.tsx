'use client';
import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { Breadcrumbs } from '../../../../components/layout/breadcrumbs';
import { MOCK_LEAVE_ALLOCATIONS } from '../../../../lib/mock-data';
import { formatDate } from '../../../../lib/utils';

export default function AllocationsPage() {
  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Leave Allocations</h1>
          <p className="mt-1 text-xs text-slate-400">Assign leave entitlements to employees</p>
        </div>
        <Link href="/time-off/allocations/new" className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-brand-sm transition-all">
          <Plus className="w-3.5 h-3.5" /> New Allocation
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/30">
              <th className="py-3 px-4 font-semibold text-slate-300">Reference</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Employee</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Leave Type</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Days</th>
              <th className="py-3 px-4 font-semibold text-slate-300 hidden md:table-cell">Period</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Mode</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {MOCK_LEAVE_ALLOCATIONS.map((a) => (
              <tr key={a.id} className="hover:bg-slate-800/40 transition-colors cursor-pointer">
                <td className="py-3.5 px-4 font-mono text-brand-400 text-[11px]">{a.ref}</td>
                <td className="py-3.5 px-4 font-medium text-white">{a.employeeName}</td>
                <td className="py-3.5 px-4 text-slate-400">{a.timeOffTypeName}</td>
                <td className="py-3.5 px-4 text-white font-bold">{a.numberOfDays}</td>
                <td className="py-3.5 px-4 text-slate-400 hidden md:table-cell">{formatDate(a.dateFrom)} – {formatDate(a.dateTo)}</td>
                <td className="py-3.5 px-4 text-slate-400 capitalize">{a.allocationMode}</td>
                <td className="py-3.5 px-4"><Badge status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
