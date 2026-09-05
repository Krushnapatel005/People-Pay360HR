'use client';
import React from 'react';
import {
  Users, FileText, CalendarClock, Umbrella, Banknote, AlertTriangle,
  Clock, CheckCircle2, ArrowRight, BarChart2, Shield, CreditCard, Play,
  TrendingUp, Activity,
} from 'lucide-react';
import Link from 'next/link';
import { Breadcrumbs } from '../../../components/layout/breadcrumbs';
import { StatusBadge } from '../../../components/ui/status-badge';
import { DashboardWidget, WidgetGrid } from '../../../components/dashboard/widget';
import { useRole } from '../../../lib/context/role-context';
import {
  MOCK_EMPLOYEES, MOCK_TIME_OFF_REQUESTS, MOCK_PAYRUNS, MOCK_CONTRACTS,
} from '../../../lib/mock-data';
import { formatCurrency, formatDate } from '../../../lib/utils';
import type { Role } from '../../../lib/types';

// ─── Role-specific widget config ─────────────────────────────────────────────
const ROLE_WIDGETS: Record<Role, {
  title: string;
  subtitle: string;
  widgets: {
    title: string; value: string | number; subtitle?: string;
    delta?: string; deltaType?: 'up' | 'down' | 'neutral';
    icon: React.ReactNode; color: 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue' | 'violet' | 'cyan' | 'orange';
    chart?: number[];
  }[];
}> = {
  employee: {
    title: 'My Dashboard',
    subtitle: 'Your personal HR overview',
    widgets: [
      { title: 'Leave Balance (PTO)', value: '14 days', delta: '6 days used this year', deltaType: 'neutral', icon: <Umbrella className="w-4 h-4" />, color: 'indigo', chart: [20,18,16,14,14] },
      { title: 'Attendance Rate',     value: '97.2%',   delta: '+1.2% vs last month', deltaType: 'up',      icon: <CalendarClock className="w-4 h-4" />, color: 'emerald', chart: [92,94,95,96,97] },
      { title: 'Pending Requests',    value: '1',       delta: '1 awaiting approval', deltaType: 'neutral',  icon: <Clock className="w-4 h-4" />, color: 'amber' },
      { title: 'Net Salary (Aug)',    value: '₹2,34,610', delta: 'Paid on 1 Sep', deltaType: 'up',          icon: <Banknote className="w-4 h-4" />, color: 'blue' },
    ],
  },
  hr_manager: {
    title: 'HR Manager Dashboard',
    subtitle: 'Workforce & people operations overview',
    widgets: [
      { title: 'Total Employees',      value: '124', delta: '+3 this month', deltaType: 'up',    icon: <Users className="w-4 h-4" />,        color: 'indigo',  chart: [110,114,118,121,124] },
      { title: 'Pending Leave Requests', value: '8', delta: '3 urgent', deltaType: 'neutral',    icon: <Umbrella className="w-4 h-4" />,     color: 'amber' },
      { title: 'Contracts Expiring',   value: '5',   delta: 'Within 60 days', deltaType: 'down', icon: <FileText className="w-4 h-4" />,      color: 'rose' },
      { title: 'Attendance Rate',      value: '94.1%', delta: '-0.8% vs last month', deltaType: 'down', icon: <CalendarClock className="w-4 h-4" />, color: 'blue', chart: [95,95,94,94,94] },
    ],
  },
  time_off_admin: {
    title: 'Time Off Admin Dashboard',
    subtitle: 'Leave requests, types, and allocation overview',
    widgets: [
      { title: 'Pending Requests',   value: '8',  delta: '3 urgent', deltaType: 'neutral', icon: <Clock className="w-4 h-4" />,     color: 'amber' },
      { title: 'Approved This Month', value: '21', delta: '+5 vs last month', deltaType: 'up', icon: <CheckCircle2 className="w-4 h-4" />, color: 'emerald', chart: [12,14,16,18,21] },
      { title: 'Leave Types Active', value: '6',  delta: '2 require allocation', deltaType: 'neutral', icon: <FileText className="w-4 h-4" />,  color: 'indigo' },
      { title: 'Total Days Allocated', value: '1,240', delta: 'Across 124 employees', deltaType: 'neutral', icon: <Umbrella className="w-4 h-4" />, color: 'violet' },
    ],
  },
  payroll_user: {
    title: 'Payroll Overview',
    subtitle: 'Payruns and payslip status',
    widgets: [
      { title: 'Active Payruns',   value: '2',   delta: '1 in draft', deltaType: 'neutral', icon: <Banknote className="w-4 h-4" />,    color: 'indigo' },
      { title: 'Last Payrun Net',  value: '₹9,83,000', delta: 'Aug 2026', deltaType: 'up', icon: <CreditCard className="w-4 h-4" />, color: 'emerald', chart: [820,840,870,920,983] },
      { title: 'Payslips Generated', value: '118', delta: 'For Aug 2026', deltaType: 'up', icon: <FileText className="w-4 h-4" />,  color: 'blue' },
      { title: 'Exceptions Found', value: '2',   delta: 'Need resolution', deltaType: 'down', icon: <AlertTriangle className="w-4 h-4" />, color: 'rose' },
    ],
  },
  payroll_admin: {
    title: 'Payroll Admin Dashboard',
    subtitle: 'Salary, validation, and payslip delivery',
    widgets: [
      { title: 'Last Payrun Net',       value: '₹9,83,000', delta: 'Aug 2026 · Paid', deltaType: 'up',      icon: <Banknote className="w-4 h-4" />,     color: 'emerald', chart: [820,840,870,920,983] },
      { title: 'Pending Payrun',        value: 'Sep 2026',  delta: 'Draft — not computed', deltaType: 'neutral', icon: <Clock className="w-4 h-4" />,        color: 'amber' },
      { title: 'Salary Exceptions',     value: '2',         delta: 'Need resolution', deltaType: 'down',     icon: <AlertTriangle className="w-4 h-4" />, color: 'rose' },
      { title: 'Employees on Payroll',  value: '118',       delta: 'Active contracts', deltaType: 'neutral', icon: <Users className="w-4 h-4" />,         color: 'indigo' },
    ],
  },
  admin: {
    title: 'Admin Dashboard',
    subtitle: 'Full system overview — HR, Payroll & Operations',
    widgets: [
      { title: 'Total Employees',   value: '124',        delta: '+3 this month', deltaType: 'up',      icon: <Users className="w-4 h-4" />,         color: 'indigo',  chart: [110,114,118,121,124] },
      { title: 'Monthly Payroll',   value: '₹10,90,000', delta: '+1.2% vs Aug', deltaType: 'up',       icon: <Banknote className="w-4 h-4" />,       color: 'emerald', chart: [920,950,970,1020,1090] },
      { title: 'Open Leave Requests', value: '8',        delta: '3 require attention', deltaType: 'neutral', icon: <Umbrella className="w-4 h-4" />, color: 'amber' },
      { title: 'Payroll Exceptions', value: '2',          delta: 'Need resolution', deltaType: 'down',  icon: <AlertTriangle className="w-4 h-4" />, color: 'rose' },
    ],
  },
};

