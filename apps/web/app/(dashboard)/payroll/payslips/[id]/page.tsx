'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { ArrowLeft, Printer, Mail, Download } from 'lucide-react';
import { Badge } from '../../../../../components/ui/badge';
import { Breadcrumbs } from '../../../../../components/layout/breadcrumbs';
import { MOCK_PAYSLIPS } from '../../../../../lib/mock-data';
import { formatDate, formatCurrency } from '../../../../../lib/utils';

export default function PayslipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [print, setPrint] = useState(false);
  const payslip = MOCK_PAYSLIPS.find((p) => p.id === id) ?? MOCK_PAYSLIPS[0];

  const earnings = payslip.lines.filter((l) => ['basic', 'allowance'].includes(l.category));
  const deductions = payslip.lines.filter((l) => ['deduction', 'tax'].includes(l.category));

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      <Breadcrumbs />
      <Link href="/payroll/payslips" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-200 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Payslips
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{payslip.ref}</h1>
          <p className="mt-1 text-xs text-slate-400">{payslip.employeeName} · {formatDate(payslip.dateFrom)} – {formatDate(payslip.dateTo)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
            <Mail className="w-3.5 h-3.5" /> Email
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      </div>

      {/* Payslip Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600/20 via-brand-500/10 to-transparent px-6 py-5 border-b border-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-bold text-[10px] text-white">HR</div>
                <span className="text-sm font-bold text-white">PeoplePay360</span>
              </div>
              <h2 className="text-base font-bold text-white">Payslip — {payslip.dateFrom.slice(0, 7)}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{payslip.ref}</p>
            </div>
            <Badge status={payslip.status} />
          </div>
        </div>

        {/* Employee info */}
        <div className="px-6 py-4 border-b border-slate-800 grid grid-cols-2 gap-y-3 gap-x-8 text-xs">
          {[
            { label: 'Employee', value: payslip.employeeName },
            { label: 'Department', value: payslip.department },
            { label: 'Job Position', value: payslip.jobPosition },
            { label: 'Payrun', value: payslip.payrunRef },
            { label: 'Period', value: `${formatDate(payslip.dateFrom)} – ${formatDate(payslip.dateTo)}` },
          ].map(({ label, value }) => (
            <div key={label}>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-0.5">{label}</span>
              <span className="text-slate-200">{value}</span>
            </div>
          ))}
        </div>

        {/* Earnings & Deductions */}
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Earnings */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Earnings</h3>
            <div className="space-y-2">
              {earnings.map((line) => (
                <div key={line.ruleId} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{line.ruleName}</span>
                  <span className="text-slate-200 font-medium">{formatCurrency(line.amount)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <span className="font-semibold text-slate-300">Gross Earnings</span>
                <span className="font-bold text-white">{formatCurrency(payslip.grossWage)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Deductions</h3>
            <div className="space-y-2">
              {deductions.map((line) => (
                <div key={line.ruleId} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{line.ruleName}</span>
                  <span className="text-rose-400 font-medium">({formatCurrency(Math.abs(line.amount))})</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <span className="font-semibold text-slate-300">Total Deductions</span>
                <span className="font-bold text-rose-400">({formatCurrency(payslip.totalDeductions)})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net pay */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-500/10 to-transparent border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300">Net Pay</span>
            <span className="text-2xl font-bold text-emerald-400">{formatCurrency(payslip.netWage)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
