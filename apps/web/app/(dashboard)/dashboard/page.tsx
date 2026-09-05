'use client';
import React, { useState } from 'react';
import {
  Users, FileText, CalendarClock, Umbrella, Banknote, AlertTriangle,
  TrendingUp, Clock, CheckCircle, Activity, BarChart2,
  ArrowRight, Briefcase,
} from 'lucide-react';
import Link from 'next/link';
import { StatCard } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Breadcrumbs } from '../../../components/layout/breadcrumbs';
import { MOCK_EMPLOYEES, MOCK_TIME_OFF_REQUESTS, MOCK_PAYRUNS, MOCK_CONTRACTS } from '../../../lib/mock-data';
import { formatCurrency, formatDate } from '../../../lib/utils';

const ROLE_CONFIG = {
  employee: {
    title: 'My Dashboard',
    subtitle: 'Your personal HR overview',
    stats: [
      { label: 'Leave Balance (PTO)', value: '14 days', delta: '6 used this year', deltaType: 'neutral' as const, icon: <Umbrella className="w-4 h-4" />, color: 'indigo' as const },
      { label: 'Attendance Rate', value: '97.2%', delta: '+1.2% vs last month', deltaType: 'up' as const, icon: <CalendarClock className="w-4 h-4" />, color: 'emerald' as const },
      { label: 'Pending Requests', value: '1', delta: '1 awaiting approval', deltaType: 'neutral' as const, icon: <Clock className="w-4 h-4" />, color: 'amber' as const },
      { label: 'Net Salary (Aug)', value: '₹2,34,610', delta: 'Paid on 1 Sep', deltaType: 'up' as const, icon: <Banknote className="w-4 h-4" />, color: 'blue' as const },
    ],
  },
  hr_manager: {
    title: 'HR Manager Dashboard',
    subtitle: 'Workforce & people operations overview',
    stats: [
      { label: 'Total Employees', value: '124', delta: '+3 this month', deltaType: 'up' as const, icon: <Users className="w-4 h-4" />, color: 'indigo' as const },
      { label: 'Pending Leave Requests', value: '8', delta: '3 urgent', deltaType: 'neutral' as const, icon: <Umbrella className="w-4 h-4" />, color: 'amber' as const },
      { label: 'Contracts Expiring', value: '5', delta: 'Within 60 days', deltaType: 'down' as const, icon: <FileText className="w-4 h-4" />, color: 'rose' as const },
      { label: 'Attendance Rate', value: '94.1%', delta: '-0.8% vs last month', deltaType: 'down' as const, icon: <CalendarClock className="w-4 h-4" />, color: 'blue' as const },
    ],
  },
  payroll_admin: {
    title: 'Payroll Dashboard',
    subtitle: 'Payroll runs, exceptions and salary overview',
    stats: [
      { label: 'Last Payrun Net', value: '₹9,83,000', delta: 'Aug 2026 · Paid', deltaType: 'up' as const, icon: <Banknote className="w-4 h-4" />, color: 'emerald' as const },
      { label: 'Pending Payrun', value: 'Sep 2026', delta: 'Draft — not computed', deltaType: 'neutral' as const, icon: <Clock className="w-4 h-4" />, color: 'amber' as const },
      { label: 'Exceptions', value: '2', delta: 'Need resolution', deltaType: 'down' as const, icon: <AlertTriangle className="w-4 h-4" />, color: 'rose' as const },
      { label: 'Total Employees on Payroll', value: '118', delta: 'Active contracts', deltaType: 'neutral' as const, icon: <Users className="w-4 h-4" />, color: 'indigo' as const },
    ],
  },
  admin: {
    title: 'Admin Dashboard',
    subtitle: 'Full system overview — HR, Payroll & Operations',
    stats: [
      { label: 'Total Employees', value: '124', delta: '+3 this month', deltaType: 'up' as const, icon: <Users className="w-4 h-4" />, color: 'indigo' as const },
      { label: 'Monthly Payroll', value: '₹10,90,000', delta: '+1.2% vs Aug', deltaType: 'up' as const, icon: <Banknote className="w-4 h-4" />, color: 'emerald' as const },
      { label: 'Open Leave Requests', value: '8', delta: '3 require attention', deltaType: 'neutral' as const, icon: <Umbrella className="w-4 h-4" />, color: 'amber' as const },
      { label: 'Payroll Exceptions', value: '2', delta: 'Need resolution', deltaType: 'down' as const, icon: <AlertTriangle className="w-4 h-4" />, color: 'rose' as const },
    ],
  },
};

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<keyof typeof ROLE_CONFIG>('admin');
  const config = ROLE_CONFIG[activeRole];

  const recentEmployees = MOCK_EMPLOYEES.slice(0, 5);
  const pendingRequests = MOCK_TIME_OFF_REQUESTS.filter((r) => r.status === 'pending');
  const latestPayrun = MOCK_PAYRUNS.find((p) => p.status === 'validated' || p.status === 'paid');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{config.title}</h1>
          <p className="mt-1 text-sm text-slate-400">{config.subtitle}</p>
        </div>
        {/* Role switcher pill */}
        <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl gap-1" role="tablist" aria-label="Preview role">
          {(Object.keys(ROLE_CONFIG) as Array<keyof typeof ROLE_CONFIG>).map((r) => (
            <button
              key={r}
              role="tab"
              aria-selected={activeRole === r}
              onClick={() => setActiveRole(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeRole === r
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {r === 'hr_manager' ? 'HR Manager' : r === 'payroll_admin' ? 'Payroll' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {config.stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Employees */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-brand-400" />
              <h2 className="text-sm font-semibold text-white">Recent Employees</h2>
            </div>
            <Link href="/employees" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-800/50">
            {recentEmployees.map((emp) => (
              <Link
                key={emp.id}
                href={`/employees/${emp.id}`}
                className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-slate-800/40 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/30 to-brand-600/40 border border-brand-500/20 flex items-center justify-center text-xs text-brand-300 font-bold shrink-0">
                  {emp.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white group-hover:text-brand-300 transition-colors truncate">{emp.fullName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{emp.jobPosition} · {emp.department}</p>
                </div>
                <Badge status={emp.status} />
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Pending Time Off */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Umbrella className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-semibold text-white">Pending Leaves</h2>
              </div>
              <Link href="/time-off" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                View all
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {pendingRequests.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No pending requests</p>
              ) : (
                pendingRequests.map((req) => (
                  <div key={req.id} className="flex items-start justify-between gap-3 p-3 bg-slate-800/40 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{req.employeeName}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{req.timeOffTypeName} · {req.days}d · {formatDate(req.startDate)}</p>
                    </div>
                    <Badge status="pending" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Latest Payrun */}
          {latestPayrun && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-semibold text-white">Latest Payrun</h2>
                </div>
                <Link href={`/payroll/${latestPayrun.id}`} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Details
                </Link>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Period</span>
                  <span className="text-xs text-white font-medium">{latestPayrun.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Net Total</span>
                  <span className="text-xs text-emerald-400 font-bold">{formatCurrency(latestPayrun.totalNet)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Status</span>
                  <Badge status={latestPayrun.status} />
                </div>
                {latestPayrun.exceptionCount > 0 && (
                  <div className="flex items-center gap-2 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg mt-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-xs text-amber-300">{latestPayrun.exceptionCount} exception(s) found</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'New Employee',      href: '/employees/new',           icon: <Users className="w-4 h-4" />,         color: 'from-brand-600/20 to-brand-700/10 border-brand-500/20 text-brand-300' },
          { label: 'New Time Off',       href: '/time-off/new',            icon: <Umbrella className="w-4 h-4" />,      color: 'from-amber-600/20 to-amber-700/10 border-amber-500/20 text-amber-300' },
          { label: 'Run Payroll',        href: '/payroll/new',             icon: <Banknote className="w-4 h-4" />,      color: 'from-emerald-600/20 to-emerald-700/10 border-emerald-500/20 text-emerald-300' },
          { label: 'View Analytics',     href: '/analytics',               icon: <BarChart2 className="w-4 h-4" />,     color: 'from-violet-600/20 to-violet-700/10 border-violet-500/20 text-violet-300' },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`flex items-center gap-3 p-4 bg-gradient-to-br ${action.color} border rounded-2xl hover:opacity-80 transition-all group`}
          >
            <span className="shrink-0">{action.icon}</span>
            <span className="text-xs font-medium">{action.label}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
}
