'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const LABEL_MAP: Record<string, string> = {
  dashboard: 'Dashboard',
  employees: 'Employees',
  contracts: 'Contracts',
  schedules: 'Working Schedules',
  attendance: 'Attendance',
  'time-off': 'Time Off',
  types: 'Types',
  allocations: 'Allocations',
  payroll: 'Payroll',
  payslips: 'Payslips',
  'salary-structures': 'Salary Structures',
  'salary-rules': 'Salary Rules',
  analytics: 'Analytics',
  users: 'Users',
  settings: 'Settings',
  new: 'New',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    const isId = /^[a-z0-9_-]{6,}$/.test(seg) && !LABEL_MAP[seg];
    const label = LABEL_MAP[seg] ?? (isId ? 'Detail' : seg);
    return { href, label, isLast: i === segments.length - 1 };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
      <Link href="/dashboard" className="hover:text-slate-300 transition-colors">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {crumbs.map((crumb, i) => (
        <React.Fragment key={i}>
          <ChevronRight className="w-3 h-3 text-slate-700" />
          {crumb.isLast ? (
            <span className="text-slate-300 font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-slate-300 transition-colors">
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
