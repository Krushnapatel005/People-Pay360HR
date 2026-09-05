'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Role } from '../types';

// ─── Permission Map ───────────────────────────────────────────────────────────

export const ROLE_LABELS: Record<Role, string> = {
  employee:       'Employee',
  hr_manager:     'HR Manager',
  time_off_admin: 'Time Off Admin',
  payroll_user:   'Payroll User',
  payroll_admin:  'Payroll Admin',
  admin:          'Admin',
};

export const ROLE_COLORS: Record<Role, string> = {
  employee:       'text-blue-400',
  hr_manager:     'text-emerald-400',
  time_off_admin: 'text-cyan-400',
  payroll_user:   'text-amber-400',
  payroll_admin:  'text-orange-400',
  admin:          'text-violet-400',
};

export const ROLE_BG: Record<Role, string> = {
  employee:       'bg-blue-500/10 border-blue-500/20',
  hr_manager:     'bg-emerald-500/10 border-emerald-500/20',
  time_off_admin: 'bg-cyan-500/10 border-cyan-500/20',
  payroll_user:   'bg-amber-500/10 border-amber-500/20',
  payroll_admin:  'bg-orange-500/10 border-orange-500/20',
  admin:          'bg-violet-500/10 border-violet-500/20',
};

// Nav sections visible per role
export const ROLE_NAV_ACCESS: Record<Role, string[]> = {
  employee:       ['dashboard', 'attendance', 'time-off-requests', 'payroll-payslips'],
  hr_manager:     ['dashboard', 'employees', 'contracts', 'attendance', 'time-off'],
  time_off_admin: ['dashboard', 'time-off'],
  payroll_user:   ['dashboard', 'payroll-payruns', 'payroll-payslips'],
  payroll_admin:  ['dashboard', 'payroll'],
  admin:          ['dashboard', 'employees', 'contracts', 'attendance', 'time-off', 'payroll', 'analytics', 'users', 'settings'],
};

// Actions gated by role
export type Permission =
  | 'employee.create'
  | 'employee.edit'
  | 'employee.archive'
  | 'contract.create'
  | 'contract.edit'
  | 'timeoff.approve'
  | 'timeoff.reject'
  | 'timeoff.allocate'
  | 'payroll.compute'
  | 'payroll.validate'
  | 'payroll.mark_paid'
  | 'payroll.configure_salary'
  | 'payroll.send_payslip'
  | 'user.manage'
  | 'settings.manage'
  | 'analytics.view';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  employee: [],
  hr_manager: [
    'employee.create','employee.edit','employee.archive',
    'contract.create','contract.edit',
    'timeoff.approve','timeoff.reject','timeoff.allocate',
    'analytics.view',
  ],
  time_off_admin: [
    'timeoff.approve','timeoff.reject','timeoff.allocate',
  ],
  payroll_user: [
    'payroll.compute',
    'analytics.view',
  ],
  payroll_admin: [
    'payroll.compute','payroll.validate','payroll.mark_paid',
    'payroll.configure_salary','payroll.send_payslip',
    'analytics.view',
  ],
  admin: [
    'employee.create','employee.edit','employee.archive',
    'contract.create','contract.edit',
    'timeoff.approve','timeoff.reject','timeoff.allocate',
    'payroll.compute','payroll.validate','payroll.mark_paid',
    'payroll.configure_salary','payroll.send_payslip',
    'user.manage','settings.manage','analytics.view',
  ],
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
  can: (permission: Permission) => boolean;
  hasNavAccess: (navId: string) => boolean;
  label: string;
  color: string;
  bg: string;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>('admin');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pp360_role') as Role | null;
      if (saved && ROLE_LABELS[saved]) setRoleState(saved);
    } catch {}
  }, []);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    try { localStorage.setItem('pp360_role', r); } catch {}
  }, []);

  const can = useCallback(
    (permission: Permission) => ROLE_PERMISSIONS[role].includes(permission),
    [role]
  );

  const hasNavAccess = useCallback(
    (navId: string) => ROLE_NAV_ACCESS[role].includes(navId),
    [role]
  );

  return (
    <RoleContext.Provider value={{
      role, setRole, can, hasNavAccess,
      label: ROLE_LABELS[role],
      color: ROLE_COLORS[role],
      bg:    ROLE_BG[role],
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used inside RoleProvider');
  return ctx;
}
