'use client';
import React, { useState } from 'react';
import { Plus, CheckCircle2, Sliders } from 'lucide-react';
import { Breadcrumbs } from '../../../../components/layout/breadcrumbs';
import { StatusBadge } from '../../../../components/ui/status-badge';
import { PermissionGate } from '../../../../components/shared/permission-gate';
import { ConfirmDialog } from '../../../../components/shared/confirm-dialog';
import { EmptyState } from '../../../../components/shared/empty-state';
import { formatDate } from '../../../../lib/utils';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timeOffApi } from '../../../../lib/time-off-api';

function BalanceAdjustPreview({ days, onChange }: { days: number; onChange: (n: number) => void }) {
  return (
    <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-500">Days</span>
        <span className="text-sm font-bold text-slate-900 dark:text-white">{days}</span>
      </div>
      <input
        type="range"
        min={1}
        max={30}
        value={days}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-500"
      />
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>1</span><span>30</span>
      </div>
    </div>
  );
}

export default function AllocationsPage() {
  const queryClient = useQueryClient();
  const [adjustTarget, setAdjustTarget] = useState<{ alloc: any; days: number } | null>(null);
  const [approveTarget, setApproveTarget] = useState<any | null>(null);

  const { data: allocations = [], isLoading } = useQuery({
    queryKey: ['time-off-allocations'],
    queryFn: timeOffApi.getAllocations,
  });

  const adjustMutation = useMutation({
    mutationFn: ({ id, days }: { id: string; days: number }) => timeOffApi.updateAllocation(id, { numberOfDays: days }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-off-allocations'] });
      setAdjustTarget(null);
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => timeOffApi.updateAllocation(id, { status: 'ACTIVE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-off-allocations'] });
      setApproveTarget(null);
    },
  });

  function handleAdjust() {
    if (!adjustTarget) return;
    adjustMutation.mutate({ id: adjustTarget.alloc.id, days: adjustTarget.days });
  }

  function handleApprove() {
    if (!approveTarget) return;
    approveMutation.mutate(approveTarget.id);
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumbs />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Leave Allocations</h1>
          <p className="mt-1 text-xs text-slate-500">Manage and adjust leave balance allocations per employee</p>
        </div>
        <PermissionGate allow={['timeoff.allocate']}>
          <button className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all">
            <Plus className="w-3.5 h-3.5" /> New Allocation
          </button>
        </PermissionGate>
      </div>

      {/* Sub-nav */}
      <div className="flex items-center gap-2">
        {[
          { label: 'Requests',    href: '/time-off' },
          { label: 'Types',       href: '/time-off/types' },
          { label: 'Allocations', href: '/time-off/allocations', active: true },
        ].map((item) => (
          <Link
            key={item.label} href={item.href}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${(item as any).active ? 'bg-brand-600/10 text-brand-300 border-brand-500/20' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800 border-transparent'}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-sm">Loading allocations...</div>
      ) : allocations.length === 0 ? (
        <EmptyState icon={Sliders} title="No allocations" description="Allocate leave days to employees to get started." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-surface-border dark:border-slate-800 bg-surface-card dark:bg-slate-900/50">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-surface-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300">Employee</th>
                <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300">Leave Type</th>
                <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300 hidden sm:table-cell">Period</th>
                <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300">Days</th>
                <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300">Status</th>
                <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border dark:divide-slate-800/80">
              {allocations.map((alloc: any) => {
                const empName = alloc.employee ? `${alloc.employee.firstName} ${alloc.employee.lastName}` : 'Unknown';
                const dept = alloc.employee?.department || '—';
                const typeName = alloc.timeOffType?.name || 'Unknown';
                return (
                <tr key={alloc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-slate-900 dark:text-white">{empName}</p>
                    <p className="text-[10px] text-slate-500">{dept}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{typeName}</td>
                  <td className="py-3.5 px-4 text-slate-400 hidden sm:table-cell">{formatDate(alloc.dateFrom)} – {formatDate(alloc.dateTo)}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{alloc.numberOfDays}</span>
                    <span className="text-slate-400"> days</span>
                  </td>
                  <td className="py-3.5 px-4"><StatusBadge status={alloc.status} /></td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <PermissionGate allow={['timeoff.allocate']} fallback={null}>
                        <button
                          onClick={() => setAdjustTarget({ alloc, days: alloc.numberOfDays })}
                          className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-brand-600/20 text-brand-400 border border-brand-500/20 hover:bg-brand-600/30 transition-colors"
                        >
                          <Sliders className="w-2.5 h-2.5" /> Adjust
                        </button>
                      </PermissionGate>
                      {alloc.status === 'DRAFT' && (
                        <PermissionGate allow={['timeoff.approve']} fallback={null}>
                          <button
                            onClick={() => setApproveTarget(alloc)}
                            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/30 transition-colors"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5" /> Approve
                          </button>
                        </PermissionGate>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Adjust dialog */}
      {adjustTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !(adjustMutation.isPending || approveMutation.isPending) && setAdjustTarget(null)} />
          <div className="relative z-10 w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 animate-scale-in">
            <h2 className="text-sm font-semibold text-white mb-1">Adjust Allocation</h2>
            <p className="text-xs text-slate-400 mb-4">
              Adjusting leave for <span className="text-white">{adjustTarget.alloc.employee ? `${adjustTarget.alloc.employee.firstName} ${adjustTarget.alloc.employee.lastName}` : 'Unknown'}</span> — {adjustTarget.alloc.timeOffType?.name || 'Unknown'}
            </p>
            <BalanceAdjustPreview
              days={adjustTarget.days}
              onChange={(n) => setAdjustTarget((prev) => prev ? { ...prev, days: n } : null)}
            />
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={() => !(adjustMutation.isPending || approveMutation.isPending) && setAdjustTarget(null)} disabled={adjustMutation.isPending || approveMutation.isPending} className="px-3 py-1.5 text-xs text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">Cancel</button>
              <button onClick={handleAdjust} disabled={adjustMutation.isPending || approveMutation.isPending} className="px-4 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors disabled:opacity-60">
                {adjustMutation.isPending || approveMutation.isPending ? 'Saving…' : 'Save Adjustment'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!approveTarget}
        onClose={() => !(adjustMutation.isPending || approveMutation.isPending) && setApproveTarget(null)}
        onConfirm={handleApprove}
        title={`Approve allocation for ${approveTarget?.employee ? approveTarget.employee.firstName : 'Unknown'}?`}
        description={`This will activate ${approveTarget?.numberOfDays} days of ${approveTarget?.timeOffType?.name} for this employee.`}
        confirmLabel="Approve Allocation"
        variant="info"
        loading={adjustMutation.isPending || approveMutation.isPending}
      />
    </div>
  );
}
