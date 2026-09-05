'use client';
import React, { useState } from 'react';
import { Plus, Clock, CalendarDays } from 'lucide-react';
import { Breadcrumbs } from '../../../components/layout/breadcrumbs';
import { StatusBadge } from '../../../components/ui/status-badge';
import { EmptyState } from '../../../components/shared/empty-state';
import { MOCK_SCHEDULES } from '../../../lib/mock-data';
import type { WorkingSchedule, DayOfWeek } from '../../../lib/types';

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
  friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
};

function ScheduleDayGrid({ schedule }: { schedule: WorkingSchedule }) {
  return (
    <div className="flex gap-1.5 mt-3">
      {DAYS.map((day) => {
        const dayData = schedule.days.find((d) => d.day === day);
        const isWork = dayData?.isWorkDay ?? false;
        const isWeekend = day === 'saturday' || day === 'sunday';
        return (
          <div key={day} className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-medium text-slate-500">{DAY_LABELS[day]}</span>
            <div
              title={isWork ? `${dayData?.startTime ?? ''}–${dayData?.endTime ?? ''} (${dayData?.hours ?? 0}h)` : 'Off'}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-semibold transition-all ${
                isWork
                  ? isWeekend
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                  : 'bg-slate-800/50 text-slate-700 border border-slate-800'
              }`}
            >
              {isWork ? `${dayData?.hours ?? '?'}h` : '—'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function SchedulesPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedSchedule = MOCK_SCHEDULES.find((s) => s.id === selected);

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumbs />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Working Schedules</h1>
          <p className="mt-1 text-xs text-slate-500">Define working hours and days for your organisation</p>
        </div>
        <button className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all">
          <Plus className="w-3.5 h-3.5" /> New Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_SCHEDULES.map((schedule) => (
          <div
            key={schedule.id}
            onClick={() => setSelected(selected === schedule.id ? null : schedule.id)}
            className={`bg-surface-card dark:bg-slate-900/80 border rounded-2xl p-5 cursor-pointer transition-all ${
              selected === schedule.id
                ? 'border-brand-500/50 ring-1 ring-brand-500/30'
                : 'border-surface-border dark:border-slate-800 hover:border-slate-600 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-brand-400 shrink-0" />
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{schedule.name}</h2>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {schedule.hoursPerWeek}h/week
                  </span>
                  <span className="capitalize">{schedule.type}</span>
                  <span>{schedule.timezone}</span>
                </div>
              </div>
              <StatusBadge status={schedule.status} />
            </div>

            <ScheduleDayGrid schedule={schedule} />

            {selected === schedule.id && (
              <div className="mt-4 pt-4 border-t border-surface-border dark:border-slate-800 animate-slide-up">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Detail</p>
                <div className="space-y-1.5">
                  {schedule.days.filter((d) => d.isWorkDay).map((d) => (
                    <div key={d.day} className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 capitalize w-20">{d.day}</span>
                      <span className="text-slate-400">{d.startTime} – {d.endTime}</span>
                      <span className="text-slate-300 font-medium">{d.hours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {MOCK_SCHEDULES.length === 0 && (
        <EmptyState icon={CalendarDays} title="No schedules yet" description="Create a working schedule to assign to employees." />
      )}
    </div>
  );
}
