'use client';
import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, Users, Banknote, Umbrella } from 'lucide-react';
import { Breadcrumbs } from '../../../components/layout/breadcrumbs';
import { formatCurrency } from '../../../lib/utils';

const MONTHLY_PAYROLL = [
  { month: 'Jan', gross: 1020000, net: 928000 },
  { month: 'Feb', gross: 1076000, net: 980690 },
  { month: 'Mar', gross: 1080000, net: 983000 },
  { month: 'Apr', gross: 1050000, net: 956000 },
  { month: 'May', gross: 1060000, net: 964000 },
  { month: 'Jun', gross: 1070000, net: 975000 },
  { month: 'Jul', gross: 1065000, net: 972000 },
  { month: 'Aug', gross: 1090000, net: 993000 },
  { month: 'Sep', gross: 0, net: 0 },
];

const maxGross = Math.max(...MONTHLY_PAYROLL.map((m) => m.gross));

const DEPT_DATA = [
  { dept: 'Engineering',    employees: 42, payroll: 4200000, color: 'bg-brand-500' },
  { dept: 'Finance',        employees: 18, payroll: 2200000, color: 'bg-emerald-500' },
  { dept: 'Human Resources',employees: 12, payroll: 1400000, color: 'bg-amber-500' },
  { dept: 'Product',        employees: 15, payroll: 1800000, color: 'bg-violet-500' },
  { dept: 'Design',         employees: 10, payroll: 1100000, color: 'bg-pink-500' },
  { dept: 'Sales',          employees: 20, payroll: 1500000, color: 'bg-cyan-500' },
];
const maxPayroll = Math.max(...DEPT_DATA.map((d) => d.payroll));

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-slate-400">HR and payroll insights for your organisation</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Headcount', value: '124', delta: '+3 this month', icon: <Users className="w-4 h-4" />, up: true },
          { label: 'Monthly Payroll', value: '₹10.9L', delta: '+1.4% vs Jul', icon: <Banknote className="w-4 h-4" />, up: true },
          { label: 'Avg Cost / Employee', value: '₹8,790', delta: '-0.6% vs Jul', icon: <TrendingDown className="w-4 h-4" />, up: false },
          { label: 'Attrition Rate', value: '2.4%', delta: 'Stable vs last Q', icon: <TrendingUp className="w-4 h-4" />, up: true },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{kpi.label}</p>
              <span className={`${kpi.up ? 'text-brand-400' : 'text-slate-500'}`}>{kpi.icon}</span>
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <p className={`text-xs mt-1 ${kpi.up ? 'text-emerald-400' : 'text-rose-400'}`}>{kpi.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Payroll Trend Chart (SVG bar chart) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-800">
            <BarChart3 className="w-4 h-4 text-brand-400" />
            <h2 className="text-sm font-semibold text-white">Payroll Trend (2026)</h2>
          </div>
          <div className="p-5">
            <div className="flex items-end justify-between gap-1.5 h-36">
              {MONTHLY_PAYROLL.map((m) => (
                <div key={m.month} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="flex flex-col items-center gap-0.5 w-full">
                    {m.gross > 0 ? (
                      <>
                        <div
                          className="w-full rounded-t bg-brand-600/70 hover:bg-brand-500/90 transition-colors"
                          style={{ height: `${(m.gross / maxGross) * 120}px` }}
                          title={formatCurrency(m.gross)}
                        />
                        <div
                          className="w-full rounded-t bg-emerald-600/50 hover:bg-emerald-500/70 transition-colors"
                          style={{ height: `${(m.net / maxGross) * 120}px`, marginTop: '-4px', zIndex: 1, position: 'relative' }}
                        />
                      </>
                    ) : (
                      <div className="w-full h-6 rounded bg-slate-800 border border-slate-700 border-dashed" />
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500">{m.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="w-3 h-2 rounded bg-brand-600/70 inline-block" />Gross
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="w-3 h-2 rounded bg-emerald-600/50 inline-block" />Net
              </div>
            </div>
          </div>
        </div>

        {/* Payroll by Dept */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-800">
            <Users className="w-4 h-4 text-brand-400" />
            <h2 className="text-sm font-semibold text-white">Payroll by Department</h2>
          </div>
          <div className="px-5 py-4 space-y-4">
            {DEPT_DATA.map((d) => (
              <div key={d.dept}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300">{d.dept}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{d.employees} emp</span>
                    <span className="text-white font-semibold">{formatCurrency(d.payroll / 12)}<span className="text-slate-500 font-normal">/mo</span></span>
                  </div>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${d.color}`} style={{ width: `${(d.payroll / maxPayroll) * 100}%`, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Leave utilisation */}
        <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-800">
            <Umbrella className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">Leave Utilisation</h2>
          </div>
          <div className="p-5 grid grid-cols-3 gap-4">
            {[
              { type: 'PTO', allocated: 2480, used: 380, color: 'bg-brand-500' },
              { type: 'Sick Leave', allocated: 1488, used: 210, color: 'bg-rose-500' },
              { type: 'Casual Leave', allocated: 992, used: 150, color: 'bg-amber-500' },
            ].map((lt) => (
              <div key={lt.type} className="text-center">
                <p className="text-xs font-medium text-slate-400 mb-3">{lt.type}</p>
                <div className="relative w-16 h-16 mx-auto">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-800" />
                    <circle cx="18" cy="18" r="14" fill="none" strokeWidth="3"
                      strokeDasharray={`${(lt.used / lt.allocated) * 87.96} 87.96`}
                      className={lt.color.replace('bg-', 'stroke-')}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                    {Math.round((lt.used / lt.allocated) * 100)}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">{lt.used}/{lt.allocated} days</p>
              </div>
            ))}
          </div>
        </div>

        {/* Employee count breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-800">
            <Users className="w-4 h-4 text-brand-400" />
            <h2 className="text-sm font-semibold text-white">Status Breakdown</h2>
          </div>
          <div className="p-5 space-y-3">
            {[
              { status: 'Active', count: 112, pct: 90, color: 'bg-emerald-500' },
              { status: 'On Leave', count: 6, pct: 5, color: 'bg-amber-500' },
              { status: 'Probation', count: 4, pct: 3, color: 'bg-blue-500' },
              { status: 'Inactive', count: 2, pct: 2, color: 'bg-slate-600' },
            ].map((s) => (
              <div key={s.status}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">{s.status}</span>
                  <span className="text-white font-semibold">{s.count}</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
