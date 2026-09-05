'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, LayoutDashboard, Users, FileText, Clock,
  Umbrella, Banknote, BarChart3, Settings, ArrowRight,
  User, CalendarClock,
} from 'lucide-react';
import { MOCK_EMPLOYEES } from '../../lib/mock-data';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const QUICK_LINKS = [
  { label: 'Dashboard',            href: '/dashboard',              icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Employees',            href: '/employees',              icon: <Users className="w-4 h-4" /> },
  { label: 'New Employee',         href: '/employees/new',          icon: <User className="w-4 h-4" /> },
  { label: 'Contracts',            href: '/contracts',              icon: <FileText className="w-4 h-4" /> },
  { label: 'Attendance',           href: '/attendance',             icon: <CalendarClock className="w-4 h-4" /> },
  { label: 'Time Off Requests',    href: '/time-off',               icon: <Umbrella className="w-4 h-4" /> },
  { label: 'Payruns',              href: '/payroll',                icon: <Banknote className="w-4 h-4" /> },
  { label: 'Payslips',             href: '/payroll/payslips',       icon: <Banknote className="w-4 h-4" /> },
  { label: 'Salary Structures',    href: '/payroll/salary-structures', icon: <Banknote className="w-4 h-4" /> },
  { label: 'Analytics',            href: '/analytics',              icon: <BarChart3 className="w-4 h-4" /> },
  { label: 'Settings',             href: '/settings',               icon: <Settings className="w-4 h-4" /> },
];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [open]);

  const filteredLinks = QUICK_LINKS.filter((l) =>
    l.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEmployees = MOCK_EMPLOYEES.filter(
    (e) =>
      query.length > 1 &&
      (e.fullName.toLowerCase().includes(query.toLowerCase()) ||
        e.workEmail.toLowerCase().includes(query.toLowerCase()) ||
        e.department.toLowerCase().includes(query.toLowerCase()))
  );

  const navigate = (href: string) => {
    router.push(href);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-card animate-scale-in overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search screens, employees, modules…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm text-white placeholder-slate-500 bg-transparent focus:outline-none"
            id="command-palette-input"
          />
          <kbd className="hidden sm:flex items-center text-[10px] text-slate-600 font-mono border border-slate-800 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {filteredEmployees.length > 0 && (
            <div className="py-2">
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Employees</p>
              {filteredEmployees.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500/30 to-brand-600/30 border border-brand-500/20 flex items-center justify-center text-xs text-brand-300 font-bold shrink-0">
                    {emp.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{emp.fullName}</p>
                    <p className="text-[10px] text-slate-500 truncate">{emp.department} · {emp.jobPosition}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 ml-auto shrink-0" />
                </button>
              ))}
            </div>
          )}

          {filteredLinks.length > 0 && (
            <div className="py-2">
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Navigation</p>
              {filteredLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <span className="text-slate-500">{link.icon}</span>
                  <span className="text-xs">{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 ml-auto" />
                </button>
              ))}
            </div>
          )}

          {query.length > 1 && filteredLinks.length === 0 && filteredEmployees.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-sm">No results found</div>
          )}

          {query.length === 0 && (
            <div className="py-2">
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Quick Links</p>
              {QUICK_LINKS.slice(0, 6).map((link) => (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <span className="text-slate-500">{link.icon}</span>
                  {link.label}
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 ml-auto" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-800 px-4 py-2.5 flex items-center gap-4 text-[10px] text-slate-600">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  );
}
