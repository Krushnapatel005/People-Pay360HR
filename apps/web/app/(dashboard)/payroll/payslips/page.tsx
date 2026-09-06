'use client';
import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { Breadcrumbs } from '../../../../components/layout/breadcrumbs';
import { formatDate, formatCurrency } from '../../../../lib/utils';
import { useQuery } from '@tanstack/react-query';
import { payrollApi } from '../../../../lib/payroll-api';

export default function PayslipsPage() {
  const { data: payslips = [], isLoading } = useQuery({
    queryKey: ['payslips'],
    queryFn: payrollApi.getPayslips,
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Payslips</h1>
          <p className="mt-1 text-xs text-slate-400">Employee payslips and salary statements</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/30">
              <th className="py-3 px-4 font-semibold text-slate-300">Reference</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Employee</th>
              <th className="py-3 px-4 font-semibold text-slate-300 hidden md:table-cell">Period</th>
              <th className="py-3 px-4 font-semibold text-slate-300 hidden lg:table-cell">Gross</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Net</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Status</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {isLoading ? (
              <tr><td colSpan={7} className="py-12 text-center text-slate-500">Loading payslips...</td></tr>
            ) : payslips.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-slate-500">No payslips found</td></tr>
            ) : (
              payslips.map((ps: any) => (
                <tr key={ps.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-brand-400">{ps.ref}</td>
                  <td className="py-3.5 px-4 font-medium text-white">{ps.employee ? `${ps.employee.firstName} ${ps.employee.lastName}` : 'Unknown'}</td>
                  <td className="py-3.5 px-4 text-slate-400 hidden md:table-cell">{formatDate(ps.dateFrom)} – {formatDate(ps.dateTo)}</td>
                  <td className="py-3.5 px-4 text-slate-400 hidden lg:table-cell">{formatCurrency(ps.grossWage)}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">{formatCurrency(ps.netWage)}</td>
                  <td className="py-3.5 px-4"><Badge status={ps.status} /></td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/payroll/payslips/${ps.id}`} className="text-[10px] px-2.5 py-1 rounded bg-brand-600/20 text-brand-400 border border-brand-500/20 hover:bg-brand-600/30 transition-colors">View</Link>
                      <button className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors">Print</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
