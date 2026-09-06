'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Clock } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Breadcrumbs } from '../../../components/layout/breadcrumbs';
import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '../../../lib/attendance-api';
import { formatDate } from '../../../lib/utils';

export default function AttendancePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [checkInOpen, setCheckInOpen] = useState(false);

  const { data: attendanceList = [], isLoading, error } = useQuery({
    queryKey: ['attendance'],
    queryFn: attendanceApi.getAll,
  });

  const filtered = attendanceList.filter((a: any) => {
    const name = a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : 'Unknown';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  if (error) {
    return (
      <div className="p-8 text-center text-red-400">
        <p>Failed to load attendance records. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumbs />
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Attendance</h1>
          <p className="mt-1 text-xs text-slate-400">Track employee check-ins and work hours</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCheckInOpen(true)}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm shadow-emerald-600/30 transition-all"
          >
            <Clock className="w-3.5 h-3.5" /> Check In / Out
          </button>
        </div>
      </div>

      {/* Quick Check-in Card */}
      <div className="bg-gradient-to-r from-slate-900/90 to-slate-800/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Today's Attendance</p>
            <p className="text-xs text-slate-400 mt-0.5">{formatDate(new Date().toISOString())}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-xs text-slate-500">Checked In</p>
            <p className="text-sm font-bold text-white">--:--</p>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <button className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-sm shadow-rose-600/30">
            Check Out
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search employees…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-lg bg-slate-900/60 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-sm">Loading attendance...</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/30">
                <th className="py-3 px-4 font-semibold text-slate-300">Employee</th>
                <th className="py-3 px-4 font-semibold text-slate-300">Date</th>
                <th className="py-3 px-4 font-semibold text-slate-300">Check In</th>
                <th className="py-3 px-4 font-semibold text-slate-300">Check Out</th>
                <th className="py-3 px-4 font-semibold text-slate-300">Hours</th>
                <th className="py-3 px-4 font-semibold text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">No attendance records found</td>
                </tr>
              ) : (
                filtered.map((att: any) => {
                  const empName = att.employee ? `${att.employee.firstName} ${att.employee.lastName}` : 'Unknown';
                  const initials = att.employee ? `${att.employee.firstName?.charAt(0) || ''}${att.employee.lastName?.charAt(0) || ''}`.toUpperCase() : '?';
                  return (
                    <tr
                      key={att.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => router.push(`/attendance/${att.id}`)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500/20 to-brand-600/30 border border-brand-500/20 flex items-center justify-center text-[10px] font-bold text-brand-300 shrink-0">
                            {initials}
                          </div>
                          <span className="font-medium text-white">{empName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{formatDate(att.date)}</td>
                      <td className="py-3.5 px-4 text-slate-300">{att.checkIn ?? '—'}</td>
                      <td className="py-3.5 px-4 text-slate-300">{att.checkOut ?? '—'}</td>
                      <td className="py-3.5 px-4 text-slate-300">{att.workedHours ? `${att.workedHours}h` : '—'}</td>
                      <td className="py-3.5 px-4"><Badge status={att.status || 'PRESENT'} /></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
