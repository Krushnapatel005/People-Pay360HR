'use client';
import React from 'react';
import { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Printer, Send, Download,
  Building2, User, Calendar, FileText,
} from 'lucide-react';
import { StatusBadge } from '../../../../../components/ui/status-badge';
import { PermissionGate } from '../../../../../components/shared/permission-gate';
import { Breadcrumbs } from '../../../../../components/layout/breadcrumbs';
import { formatDate, formatCurrency } from '../../../../../lib/utils';
import { useQuery } from '@tanstack/react-query';
import { payrollApi } from '../../../../../lib/payroll-api';

export default function PayslipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: payslip, isLoading } = useQuery({
    queryKey: ['payslip', id],
    queryFn: () => payrollApi.getPayslipById(id),
  });

  if (isLoading) return <div className="py-16 text-center text-slate-400 text-sm">Loading payslip details...</div>;
  if (!payslip) return <div className="py-16 text-center text-rose-400 text-sm">Payslip not found</div>;

  const earnings = payslip.lines?.filter((l: any) => l.category === 'BASIC_SALARY' || l.category === 'ALLOWANCE') || [];
  const deductions = payslip.lines?.filter((l: any) => l.category === 'DEDUCTION') || [];

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      <Breadcrumbs />

      {/* Back + actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap no-print">
        <Link href="/payroll/payslips" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Payslips
        </Link>
        <div className="flex items-center gap-2">
          <PermissionGate allow={['payroll.send_payslip']}>
            <button
              onClick={() => {
                if (payslip?.status === 'PAID') {
                  const btn = document.getElementById('send-btn');
                  if (btn) btn.textContent = 'Sending...';
                  payrollApi.sendPayslipEmail(id as string)
                    .then(() => {
                      if (btn) btn.textContent = 'Sent!';
                      setTimeout(() => { if (btn) btn.textContent = 'Send to Employee'; }, 2000);
                    })
                    .catch(() => {
                      if (btn) btn.textContent = 'Error';
                      setTimeout(() => { if (btn) btn.textContent = 'Send to Employee'; }, 2000);
                    });
                } else {
                  alert('Only PAID payslips can be sent.');
                }
              }}
              id="send-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Send to Employee
            </button>
          </PermissionGate>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print / PDF
          </button>
        </div>
      </div>

      {/* Payslip statement */}
      <div
        id="payslip-print-area"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg"
      >
        {/* Header band */}
        <div className="bg-gradient-to-r from-brand-700 to-brand-500 px-8 py-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold">HR</div>
                <span className="font-bold text-lg">PeoplePay360</span>
              </div>
              <p className="text-sm opacity-80">Payslip Statement</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70 font-mono">{payslip.ref}</p>
              <p className="text-lg font-bold">{formatCurrency(payslip.netWage)}</p>
              <p className="text-xs opacity-70">Net Pay</p>
              <StatusBadge status={payslip.status} />
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Employee + Period info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Employee</p>
              <div className="space-y-2">
                {[
                  { icon: <User className="w-3.5 h-3.5" />, label: 'Name', value: payslip.employeeName },
                  { icon: <Building2 className="w-3.5 h-3.5" />, label: 'Department', value: payslip.department },
                  { icon: <FileText className="w-3.5 h-3.5" />, label: 'Position', value: payslip.jobPosition },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">{icon}</span>
                    <span className="text-slate-500 w-20">{label}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Pay Period</p>
              <div className="space-y-2">
                {[
                  { icon: <Calendar className="w-3.5 h-3.5" />, label: 'From', value: formatDate(payslip.dateFrom) },
                  { icon: <Calendar className="w-3.5 h-3.5" />, label: 'To', value: formatDate(payslip.dateTo) },
                  { icon: <FileText className="w-3.5 h-3.5" />, label: 'Payrun', value: payslip.payrunRef },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">{icon}</span>
                    <span className="text-slate-500 w-20">{label}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Earnings */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Earnings</p>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="py-2.5 px-4 text-left font-semibold text-slate-500">Component</th>
                    <th className="py-2.5 px-4 text-left font-semibold text-slate-500 hidden sm:table-cell">Code</th>
                    <th className="py-2.5 px-4 text-right font-semibold text-slate-500">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {earnings.map((line: any) => (
                    <tr key={line.ruleId} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{line.ruleName}</td>
                      <td className="py-3 px-4 text-slate-400 hidden sm:table-cell font-mono">{line.ruleCode}</td>
                      <td className="py-3 px-4 text-right font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(line.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-emerald-50 dark:bg-emerald-500/5 border-t-2 border-emerald-100 dark:border-emerald-500/20">
                  <tr>
                    <td colSpan={2} className="py-3 px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Gross Earnings</td>
                    <td className="py-3 px-4 text-right text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(payslip.grossWage)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Deductions</p>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="py-2.5 px-4 text-left font-semibold text-slate-500">Component</th>
                    <th className="py-2.5 px-4 text-left font-semibold text-slate-500 hidden sm:table-cell">Code</th>
                    <th className="py-2.5 px-4 text-right font-semibold text-slate-500">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {deductions.map((line: any) => (
                    <tr key={line.ruleId} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{line.ruleName}</td>
                      <td className="py-3 px-4 text-slate-400 hidden sm:table-cell font-mono">{line.ruleCode}</td>
                      <td className="py-3 px-4 text-right font-medium text-rose-600 dark:text-rose-400">({formatCurrency(line.amount)})</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-rose-50 dark:bg-rose-500/5 border-t-2 border-rose-100 dark:border-rose-500/20">
                  <tr>
                    <td colSpan={2} className="py-3 px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Total Deductions</td>
                    <td className="py-3 px-4 text-right text-sm font-bold text-rose-600 dark:text-rose-400">({formatCurrency(payslip.totalDeductions)})</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Net pay summary */}
          <div className="bg-gradient-to-r from-brand-600/10 to-emerald-600/10 border border-brand-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Net Pay</p>
                <p className="text-xs text-slate-400 mt-0.5">After all deductions</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(payslip.netWage)}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatDate(payslip.dateFrom)} – {formatDate(payslip.dateTo)}
                </p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-[10px] text-slate-400 text-center">
            This is a computer-generated payslip. No signature is required. — PeoplePay360 HR Platform
          </p>
        </div>
      </div>
    </div>
  );
}
