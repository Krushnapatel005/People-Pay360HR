'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Breadcrumbs } from '../../../components/layout/breadcrumbs';
import { MOCK_TIME_OFF_REQUESTS } from '../../../lib/mock-data';
import { formatDate } from '../../../lib/utils';

const STATUS_TABS = ['All', 'Pending', 'Approved', 'Rejected'];

export default function TimeOffPage() {
  const [activeStatus, setActiveStatus] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = MOCK_TIME_OFF_REQUESTS.filter((r) => {
    const matchStatus = activeStatus === 'All' || r.status === activeStatus.toLowerCase();
    const matchSearch = r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      r.timeOffTypeName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Time Off Requests</h1>
          <p className="mt-1 text-xs text-slate-400">Manage and approve employee leave requests</p>
        </div>
        <Link href="/time-off/new" className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-brand-sm transition-all">
          <Plus className="w-3.5 h-3.5" /> New Request
        </Link>
      </div>

      {/* Sub navigation */}
      <div className="flex items-center gap-4 border-b border-slate-800">
        {STATUS_TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveStatus(tab)} className={`pb-3 text-xs font-medium transition-all border-b-2 ${activeStatus === tab ? 'text-white border-brand-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
            {tab}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3 pb-3">
          <Link href="/time-off/types" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Types</Link>
          <Link href="/time-off/allocations" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Allocations</Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        <input type="text" placeholder="Search requests…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-lg bg-slate-900/60 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/30">
              <th className="py-3 px-4 font-semibold text-slate-300">Employee</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Type</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Period</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Days</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Status</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-slate-500">No requests found</td></tr>
            ) : (
              filtered.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white">{req.employeeName}</td>
                  <td className="py-3.5 px-4 text-slate-400">{req.timeOffTypeName}</td>
                  <td className="py-3.5 px-4 text-slate-400">{formatDate(req.startDate)} – {formatDate(req.endDate)}</td>
                  <td className="py-3.5 px-4 text-slate-300 font-semibold">{req.days}</td>
                  <td className="py-3.5 px-4"><Badge status={req.status} /></td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {req.status === 'pending' && (
                        <>
                          <button className="text-[10px] px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/30 transition-colors">Approve</button>
                          <button className="text-[10px] px-2.5 py-1 rounded bg-red-600/10 text-red-400 border border-red-500/20 hover:bg-red-600/20 transition-colors">Reject</button>
                        </>
                      )}
                      <Link href={`/time-off/${req.id}`} className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors">View</Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
