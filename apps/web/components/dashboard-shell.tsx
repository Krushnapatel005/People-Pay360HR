'use client';

import { useEffect, useState } from 'react';

const navItems = ['Overview', 'Employees', 'Contracts', 'Attendance', 'Time Off', 'Payroll'];

export function DashboardShell() {
  const [dark, setDark] = useState(false);
  useEffect(() => document.documentElement.classList.toggle('dark', dark), [dark]);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-lg font-bold text-indigo-600">PeoplePay360</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">HR and payroll operations</p>
          <nav className="mt-8 space-y-1">{navItems.map((item, index) => <button key={item} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${index === 0 ? 'bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}>{item}</button>)}</nav>
        </aside>
        <section>
          <header className="flex items-center justify-between gap-4">
            <div><p className="text-sm text-slate-500 dark:text-slate-400">Friday, 5 September</p><h1 className="text-3xl font-bold">Good morning, HR team</h1></div>
            <button onClick={() => setDark((value) => !value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">{dark ? 'Light mode' : 'Dark mode'}</button>
          </header>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[['Active employees', '124'], ['Pending leave requests', '8'], ['Contracts ending soon', '3'], ['Payroll exceptions', '2']].map(([label, value]) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><p className="text-sm text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></article>)}
          </div>
          <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><p className="font-semibold">Level 1 foundation ready</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">The next implementation step is authentication, RBAC guards, and Employee CRUD.</p></article>
        </section>
      </div>
    </main>
  );
}
