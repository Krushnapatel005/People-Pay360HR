'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, LayoutGrid, List, Filter } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Breadcrumbs } from '../../../components/layout/breadcrumbs';
import { useQuery } from '@tanstack/react-query';
import { employeesApi } from '../../../lib/employees-api';
import type { Employee } from '../../../lib/types';

const DEPARTMENTS = ['All', 'Engineering', 'Human Resources', 'Product', 'Design', 'Finance', 'Sales'];

export default function EmployeesPage() {
  const router = useRouter();
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');

  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: employeesApi.getAll,
  });

  const filtered = employees.filter((e: any) => {
    const searchLower = search.toLowerCase();
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
    const matchSearch =
      fullName.includes(searchLower) ||
      (e.workEmail || '').toLowerCase().includes(searchLower) ||
      (e.department || '').toLowerCase().includes(searchLower) ||
      (e.jobPosition || '').toLowerCase().includes(searchLower);
    const matchDept = dept === 'All' || e.department === dept;
    return matchSearch && matchDept;
  });

  if (error) {
    return (
      <div className="p-8 text-center text-red-400">
        <p>Failed to load employees. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Employees
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {employees.length} Total
            </span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">Manage and view all employees in your organisation</p>
        </div>
        <Link
          href="/employees/new"
          id="new-employee-btn"
          className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-brand-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          New Employee
        </Link>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-slate-500" />
            </div>
            <input
              id="employee-search"
              type="text"
              placeholder="Search employees…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-lg bg-slate-900/60 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>

          {/* Department filter */}
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            id="dept-filter"
            className="rounded-lg bg-slate-900/60 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* View toggle */}
        <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0" role="tablist">
          <button
            role="tab"
            aria-selected={view === 'kanban'}
            onClick={() => setView('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              view === 'kanban' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className={`w-3.5 h-3.5 ${view === 'kanban' ? 'text-brand-400' : 'text-slate-500'}`} />
            Kanban
          </button>
          <button
            role="tab"
            aria-selected={view === 'list'}
            onClick={() => setView('list')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              view === 'list' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className={`w-3.5 h-3.5 ${view === 'list' ? 'text-brand-400' : 'text-slate-500'}`} />
            List
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-sm">Loading employees...</div>
      ) : (
        <>
          {/* List View */}
          {view === 'list' && (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/30">
                    <th className="py-3 px-4 font-semibold text-slate-300">Employee</th>
                    <th className="py-3 px-4 font-semibold text-slate-300 hidden sm:table-cell">Work Email</th>
                    <th className="py-3 px-4 font-semibold text-slate-300 hidden md:table-cell">Job Position</th>
                    <th className="py-3 px-4 font-semibold text-slate-300 hidden lg:table-cell">Department</th>
                    <th className="py-3 px-4 font-semibold text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-500">No employees found</td>
                    </tr>
                  ) : (
                    filtered.map((emp: any) => (
                      <tr
                        key={emp.id}
                        className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                        onClick={() => router.push(`/employees/${emp.id}`)}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/30 to-brand-700/30 border border-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-300 shrink-0 uppercase">
                              {emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-white group-hover:text-brand-300 transition-colors truncate">{emp.firstName} {emp.lastName}</p>
                              <p className="text-[11px] text-slate-500 truncate">{emp.employeeRef || emp.id.slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 hidden sm:table-cell">{emp.workEmail || emp.personalEmail || '—'}</td>
                        <td className="py-3.5 px-4 text-slate-300 hidden md:table-cell">{emp.jobPosition || '—'}</td>
                        <td className="py-3.5 px-4 hidden lg:table-cell">
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">{emp.department || '—'}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge status={emp.status || 'ACTIVE'} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Kanban View */}
          {view === 'kanban' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((emp: any) => (
                <Link
                  key={emp.id}
                  href={`/employees/${emp.id}`}
                  className="flex flex-col items-center p-4 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-brand-500/40 hover:bg-slate-800/60 transition-all group text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/30 to-brand-700/30 border border-brand-500/20 flex items-center justify-center text-lg font-bold text-brand-300 mb-3 group-hover:scale-105 transition-transform uppercase">
                    {emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}
                  </div>
                  <p className="text-xs font-semibold text-white truncate w-full">{emp.firstName} {emp.lastName}</p>
                  <p className="text-[11px] text-slate-500 truncate w-full mt-0.5">{emp.jobPosition || '—'}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 mt-2">{emp.department || '—'}</span>
                  <div className="mt-2.5">
                    <Badge status={emp.status || 'ACTIVE'} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
