'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus, Play, CheckCircle2, CreditCard, AlertTriangle,
  Clock, Users, ArrowRight, Filter, RefreshCw, ChevronRight,
} from 'lucide-react';
import { StatusBadge } from '../../../components/ui/status-badge';
import { ConfirmDialog } from '../../../components/shared/confirm-dialog';
import { PermissionGate } from '../../../components/shared/permission-gate';
import { EmptyState } from '../../../components/shared/empty-state';
import { Breadcrumbs } from '../../../components/layout/breadcrumbs';
import { usePayrunState } from '../../../hooks/use-payrun-state';
import { formatDate, formatCurrency } from '../../../lib/utils';
import type { Payrun } from '../../../lib/types';

// ─── Lifecycle Progress ───────────────────────────────────────────────────────
const STEPS = ['Draft', 'Computed', 'Validated', 'Paid'];
const STEP_INDEX: Record<string, number> = { draft: 0, computed: 1, validated: 2, paid: 3, cancelled: -1 };

function LifecycleBar({ status }: { status: string }) {
  const current = STEP_INDEX[status] ?? 0;
  if (status === 'cancelled') {
    return <span className="text-[10px] text-rose-400 font-medium">Cancelled</span>;
  }
  return (
    <div className="flex items-center gap-1">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <span className={`text-[10px] font-medium ${i <= current ? 'text-brand-400' : 'text-slate-600'}`}>
            {s}
          </span>
          {i < STEPS.length - 1 && (
            <ChevronRight className={`w-2.5 h-2.5 ${i < current ? 'text-brand-500' : 'text-slate-700'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

type ConfirmAction = { type: 'compute' | 'validate' | 'paid' | 'cancel'; payrunId: string; payrunName: string } | null;

const ACTION_CONFIG = {
  compute:  { title: 'Compute Payroll',  desc: 'This will calculate salary for all employees in this payrun. Confirm?', label: 'Compute Now',  variant: 'info' as const },
  validate: { title: 'Validate Payrun',  desc: 'Once validated, the payrun is locked and cannot be edited. Proceed?',    label: 'Validate',     variant: 'warning' as const },
  paid:     { title: 'Mark as Paid',     desc: 'This confirms that salaries have been transferred and will generate payslips.', label: 'Mark as Paid', variant: 'info' as const },
  cancel:   { title: 'Cancel Payrun',    desc: 'This will permanently cancel this payrun. This action cannot be undone.',  label: 'Cancel Payrun', variant: 'danger' as const },
};

export default function PayrunsPage() {
  const { payruns, compute, validate, markPaid, cancel } = usePayrunState();
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const filtered = statusFilter === 'all'
    ? payruns
    : payruns.filter((p) => p.status === statusFilter);

  function handleConfirm() {
    if (!confirmAction) return;
    setLoading(true);
    setTimeout(() => {
      const { type, payrunId } = confirmAction;
      if (type === 'compute')  compute(payrunId);
      if (type === 'validate') validate(payrunId);
      if (type === 'paid')     markPaid(payrunId);
      if (type === 'cancel')   cancel(payrunId);
      setLoading(false);
      setConfirmAction(null);
    }, 800);
  }

  const statusCounts = {
    all:       payruns.length,
    draft:     payruns.filter((p) => p.status === 'draft').length,
    computed:  payruns.filter((p) => p.status === 'computed').length,
    validated: payruns.filter((p) => p.status === 'validated').length,
    paid:      payruns.filter((p) => p.status === 'paid').length,
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Payruns</h1>
          <p className="mt-1 text-xs text-slate-500">Manage payroll runs — Draft → Computed → Validated → Paid</p>
        </div>
        <PermissionGate allow={['payroll.compute']}>
          <Link
            href="/payroll/new"
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-brand-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            New Payrun
          </Link>
        </PermissionGate>
      </div>

      {/* Sub-nav */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { label: 'Payruns',           href: '/payroll',                    active: true },
          { label: 'Payslips',          href: '/payroll/payslips' },
          { label: 'Salary Structures', href: '/payroll/salary-structures' },
          { label: 'Salary Rules',      href: '/payroll/salary-rules' },
        ].map((item) => (
          <Link
            key={item.label} href={item.href}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${item.active ? 'bg-brand-600/10 text-brand-300 border-brand-500/20' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800 border-transparent'}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 border border-surface-border dark:border-slate-800 rounded-xl w-fit flex-wrap">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${statusFilter === status ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-surface-border dark:border-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-1.5 text-[10px] text-slate-400">{count}</span>
          </button>
        ))}
      </div>

      {/* Exceptions warning */}
      {payruns.some((p) => p.exceptionCount > 0 && p.status !== 'paid') && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-300">Payroll Exceptions Found</p>
            <p className="text-xs text-amber-400/80 mt-0.5">
              Some payruns have exceptions (missing contracts, schedules, or salary setup). Review them before computing.
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={Clock} title="No payruns found" description="Create a new payrun to get started." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-surface-border dark:border-slate-800 bg-surface-card dark:bg-slate-900/50">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-surface-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300">Reference</th>
                <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300">Period</th>
                <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300 hidden sm:table-cell">Progress</th>
                <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300 hidden md:table-cell">
                  <div className="flex items-center gap-1"><Users className="w-3 h-3" /> Employees</div>
                </th>
                <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300 hidden lg:table-cell">Gross</th>
                <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300">Net</th>
                <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300">Status</th>
                <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border dark:divide-slate-800/80">
              {filtered.map((pr: Payrun) => (
                <tr key={pr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <Link href={`/payroll/${pr.id}`} className="font-mono text-[11px] text-brand-400 hover:text-brand-300 transition-colors">
                      {pr.ref}
                    </Link>
                    {pr.exceptionCount > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span className="text-[10px] text-amber-400">{pr.exceptionCount} exception{pr.exceptionCount > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">{pr.name}</td>
                  <td className="py-3.5 px-4 hidden sm:table-cell">
                    <LifecycleBar status={pr.status} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 hidden md:table-cell">{pr.employees.length || '—'}</td>
                  <td className="py-3.5 px-4 text-slate-400 hidden lg:table-cell">{pr.totalGross > 0 ? formatCurrency(pr.totalGross) : '—'}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{pr.totalNet > 0 ? formatCurrency(pr.totalNet) : '—'}</td>
                  <td className="py-3.5 px-4"><StatusBadge status={pr.status} /></td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {pr.status === 'draft' && (
                        <PermissionGate allow={['payroll.compute']} fallback={null}>
                          <button
                            onClick={() => setConfirmAction({ type: 'compute', payrunId: pr.id, payrunName: pr.name })}
                            className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded bg-brand-600/20 text-brand-400 border border-brand-500/20 hover:bg-brand-600/30 transition-colors font-medium"
                          >
                            <Play className="w-2.5 h-2.5" /> Compute
                          </button>
                        </PermissionGate>
                      )}
                      {pr.status === 'computed' && (
                        <PermissionGate allow={['payroll.validate']} fallback={null}>
                          <button
                            onClick={() => setConfirmAction({ type: 'validate', payrunId: pr.id, payrunName: pr.name })}
                            className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded bg-violet-600/20 text-violet-400 border border-violet-500/20 hover:bg-violet-600/30 transition-colors font-medium"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5" /> Validate
                          </button>
                        </PermissionGate>
                      )}
                      {pr.status === 'validated' && (
                        <PermissionGate allow={['payroll.mark_paid']} fallback={null}>
                          <button
                            onClick={() => setConfirmAction({ type: 'paid', payrunId: pr.id, payrunName: pr.name })}
                            className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/30 transition-colors font-medium"
                          >
                            <CreditCard className="w-2.5 h-2.5" /> Mark Paid
                          </button>
                        </PermissionGate>
                      )}
                      <Link href={`/payroll/${pr.id}`} className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-0.5">
                        View <ArrowRight className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation modal */}
      {confirmAction && (
        <ConfirmDialog
          open={!!confirmAction}
          onClose={() => !loading && setConfirmAction(null)}
          onConfirm={handleConfirm}
          title={`${ACTION_CONFIG[confirmAction.type].title}: ${confirmAction.payrunName}`}
          description={ACTION_CONFIG[confirmAction.type].desc}
          confirmLabel={ACTION_CONFIG[confirmAction.type].label}
          variant={ACTION_CONFIG[confirmAction.type].variant}
          loading={loading}
        />
      )}
    </div>
  );
}
