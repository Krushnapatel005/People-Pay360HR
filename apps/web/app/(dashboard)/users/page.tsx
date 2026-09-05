'use client';
import React, { useState } from 'react';
import { Shield, Plus, Search, Edit2, Trash2, UserPlus } from 'lucide-react';
import { Breadcrumbs } from '../../../components/layout/breadcrumbs';
import { StatusBadge } from '../../../components/ui/status-badge';
import { PageGate } from '../../../components/shared/permission-gate';
import { ConfirmDialog } from '../../../components/shared/confirm-dialog';
import { EmptyState } from '../../../components/shared/empty-state';
import { MOCK_USERS } from '../../../lib/mock-data';
import { formatDate } from '../../../lib/utils';
import { ROLE_LABELS, ROLE_COLORS, ROLE_BG } from '../../../lib/context/role-context';
import type { User, Role } from '../../../lib/types';

const ALL_ROLES: Role[] = ['employee', 'hr_manager', 'time_off_admin', 'payroll_user', 'payroll_admin', 'admin'];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all');
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  function handleDelete() {
    if (!deleteTarget) return;
    setLoading(true);
    setTimeout(() => {
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setLoading(false);
      setDeleteTarget(null);
    }, 600);
  }

  return (
    <PageGate roles={['admin']}>
      <div className="space-y-5 animate-fade-in">
        <Breadcrumbs />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Shield className="w-6 h-6 text-violet-400" />
              User Management
            </h1>
            <p className="mt-1 text-xs text-slate-500">Manage system users and role assignments</p>
          </div>
          <button className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all">
            <UserPlus className="w-3.5 h-3.5" /> Invite User
          </button>
        </div>

        {/* Role summary chips */}
        <div className="flex flex-wrap gap-2">
          {ALL_ROLES.map((r) => {
            const count = users.filter((u) => u.role === r).length;
            return (
              <button
                key={r}
                onClick={() => setRoleFilter(roleFilter === r ? 'all' : r)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${roleFilter === r ? ROLE_BG[r] + ' ' + ROLE_COLORS[r] : 'border-surface-border dark:border-slate-800 text-slate-400 hover:text-slate-200'}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${ROLE_COLORS[r].replace('text-', 'bg-')}`} />
                {ROLE_LABELS[r]}
                <span className="ml-0.5 text-[10px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-card dark:bg-slate-900/60 border border-surface-border dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState icon={Shield} title="No users found" description="No users match your current filter." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-surface-border dark:border-slate-800 bg-surface-card dark:bg-slate-900/50">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-surface-border dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                  <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300">User</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300 hidden sm:table-cell">Email</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300">Role</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300 hidden md:table-cell">Last Login</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300">Status</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border dark:divide-slate-800/80">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${ROLE_BG[user.role]} ${ROLE_COLORS[user.role]}`}>
                          {user.initials}
                        </div>
                        <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 hidden sm:table-cell">{user.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${ROLE_BG[user.role]} ${ROLE_COLORS[user.role]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ROLE_COLORS[user.role].replace('text-', 'bg-')}`} />
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 hidden md:table-cell">
                      {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                    </td>
                    <td className="py-3.5 px-4"><StatusBadge status={user.status} /></td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors" title="Edit user">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Remove user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => !loading && setDeleteTarget(null)}
          onConfirm={handleDelete}
          title={`Remove ${deleteTarget?.name}?`}
          description="This will revoke their system access. This action cannot be undone."
          confirmLabel="Remove User"
          variant="danger"
          loading={loading}
        />
      </div>
    </PageGate>
  );
}
