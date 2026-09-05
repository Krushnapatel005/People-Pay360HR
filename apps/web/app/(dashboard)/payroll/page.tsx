'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Play, CheckCircle, CreditCard } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Breadcrumbs } from '../../../components/layout/breadcrumbs';
import { MOCK_PAYRUNS } from '../../../lib/mock-data';
import { formatDate, formatCurrency } from '../../../lib/utils';
import { Dialog, DialogFooter } from '../../../components/ui/dialog';

export default function PayrunsPage() {
  const [computeOpen, setComputeOpen] = useState(false);
  const [validateOpen, setValidateOpen] = useState(false);
  const [paidOpen, setPaidOpen] = useState(false);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Payruns</h1>
          <p className="mt-1 text-xs text-slate-400">Manage payroll runs for all employees</p>
        </div>
        <Link href="/payroll/new" className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-brand-sm transition-all">
          <Plus className="w-3.5 h-3.5" /> New Payrun
        </Link>
      </div>

      {/* Quick nav */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { label: 'Payruns', href: '/payroll', active: true },
          { label: 'Payslips', href: '/payroll/payslips' },
          { label: 'Salary Structures', href: '/payroll/salary-structures' },
          { label: 'Salary Rules', href: '/payroll/salary-rules' },
        ].map((item) => (
          <Link key={item.label} href={item.href} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${item.active ? 'bg-brand-600/10 text-brand-300 border border-brand-500/20' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800 border border-transparent'}`}>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/30">
              <th className="py-3 px-4 font-semibold text-slate-300">Reference</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Period</th>
              <th className="py-3 px-4 font-semibold text-slate-300 hidden md:table-cell">Employees</th>
              <th className="py-3 px-4 font-semibold text-slate-300 hidden lg:table-cell">Gross</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Net</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Status</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {MOCK_PAYRUNS.map((pr) => (
              <tr key={pr.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono text-[11px] text-brand-400">
                  <Link href={`/payroll/${pr.id}`} className="hover:text-brand-300 transition-colors">{pr.ref}</Link>
                </td>
                <td className="py-3.5 px-4 font-medium text-white">{pr.name}</td>
                <td className="py-3.5 px-4 text-slate-400 hidden md:table-cell">{pr.employees.length || '—'}</td>
                <td className="py-3.5 px-4 text-slate-400 hidden lg:table-cell">{pr.totalGross > 0 ? formatCurrency(pr.totalGross) : '—'}</td>
                <td className="py-3.5 px-4 font-semibold text-white">{pr.totalNet > 0 ? formatCurrency(pr.totalNet) : '—'}</td>
                <td className="py-3.5 px-4"><Badge status={pr.status} /></td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    {pr.status === 'draft' && (
                      <button onClick={() => setComputeOpen(true)} className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded bg-brand-600/20 text-brand-400 border border-brand-500/20 hover:bg-brand-600/30 transition-colors">
                        <Play className="w-3 h-3" /> Compute
                      </button>
                    )}
                    {pr.status === 'computed' && (
                      <button onClick={() => setValidateOpen(true)} className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded bg-violet-600/20 text-violet-400 border border-violet-500/20 hover:bg-violet-600/30 transition-colors">
                        <CheckCircle className="w-3 h-3" /> Validate
                      </button>
                    )}
                    {pr.status === 'validated' && (
                      <button onClick={() => setPaidOpen(true)} className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/30 transition-colors">
                        <CreditCard className="w-3 h-3" /> Mark Paid
                      </button>
                    )}
                    <Link href={`/payroll/${pr.id}`} className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors">View</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modals */}
      <Dialog open={computeOpen} onClose={() => setComputeOpen(false)} title="Compute Payroll" description="This will calculate salary for all employees in this payrun." size="sm">
        <p className="text-sm text-slate-400 mb-4">Are you sure you want to compute the payroll? This may take a few seconds.</p>
        <DialogFooter>
          <button onClick={() => setComputeOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">Cancel</button>
          <button onClick={() => setComputeOpen(false)} className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors">Compute Now</button>
        </DialogFooter>
      </Dialog>

      <Dialog open={validateOpen} onClose={() => setValidateOpen(false)} title="Validate Payrun" description="This will lock the payrun and prevent further changes." size="sm">
        <p className="text-sm text-slate-400 mb-4">Once validated, you will not be able to edit this payrun. Proceed?</p>
        <DialogFooter>
          <button onClick={() => setValidateOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">Cancel</button>
          <button onClick={() => setValidateOpen(false)} className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors">Validate</button>
        </DialogFooter>
      </Dialog>

      <Dialog open={paidOpen} onClose={() => setPaidOpen(false)} title="Mark as Paid" description="Confirm that salaries have been transferred to employees." size="sm">
        <p className="text-sm text-slate-400 mb-4">This will mark the payrun as paid and generate payslips for all employees.</p>
        <DialogFooter>
          <button onClick={() => setPaidOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">Cancel</button>
          <button onClick={() => setPaidOpen(false)} className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors">Mark as Paid</button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
