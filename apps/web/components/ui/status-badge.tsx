import React from 'react';
import {
  CheckCircle2, Clock, XCircle, AlertTriangle, MinusCircle,
  UserCheck, UserX, CalendarX, Shield, Pause, Ban,
  ArrowRight, CreditCard, Play, Check,
} from 'lucide-react';

type AnyStatus = string;

interface StatusConfig {
  label: string;
  icon: React.ReactNode;
  className: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  // Employee
  active:        { label: 'Active',        icon: <CheckCircle2 className="w-3 h-3" />,    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  on_leave:      { label: 'On Leave',      icon: <Pause className="w-3 h-3" />,            className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  terminated:    { label: 'Terminated',    icon: <UserX className="w-3 h-3" />,            className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  probation:     { label: 'Probation',     icon: <UserCheck className="w-3 h-3" />,        className: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  // Contract
  draft:         { label: 'Draft',         icon: <Clock className="w-3 h-3" />,            className: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  computed:      { label: 'Computed',      icon: <Play className="w-3 h-3" />,             className: 'bg-brand-500/10 text-brand-400 border-brand-500/20' },
  validated:     { label: 'Validated',     icon: <Check className="w-3 h-3" />,            className: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  paid:          { label: 'Paid',          icon: <CreditCard className="w-3 h-3" />,       className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  expired:       { label: 'Expired',       icon: <CalendarX className="w-3 h-3" />,        className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  cancelled:     { label: 'Cancelled',     icon: <Ban className="w-3 h-3" />,              className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  // Attendance
  present:       { label: 'Present',       icon: <CheckCircle2 className="w-3 h-3" />,    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  absent:        { label: 'Absent',        icon: <XCircle className="w-3 h-3" />,          className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  partial:       { label: 'Partial',       icon: <MinusCircle className="w-3 h-3" />,      className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  approved_leave:{ label: 'On Leave',      icon: <CalendarX className="w-3 h-3" />,        className: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  // Leave
  pending:       { label: 'Pending',       icon: <Clock className="w-3 h-3" />,            className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  approved:      { label: 'Approved',      icon: <CheckCircle2 className="w-3 h-3" />,    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  rejected:      { label: 'Rejected',      icon: <XCircle className="w-3 h-3" />,          className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  // General
  inactive:      { label: 'Inactive',      icon: <MinusCircle className="w-3 h-3" />,      className: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  archived:      { label: 'Archived',      icon: <MinusCircle className="w-3 h-3" />,      className: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  warning:       { label: 'Warning',       icon: <AlertTriangle className="w-3 h-3" />,    className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  error:         { label: 'Error',         icon: <XCircle className="w-3 h-3" />,          className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  ok:            { label: 'OK',            icon: <CheckCircle2 className="w-3 h-3" />,    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  restricted:    { label: 'Restricted',    icon: <Shield className="w-3 h-3" />,           className: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  full_time:     { label: 'Full Time',     icon: <ArrowRight className="w-3 h-3" />,       className: 'bg-brand-500/10 text-brand-400 border-brand-500/20' },
  fixed_term:    { label: 'Fixed Term',    icon: <ArrowRight className="w-3 h-3" />,       className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  internship:    { label: 'Internship',    icon: <ArrowRight className="w-3 h-3" />,       className: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
};

interface StatusBadgeProps {
  status: AnyStatus;
  /** Show icon+text (default) or just text */
  variant?: 'full' | 'text' | 'dot';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, variant = 'full', size = 'sm' }: StatusBadgeProps) {
  const config = STATUS_MAP[status] ?? {
    label: status.replace(/_/g, ' '),
    icon: <MinusCircle className="w-3 h-3" />,
    className: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  if (variant === 'dot') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium ${config.className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {config.label}
      </span>
    );
  }

  if (variant === 'text') {
    return (
      <span className={`text-xs font-medium ${config.className.split(' ').filter(c => c.startsWith('text-')).join(' ')}`}>
        {config.label}
      </span>
    );
  }

  const sizeClass = size === 'md'
    ? 'px-2.5 py-1 text-xs gap-1.5'
    : 'px-2 py-0.5 text-[11px] gap-1';

  return (
    <span className={`inline-flex items-center ${sizeClass} rounded-full border font-medium ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
}
