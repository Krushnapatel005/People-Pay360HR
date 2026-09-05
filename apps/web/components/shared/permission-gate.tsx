'use client';
import React from 'react';
import { Lock } from 'lucide-react';
import type { Permission } from '../../lib/context/role-context';
import { useRole } from '../../lib/context/role-context';

interface PermissionGateProps {
  /** If the current role has any of these permissions, show children */
  allow?: Permission[];
  /** If the current role matches any of these role IDs, show children */
  roles?: string[];
  /** What to render when access is denied. Defaults to a subtle locked placeholder */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGate({ allow, roles, fallback, children }: PermissionGateProps) {
  const { role, can } = useRole();

  const hasAccess =
    (allow && allow.some((p) => can(p))) ||
    (roles && roles.includes(role));

  if (hasAccess) return <>{children}</>;

  if (fallback !== undefined) return <>{fallback}</>;

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-500 text-xs cursor-not-allowed select-none">
      <Lock className="w-3 h-3" />
      <span>Restricted</span>
    </div>
  );
}

/** Wrap a whole section — renders a full-page access denied if not permitted */
export function PageGate({ allow, roles, children }: Omit<PermissionGateProps, 'fallback'>) {
  const { role, can, label } = useRole();

  const hasAccess =
    (allow && allow.some((p) => can(p))) ||
    (roles && roles.includes(role));

  if (hasAccess) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-5">
        <Lock className="w-7 h-7 text-slate-500" />
      </div>
      <h2 className="text-lg font-bold text-white mb-2">Access Restricted</h2>
      <p className="text-sm text-slate-400 max-w-sm">
        Your current role <span className="font-medium text-white">{label}</span> does not have
        permission to view this page.
      </p>
      <p className="text-xs text-slate-600 mt-3">
        Switch roles using the role switcher in the top bar to preview access.
      </p>
    </div>
  );
}
