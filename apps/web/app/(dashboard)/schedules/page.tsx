'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, List } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Breadcrumbs } from '../../../components/layout/breadcrumbs';
import { MOCK_WORKING_SCHEDULES } from '../../../lib/mock-data';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function SchedulesPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Working Schedules</h1>
          <p className="mt-1 text-xs text-slate-400">Define work week patterns for your employees</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-lg" role="tablist">
            <button onClick={() => setView('list')} className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${view === 'list' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}>
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button onClick={() => setView('calendar')} className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${view === 'calendar' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}>
              <Calendar className="w-3.5 h-3.5" /> Calendar
            </button>
          </div>
          <Link href="/schedules/new" className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-brand-sm transition-all">
            + New Schedule
          </Link>
        </div>
      </div>

      {view === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MOCK_WORKING_SCHEDULES.map((ws) => (
            <Link key={ws.id} href={`/schedules/${ws.id}`} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-brand-500/30 transition-all group">
              <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">{ws.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{ws.hoursPerWeek}h/week · {ws.timezone}</p>
                </div>
                <Badge status={ws.status} />
              </div>
              <div className="px-5 py-4">
                <div className="grid grid-cols-7 gap-1">
                  {DAYS.map((day, i) => {
                    const dayData = ws.days[i];
                    return (
                      <div key={day} className={`flex flex-col items-center gap-1.5 p-2 rounded-lg ${dayData?.isWorkDay ? 'bg-brand-500/10 border border-brand-500/20' : 'bg-slate-800/40 border border-slate-800'}`}>
                        <span className={`text-[10px] font-semibold ${dayData?.isWorkDay ? 'text-brand-300' : 'text-slate-600'}`}>{day}</span>
                        <span className={`text-[9px] ${dayData?.isWorkDay ? 'text-brand-400' : 'text-slate-700'}`}>{dayData?.isWorkDay ? `${dayData.hours}h` : '—'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {view === 'calendar' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-white">Weekly Calendar View</h2>
          </div>
          <div className="p-5 overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 min-w-[700px]">
              {DAYS.map((day) => (
                <div key={day} className="flex flex-col gap-2">
                  <div className="text-center text-xs font-semibold text-slate-400 py-2">{day}</div>
                  {MOCK_WORKING_SCHEDULES.map((ws) => {
                    const dayKey = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'][DAYS.indexOf(day)];
                    const dayData = ws.days.find((d) => d.day === dayKey);
                    return dayData?.isWorkDay ? (
                      <div key={ws.id} className="bg-brand-500/10 border border-brand-500/20 rounded-lg p-2.5 text-center">
                        <p className="text-[10px] font-semibold text-brand-300 truncate">{ws.name}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">{dayData.startTime}–{dayData.endTime}</p>
                      </div>
                    ) : (
                      <div key={ws.id} className="bg-slate-800/20 border border-slate-800 rounded-lg p-2.5 text-center">
                        <p className="text-[10px] text-slate-700">Off</p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