// ─── Payrun lifecycle progress bar ───────────────────────────────────────────
const LIFECYCLE_STEPS = ['Draft', 'Computed', 'Validated', 'Paid'];
const STATUS_STEP: Record<string, number> = { draft: 0, computed: 1, validated: 2, paid: 3 };

function PayrunLifecycle({ status }: { status: string }) {
  const step = STATUS_STEP[status] ?? 0;
  return (
    <div className="flex items-center gap-1">
      {LIFECYCLE_STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`flex items-center gap-1 text-[10px] font-medium ${i <= step ? 'text-brand-400' : 'text-slate-600'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border ${
              i < step ? 'bg-brand-600 border-brand-500 text-white' :
              i === step ? 'border-brand-500 text-brand-400' :
              'border-slate-700 text-slate-600'
            }`}>
              {i < step ? '✓' : i + 1}
            </span>
            <span className="hidden sm:inline">{s}</span>
          </div>
          {i < LIFECYCLE_STEPS.length - 1 && (
            <div className={`flex-1 h-px min-w-[16px] ${i < step ? 'bg-brand-600' : 'bg-slate-800'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { role } = useRole();
  const config = ROLE_WIDGETS[role];

  const recentEmployees = MOCK_EMPLOYEES.slice(0, 5);
  const pendingRequests = MOCK_TIME_OFF_REQUESTS.filter((r) => r.status === 'pending').slice(0, 4);
  const latestPayrun = MOCK_PAYRUNS.find((p) => p.status === 'paid' || p.status === 'validated');
  const draftPayrun = MOCK_PAYRUNS.find((p) => p.status === 'draft');
  const expiringContracts = MOCK_CONTRACTS.filter((c) => c.status === 'active').slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{config.title}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{config.subtitle}</p>
      </div>

      {/* Widgets */}
      <WidgetGrid>
        {config.widgets.map((w) => (
          <DashboardWidget key={w.title} {...w} />
        ))}
      </WidgetGrid>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Employees — visible to hr_manager, admin */}
        {(role === 'hr_manager' || role === 'admin') && (
          <div className="lg:col-span-2 bg-surface-card dark:bg-slate-900/80 border border-surface-border dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-brand-400" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Employees</h2>
              </div>
              <Link href="/employees" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-surface-border dark:divide-slate-800/50">
              {recentEmployees.map((emp) => (
                <Link
                  key={emp.id}
                  href={`/employees/${emp.id}`}
                  className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/30 to-brand-600/40 border border-brand-500/20 flex items-center justify-center text-xs text-brand-400 font-bold shrink-0">
                    {emp.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 dark:text-white group-hover:text-brand-400 dark:group-hover:text-brand-300 transition-colors truncate">{emp.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{emp.jobPosition} · {emp.department}</p>
                  </div>
                  <StatusBadge status={emp.status} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Employee self-view */}
        {role === 'employee' && (
          <div className="lg:col-span-2 bg-surface-card dark:bg-slate-900/80 border border-surface-border dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-surface-border dark:border-slate-800">
              <Activity className="w-4 h-4 text-brand-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">My Recent Activity</h2>
            </div>
            <div className="p-5 space-y-3">
              {[
                { icon: <Umbrella className="w-3.5 h-3.5 text-amber-400" />, text: 'Submitted Annual Leave request (5 days)', time: '2 days ago', color: 'bg-amber-500/10' },
                { icon: <Banknote className="w-3.5 h-3.5 text-emerald-400" />, text: 'Payslip for August 2026 available', time: '4 days ago', color: 'bg-emerald-500/10' },
                { icon: <CalendarClock className="w-3.5 h-3.5 text-brand-400" />, text: 'Attendance recorded — 01 Sep 2026', time: '4 days ago', color: 'bg-brand-500/10' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                  <div className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center shrink-0 mt-0.5`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">{item.text}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payrun widgets — visible to payroll roles and admin */}
        {(['payroll_user', 'payroll_admin', 'admin'] as Role[]).includes(role) && (
          <div className="lg:col-span-2 bg-surface-card dark:bg-slate-900/80 border border-surface-border dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Banknote className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Payrun Overview</h2>
              </div>
              <Link href="/payroll" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Latest paid payrun */}
            {latestPayrun && (
              <div className="px-5 py-4 border-b border-surface-border dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{latestPayrun.name}</p>
                  <StatusBadge status={latestPayrun.status} />
                </div>
                <PayrunLifecycle status={latestPayrun.status} />
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: 'Gross', value: formatCurrency(latestPayrun.totalGross) },
                    { label: 'Deductions', value: formatCurrency(latestPayrun.totalDeductions) },
                    { label: 'Net', value: formatCurrency(latestPayrun.totalNet) },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <p className="text-[10px] text-slate-400 uppercase">{label}</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Draft payrun */}
            {draftPayrun && (
              <div className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{draftPayrun.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Not computed yet</p>
                  </div>
                  <Link
                    href={`/payroll/${draftPayrun.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold bg-brand-600/10 text-brand-400 border border-brand-500/20 rounded-lg hover:bg-brand-600/20 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    Compute
                  </Link>
                </div>
                {draftPayrun.exceptionCount > 0 && (
                  <div className="mt-3 flex items-center gap-2 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-xs text-amber-300">{draftPayrun.exceptionCount} exception(s) need attention</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Time Off Admin main view */}
        {role === 'time_off_admin' && (
          <div className="lg:col-span-2 bg-surface-card dark:bg-slate-900/80 border border-surface-border dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Umbrella className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Pending Leave Requests</h2>
              </div>
              <Link href="/time-off" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-surface-border dark:divide-slate-800/50">
              {pendingRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{req.employeeName}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{req.timeOffTypeName} · {req.days} day(s) · {formatDate(req.startDate)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors font-medium">Approve</button>
                    <button className="text-[10px] px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors font-medium">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Pending Time Off — shown to non-payroll roles */}
          {(['employee', 'hr_manager', 'time_off_admin', 'admin'] as Role[]).includes(role) && (
            <div className="bg-surface-card dark:bg-slate-900/80 border border-surface-border dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Umbrella className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Pending Leaves</h2>
                </div>
                <Link href="/time-off" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">View all</Link>
              </div>
              <div className="p-4 space-y-2.5">
                {pendingRequests.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No pending requests</p>
                ) : pendingRequests.slice(0, 3).map((req) => (
                  <div key={req.id} className="flex items-start justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{req.employeeName}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{req.timeOffTypeName} · {req.days}d</p>
                    </div>
                    <StatusBadge status="pending" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expiring Contracts — HR Manager / Admin */}
          {(['hr_manager', 'admin'] as Role[]).includes(role) && (
            <div className="bg-surface-card dark:bg-slate-900/80 border border-surface-border dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-rose-400" />
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Expiring Contracts</h2>
                </div>
                <Link href="/contracts" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">View all</Link>
              </div>
              <div className="divide-y divide-surface-border dark:divide-slate-800/50">
                {expiringContracts.map((c) => (
                  <div key={c.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{c.employeeName}</p>
                      <p className="text-[10px] text-slate-500">{c.ref} · Ends {c.endDate ? formatDate(c.endDate) : 'Open'}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin: User count widget */}
          {role === 'admin' && (
            <div className="bg-surface-card dark:bg-slate-900/80 border border-surface-border dark:border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <Shield className="w-4 h-4 text-violet-400" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">System Access</h2>
              </div>
              {[
                { role: 'Admin',          count: 1, color: 'bg-violet-500' },
                { role: 'HR Manager',     count: 2, color: 'bg-emerald-500' },
                { role: 'Payroll Admin',  count: 1, color: 'bg-orange-500' },
                { role: 'Employees',      count: 120, color: 'bg-blue-500' },
              ].map((r) => (
                <div key={r.role} className="flex items-center gap-3 mb-2">
                  <span className={`w-2 h-2 rounded-full ${r.color} shrink-0`} />
                  <span className="text-xs text-slate-400 flex-1">{r.role}</span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">{r.count}</span>
                </div>
              ))}
              <Link href="/users" className="mt-3 inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors">
                Manage Users <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {role === 'employee' && [
          { label: 'Request Leave', href: '/time-off', icon: <Umbrella className="w-4 h-4" />, color: 'from-amber-600/20 to-amber-700/10 border-amber-500/20 text-amber-300' },
          { label: 'My Payslips',   href: '/payroll/payslips', icon: <Banknote className="w-4 h-4" />, color: 'from-emerald-600/20 to-emerald-700/10 border-emerald-500/20 text-emerald-300' },
          { label: 'Attendance',   href: '/attendance', icon: <CalendarClock className="w-4 h-4" />, color: 'from-brand-600/20 to-brand-700/10 border-brand-500/20 text-brand-300' },
          { label: 'My Profile',   href: '/employees/emp-001', icon: <Users className="w-4 h-4" />, color: 'from-violet-600/20 to-violet-700/10 border-violet-500/20 text-violet-300' },
        ].map((a) => (
          <Link key={a.label} href={a.href} className={`flex items-center gap-3 p-4 bg-gradient-to-br ${a.color} border rounded-2xl hover:opacity-80 transition-all group`}>
            <span className="shrink-0">{a.icon}</span>
            <span className="text-xs font-medium">{a.label}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}

        {(role === 'hr_manager' || role === 'admin') && [
          { label: 'New Employee',  href: '/employees/new', icon: <Users className="w-4 h-4" />,    color: 'from-brand-600/20 to-brand-700/10 border-brand-500/20 text-brand-300' },
          { label: 'New Contract',  href: '/contracts', icon: <FileText className="w-4 h-4" />,      color: 'from-violet-600/20 to-violet-700/10 border-violet-500/20 text-violet-300' },
          { label: 'Attendance',    href: '/attendance', icon: <CalendarClock className="w-4 h-4" />, color: 'from-sky-600/20 to-sky-700/10 border-sky-500/20 text-sky-300' },
          { label: 'Analytics',     href: '/analytics', icon: <BarChart2 className="w-4 h-4" />,      color: 'from-emerald-600/20 to-emerald-700/10 border-emerald-500/20 text-emerald-300' },
        ].map((a) => (
          <Link key={a.label} href={a.href} className={`flex items-center gap-3 p-4 bg-gradient-to-br ${a.color} border rounded-2xl hover:opacity-80 transition-all group`}>
            <span className="shrink-0">{a.icon}</span>
            <span className="text-xs font-medium">{a.label}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}

        {(['payroll_user', 'payroll_admin'] as Role[]).includes(role) && [
          { label: 'Run Payroll',       href: '/payroll', icon: <Banknote className="w-4 h-4" />, color: 'from-emerald-600/20 to-emerald-700/10 border-emerald-500/20 text-emerald-300' },
          { label: 'View Payslips',     href: '/payroll/payslips', icon: <FileText className="w-4 h-4" />, color: 'from-brand-600/20 to-brand-700/10 border-brand-500/20 text-brand-300' },
          { label: 'Salary Structures', href: '/payroll/salary-structures', icon: <TrendingUp className="w-4 h-4" />, color: 'from-violet-600/20 to-violet-700/10 border-violet-500/20 text-violet-300' },
          { label: 'Analytics',         href: '/analytics', icon: <BarChart2 className="w-4 h-4" />, color: 'from-amber-600/20 to-amber-700/10 border-amber-500/20 text-amber-300' },
        ].map((a) => (
          <Link key={a.label} href={a.href} className={`flex items-center gap-3 p-4 bg-gradient-to-br ${a.color} border rounded-2xl hover:opacity-80 transition-all group`}>
            <span className="shrink-0">{a.icon}</span>
            <span className="text-xs font-medium">{a.label}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}

        {role === 'time_off_admin' && [
          { label: 'Leave Requests', href: '/time-off',             icon: <Umbrella className="w-4 h-4" />,    color: 'from-cyan-600/20 to-cyan-700/10 border-cyan-500/20 text-cyan-300' },
          { label: 'Leave Types',    href: '/time-off/types',       icon: <FileText className="w-4 h-4" />,    color: 'from-brand-600/20 to-brand-700/10 border-brand-500/20 text-brand-300' },
          { label: 'Allocations',    href: '/time-off/allocations', icon: <CalendarClock className="w-4 h-4" />, color: 'from-violet-600/20 to-violet-700/10 border-violet-500/20 text-violet-300' },
          { label: 'Analytics',      href: '/analytics',             icon: <BarChart2 className="w-4 h-4" />,   color: 'from-emerald-600/20 to-emerald-700/10 border-emerald-500/20 text-emerald-300' },
        ].map((a) => (
          <Link key={a.label} href={a.href} className={`flex items-center gap-3 p-4 bg-gradient-to-br ${a.color} border rounded-2xl hover:opacity-80 transition-all group`}>
            <span className="shrink-0">{a.icon}</span>
            <span className="text-xs font-medium">{a.label}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
}
