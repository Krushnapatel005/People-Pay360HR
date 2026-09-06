'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { ArrowLeft, Users, AlertTriangle, CheckCircle, Banknote } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { Tabs } from '../../../../components/ui/tabs';
import { Breadcrumbs } from '../../../../components/layout/breadcrumbs';
import { formatDate, formatCurrency } from '../../../../lib/utils';
import { useQuery } from '@tanstack/react-query';
import { payrollApi } from '../../../../lib/payroll-api';

const DETAIL_TABS = [
  { id: 'summary',    label: 'Summary' },
  { id: 'employees', label: 'Employee Results' },
  { id: 'exceptions',label: 'Exceptions' },
];

export default function PayrunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('summary');
  
  const { data: payrun, isLoading } = useQuery({
    queryKey: ['payrun', id],
    queryFn: () => payrollApi.getPayrunById(id),
  });

  const exceptions = payrun?.employees?.filter((e: any) => e.status !== 'ok') || [];

  if (isLoading) return <div className="py-16 text-center text-slate-400 text-sm">Loading payrun details...</div>;
  if (!payrun) return <div className="py-16 text-center text-rose-400 text-sm">Payrun not found</div>;

  return (
    <div className="space-y-5 animate-fade-in max-w-5xl">
      <Breadcrumbs />
      <Link href="/payroll" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-200 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Payruns
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{payrun.name}</h1>
          <p className="mt-1 text-xs text-slate-400 font-mono">{payrun.ref} · {formatDate(payrun.dateFrom)} – {formatDate(payrun.dateTo)}</p>
        </div>
        <Badge status={payrun.status} />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Gross', value: formatCurrency(payrun.totalGross), color: 'text-white' },
          { label: 'Total Net', value: formatCurrency(payrun.totalNet), color: 'text-emerald-400' },
          { label: 'Deductions', value: formatCurrency(payrun.totalDeductions), color: 'text-rose-400' },
          { label: 'Exceptions', value: payrun.exceptionCount, color: payrun.exceptionCount > 0 ? 'text-amber-400' : 'text-slate-400' },
        ].map((s) => (
          <div key={s.label} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="border-b border-slate-800 px-2">
          <Tabs tabs={DETAIL_TABS.map(t => ({ ...t, count: t.id === 'exceptions' ? exceptions.length : undefined }))} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="p-5 animate-slide-up">
          {/* Summary tab */}
          {activeTab === 'summary' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {[
                { label: 'Payrun Name', value: payrun.name },
                { label: 'Reference', value: payrun.ref },
                { label: 'Period', value: `${formatDate(payrun.dateFrom)} – ${formatDate(payrun.dateTo)}` },
                { label: 'Status', value: payrun.status },
                { label: 'Salary Structure', value: payrun.salaryStructureName },
                { label: 'Total Employees', value: payrun.employees.length || 'Not computed' },
                { label: 'Computed At', value: payrun.computedAt ? formatDate(payrun.computedAt) : '—' },
                { label: 'Validated At', value: payrun.validatedAt ? formatDate(payrun.validatedAt) : '—' },
                { label: 'Paid At', value: payrun.paidAt ? formatDate(payrun.paidAt) : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
                  <span className="text-xs text-slate-200">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Employee Results */}
          {activeTab === 'employees' && (
            <div className="overflow-x-auto">
              {payrun.employees.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">Payrun not yet computed</div>
              ) : (
                <table className="w-full text-xs">
                  <thead className="border-b border-slate-800">
                    <tr>
                      <th className="pb-3 px-2 text-left font-semibold text-slate-300">Employee</th>
                      <th className="pb-3 px-2 text-left font-semibold text-slate-300 hidden md:table-cell">Dept</th>
                      <th className="pb-3 px-2 text-right font-semibold text-slate-300">Basic</th>
                      <th className="pb-3 px-2 text-right font-semibold text-slate-300">Gross</th>
                      <th className="pb-3 px-2 text-right font-semibold text-slate-300">Deductions</th>
                      <th className="pb-3 px-2 text-right font-semibold text-slate-300">Net</th>
                      <th className="pb-3 px-2 text-center font-semibold text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {payrun.employees.map((emp: any) => (
                      <tr key={emp.employeeId} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-2 font-medium text-white">{emp.employeeName}</td>
                        <td className="py-3 px-2 text-slate-500 hidden md:table-cell">{emp.department}</td>
                        <td className="py-3 px-2 text-right text-slate-400">{formatCurrency(emp.basicWage)}</td>
                        <td className="py-3 px-2 text-right text-slate-300">{formatCurrency(emp.grossWage)}</td>
                        <td className="py-3 px-2 text-right text-rose-400">{formatCurrency(emp.totalDeductions)}</td>
                        <td className="py-3 px-2 text-right font-bold text-emerald-400">{formatCurrency(emp.netWage)}</td>
                        <td className="py-3 px-2 text-center">
                          {emp.status === 'ok' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mx-auto" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Exceptions */}
          {activeTab === 'exceptions' && (
            <div>
              {exceptions.length === 0 ? (
                <div className="py-12 text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">No exceptions — all payslips computed successfully</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exceptions.map((e: any) => (
                    <div key={e.employeeId} className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-white">{e.employeeName}</p>
                        <p className="text-[11px] text-amber-300 mt-0.5">{e.errorMessage ?? 'Unknown error'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
