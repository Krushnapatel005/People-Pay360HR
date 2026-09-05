'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import {
  ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, Building2,
  FileText, CalendarClock, Umbrella, DollarSign, FolderOpen, Activity, Edit3,
} from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { Tabs } from '../../../../components/ui/tabs';
import { Breadcrumbs } from '../../../../components/layout/breadcrumbs';
import { MOCK_EMPLOYEES, getContractsByEmployee, getAttendanceByEmployee, getTimeOffRequestsByEmployee, getLeaveAllocationsByEmployee, getPayslipsByEmployee } from '../../../../lib/mock-data';
import { formatDate, formatCurrency } from '../../../../lib/utils';

const PROFILE_TABS = [
  { id: 'overview',    label: 'Overview' },
  { id: 'contracts',  label: 'Contracts' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'time-off',   label: 'Time Off' },
  { id: 'allocations',label: 'Allocations' },
  { id: 'documents',  label: 'Documents' },
  { id: 'activity',   label: 'Activity' },
];

export default function EmployeeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('overview');
  const emp = MOCK_EMPLOYEES.find((e) => e.id === id) ?? MOCK_EMPLOYEES[0];
  const contracts  = getContractsByEmployee(id);
  const attendance = getAttendanceByEmployee(id);
  const timeOff    = getTimeOffRequestsByEmployee(id);
  const allocations = getLeaveAllocationsByEmployee(id);
  const payslips   = getPayslipsByEmployee(id);

  return (
    <div className="space-y-5 animate-fade-in max-w-6xl">
      <Breadcrumbs />

      {/* Back */}
      <Link href="/employees" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-200 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Employees
      </Link>

      {/* Profile Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Header band */}
        <div className="h-16 bg-gradient-to-r from-brand-600/20 via-brand-500/10 to-transparent" />
        <div className="px-6 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-8">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 border-4 border-slate-900 flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-lg">
              {emp.initials}
            </div>
            <div className="flex-1 min-w-0 pt-2 sm:pt-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-white">{emp.fullName}</h1>
                <Badge status={emp.status} />
              </div>
              <p className="text-sm text-slate-400 mt-0.5">{emp.jobPosition} · {emp.department}</p>
              <p className="text-xs text-slate-600 mt-0.5">{emp.employeeRef}</p>
            </div>
            <Link
              href={`/employees/${id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </Link>
          </div>

          {/* Quick info row */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs text-slate-400">
            {emp.workEmail && (
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-500" />{emp.workEmail}</span>
            )}
            {emp.workPhone && (
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-500" />{emp.workPhone}</span>
            )}
            {emp.workLocation && (
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" />{emp.workLocation}</span>
            )}
            {emp.hireDate && (
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-500" />Joined {formatDate(emp.hireDate)}</span>
            )}
            {emp.managerName && (
              <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-slate-500" />Reports to {emp.managerName}</span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={PROFILE_TABS} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div className="animate-slide-up">

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Personal Info */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-brand-400" />
                <h2 className="text-sm font-semibold text-white">Work Information</h2>
              </div>
              <div className="px-5 py-4 space-y-3">
                {[
                  { label: 'Job Position',     value: emp.jobPosition },
                  { label: 'Job Title',        value: emp.jobTitle },
                  { label: 'Department',       value: emp.department },
                  { label: 'Work Schedule',    value: emp.workScheduleName },
                  { label: 'Salary Structure', value: emp.salaryStructureName },
                  { label: 'Work Location',    value: emp.workLocation },
                ].map(({ label, value }) => value && (
                  <div key={label} className="flex items-start justify-between gap-4 text-xs">
                    <span className="text-slate-500 shrink-0">{label}</span>
                    <span className="text-slate-200 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-brand-400" />
                <h2 className="text-sm font-semibold text-white">Personal Details</h2>
              </div>
              <div className="px-5 py-4 space-y-3">
                {[
                  { label: 'Date of Birth',    value: emp.dateOfBirth ? formatDate(emp.dateOfBirth) : undefined },
                  { label: 'Gender',           value: emp.gender },
                  { label: 'Marital Status',   value: emp.maritalStatus },
                  { label: 'Nationality',      value: emp.nationality },
                  { label: 'Personal Email',   value: emp.personalEmail },
                  { label: 'Mobile',           value: emp.personalPhone },
                ].map(({ label, value }) => value && (
                  <div key={label} className="flex items-start justify-between gap-4 text-xs">
                    <span className="text-slate-500 shrink-0">{label}</span>
                    <span className="text-slate-200 text-right capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contracts */}
        {activeTab === 'contracts' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white">Contracts</h2>
              <Link href="/contracts/new" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">+ New Contract</Link>
            </div>
            {contracts.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">No contracts found</div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {contracts.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-slate-800/30 transition-colors">
                    <div>
                      <p className="text-xs font-medium text-white">{c.ref}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{c.contractType.replace('_', ' ')} · {formatDate(c.startDate)} {c.endDate ? `– ${formatDate(c.endDate)}` : '(Open)'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-white">{formatCurrency(c.wage)}/mo</p>
                      <Badge status={c.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Attendance */}
        {activeTab === 'attendance' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white">Attendance Records</h2>
            </div>
            {attendance.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">No attendance records</div>
            ) : (
              <table className="w-full text-xs">
                <thead className="border-b border-slate-800 bg-slate-800/30">
                  <tr>
                    <th className="py-3 px-5 text-left font-semibold text-slate-300">Date</th>
                    <th className="py-3 px-5 text-left font-semibold text-slate-300">Check In</th>
                    <th className="py-3 px-5 text-left font-semibold text-slate-300">Check Out</th>
                    <th className="py-3 px-5 text-left font-semibold text-slate-300">Hours</th>
                    <th className="py-3 px-5 text-left font-semibold text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {attendance.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-5 text-slate-300">{formatDate(a.date)}</td>
                      <td className="py-3 px-5 text-slate-400">{a.checkIn ?? '—'}</td>
                      <td className="py-3 px-5 text-slate-400">{a.checkOut ?? '—'}</td>
                      <td className="py-3 px-5 text-slate-300">{a.workedHours ? `${a.workedHours}h` : '—'}</td>
                      <td className="py-3 px-5"><Badge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Time Off */}
        {activeTab === 'time-off' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white">Time Off Requests</h2>
              <Link href="/time-off/new" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">+ New Request</Link>
            </div>
            {timeOff.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">No time off requests</div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {timeOff.map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div>
                      <p className="text-xs font-medium text-white">{r.timeOffTypeName}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{formatDate(r.startDate)} – {formatDate(r.endDate)} · {r.days} day(s)</p>
                    </div>
                    <Badge status={r.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Allocations */}
        {activeTab === 'allocations' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white">Leave Allocations</h2>
            </div>
            {allocations.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">No allocations</div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {allocations.map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div>
                      <p className="text-xs font-medium text-white">{a.timeOffTypeName}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{formatDate(a.dateFrom)} – {formatDate(a.dateTo)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{a.numberOfDays} days</p>
                      <Badge status={a.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Documents */}
        {activeTab === 'documents' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center">
            <FolderOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">Document management will be implemented in a future release.</p>
          </div>
        )}

        {/* Activity */}
        {activeTab === 'activity' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-white">Activity Log</h2>
            </div>
            <div className="p-5 space-y-4">
              {[
                { time: '2026-09-02T10:00:00Z', text: 'Aarav Mehta submitted a Time Off Request (TOR/2026/0082)', icon: <Umbrella className="w-3.5 h-3.5 text-amber-400" /> },
                { time: '2026-09-01T08:00:00Z', text: 'Payslip SLIP/2026/0042 (August 2026) marked as Paid', icon: <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> },
                { time: '2026-08-28T09:30:00Z', text: 'Profile updated — Work Location changed to Bengaluru HQ', icon: <Edit3 className="w-3.5 h-3.5 text-brand-400" /> },
              ].map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    {event.icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-300">{event.text}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{formatDate(event.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
