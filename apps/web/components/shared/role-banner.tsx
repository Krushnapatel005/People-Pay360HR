'use client';
import React from 'react';
import { Shield } from 'lucide-react';
import { useRole, ROLE_LABELS, ROLE_COLORS } from '../../lib/context/role-context';
import type { Role } from '../../lib/types';

const ROLES: Role[] = ['employee', 'hr_manager', 'time_off_admin', 'payroll_user', 'payroll_admin', 'admin'];

export function RoleBanner() {
  const { role, setRole, color, bg } = useRole();

  return (
    <div className={`fixed bottom-4 right-4 z-[300] flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border ${bg} shadow-lg backdrop-blur-sm no-print`}>
      <Shield className={`w-3.5 h-3.5 shrink-0 ${color}`} />
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-400">Previewing as</span>
        <span className={`font-semibold ${color}`}>{ROLE_LABELS[role]}</span>
      </div>
      <div className="w-px h-4 bg-slate-600 mx-0.5" />
      <div className="flex items-center gap-1">
        {ROLES.map((r) => (
          <button
            key={r}
            title={ROLE_LABELS[r]}
            onClick={() => setRole(r)}
            className={`w-2 h-2 rounded-full transition-all duration-150 ${
              r === role
                ? `${color.replace('text-', 'bg-')} scale-125`
                : 'bg-slate-600 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
