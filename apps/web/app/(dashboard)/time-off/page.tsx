'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, CheckCircle2, XCircle, Clock, Filter, Umbrella } from 'lucide-react';
import { Breadcrumbs } from '../../../components/layout/breadcrumbs';
import { StatusBadge } from '../../../components/ui/status-badge';
import { PermissionGate } from '../../../components/shared/permission-gate';
import { ConfirmDialog } from '../../../components/shared/confirm-dialog';
import { EmptyState } from '../../../components/shared/empty-state';
import { formatDate } from '../../../lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timeOffApi } from '../../../lib/time-off-api';

function BalanceBar({ used, total, color }: { used: number; total: number; color: string }) {
  const pct = Math.min((used / total) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-slate-400 shrink-0">{used}/{total}d</span>
    </div>
  );
}

export default function TimeOffPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject'; request: any } | null>(null);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['time-off-requests'],
    queryFn: timeOffApi.getRequests,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => timeOffApi.approveRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-off-requests'] });
      setConfirmAction(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => timeOffApi.rejectRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-off-requests'] });
      setConfirmAction(null);
    },
  });

  const filtered = requests.filter((r: any) => {
    const empName = r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : 'Unknown';
    const typeName = r.timeOffType?.name || 'Unknown';
    const matchSearch = empName.toLowerCase().includes(search.toLowerCase()) ||
      typeName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter.toUpperCase();
    return matchSearch && matchStatus;
  });

  const pending = requests.filter((r: any) => r.status === 'PENDING');

  function handleApproveReject() {
    if (!confirmAction) return;
    if (confirmAction.type === 'approve') {
      approveMutation.mutate(confirmAction.request.id);
    } else {
      rejectMutation.mutate(confirmAction.request.id);
    }
  }

  const statusCounts = {
    all: requests.length,
    pending: requests.filter((r: any) => r.status === 'PENDING').length,
    approved: requests.filter((r: any) => r.status === 'APPROVED').length,
    rejected: requests.filter((r: any) => r.status === 'REFUSED').length,
    cancelled: requests.filter((r: any) => r.status === 'CANCELLED').length,
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            Time Off
            {pending.length > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {pending.length} pending
              </span>
            )}
          </h1>
          <p className="mt-1 text-xs text-slate-500">Manage leave requests, balances, and approvals</p>
        </div>
        <Link
          href="/time-off/new"
          className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> New Request
        </Link>
      </div>

      {/* Sub-nav */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { label: 'Requests', href: '/time-off', active: true },
          { label: 'Types', href: '/time-off/types' },
          { label: 'Allocations', href: '/time-off/allocations' },
        ].map((item) => (
          <Link
            key={item.label} href={item.href}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${item.active ? 'bg-brand-600/10 text-brand-300 border-brand-500/20' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800 border-transparent'}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Leave Balance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { type: 'Annual Leave', used: 6, total: 20, color: 'bg-brand-500' },
          { type: 'Sick Leave',   used: 2, total: 10, color: 'bg-rose-500' },
          { type: 'Casual Leave', used: 1, total: 5,  color: 'bg-amber-500' },
        ].map((b) => (
          <div key={b.type} className="bg-surface-card dark:bg-slate-900/80 border border-surface-border dark:border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{b.type}</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{b.total - b.used} remaining</span>
            </div>
            <BalanceBar used={b.used} total={b.total} color={b.color} />
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search employees or leave type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-card dark:bg-slate-900/60 border border-surface-border dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 border border-surface-border dark:border-slate-800 rounded-xl w-fit">
          {(Object.entries(statusCounts) as [string, number][]).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${statusFilter === status ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-surface-border dark:border-slate-700' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)} <span className="text-slate-400">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-sm">Loading requests...</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Umbrella} title="No requests found" description="No time off requests match your current filter." />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((req: any) => {
            const empName = req.employee ? `${req.employee.firstName} ${req.employee.lastName}` : 'Unknown';
            const dept = req.employee?.department || '—';
            const typeName = req.timeOffType?.name || 'Unknown';
            const isPending = req.status === 'PENDING';
            const statusKey = req.status ? req.status.toLowerCase() : 'pending';
            const approvedByName = req.approvedBy ? `${req.approvedBy.firstName} ${req.approvedBy.lastName}` : undefined;

            return (
              <div
                key={req.id}
                className="bg-surface-card dark:bg-slate-900/80 border border-surface-border dark:border-slate-800 rounded-xl p-4 hover:border-slate-600 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{empName}</p>
                      <StatusBadge status={statusKey} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{dept}</p>
  
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-brand-500" />
                        {typeName}
                      </span>
                      <span>{formatDate(req.startDate)} – {formatDate(req.endDate)}</span>
                      <span className="font-medium text-slate-600 dark:text-slate-300">{req.days} day{req.days > 1 ? 's' : ''}</span>
                    </div>
  
                    {req.description && (
                      <p className="text-xs text-slate-500 mt-2 italic">"{req.description}"</p>
                    )}
                  </div>
  
                  {/* Approval actions — gated */}
                  {isPending && (
                    <PermissionGate allow={['timeoff.approve', 'timeoff.reject']}>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setConfirmAction({ type: 'approve', request: req })}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => setConfirmAction({ type: 'reject', request: req })}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    </PermissionGate>
                  )}
  
                  {!isPending && approvedByName && (
                    <div className="text-[10px] text-slate-500 shrink-0 text-right">
                      By {approvedByName}<br />
                      {req.approvedAt ? formatDate(req.approvedAt) : ''}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm dialog */}
      {confirmAction && (
        <ConfirmDialog
          open
          onClose={() => !(approveMutation.isPending || rejectMutation.isPending) && setConfirmAction(null)}
          onConfirm={handleApproveReject}
          title={confirmAction.type === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
          description={`Are you sure you want to ${confirmAction.type} the leave request from ${confirmAction.request.employee ? confirmAction.request.employee.firstName : 'Unknown'} for ${confirmAction.request.days} day(s)?`}
          confirmLabel={confirmAction.type === 'approve' ? 'Approve' : 'Reject'}
          variant={confirmAction.type === 'approve' ? 'info' : 'danger'}
          loading={approveMutation.isPending || rejectMutation.isPending}
        />
      )}
    </div>
  );
}
