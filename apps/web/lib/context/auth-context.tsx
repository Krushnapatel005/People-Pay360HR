'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '../auth-api';
import type { Role } from '../types';

// ─── Backend → Frontend Role Mapping ─────────────────────────────────────────
// Maps the backend DB role codes to the frontend Role type
function backendRoleToFrontend(roleCode: string): Role {
  const map: Record<string, Role> = {
    EMPLOYEE: 'employee',
    HR_MANAGER: 'hr_manager',
    TIME_OFF_ADMIN: 'time_off_admin',
    HR_PAYROLL_USER: 'payroll_user',
    HR_PAYROLL_MANAGER: 'payroll_admin',
    ADMIN: 'admin',
  };
  return map[roleCode?.toUpperCase()] ?? 'employee';
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CurrentUser {
  id: string;
  email: string;
  status: string;
  employeeId?: string;
  role: Role;          // mapped from DB role code
  roleCode: string;    // raw DB role code e.g. "ADMIN"
  firstName?: string;
  lastName?: string;
  fullName?: string;
  initials?: string;
  department?: string;
  jobTitle?: string;
}

interface AuthContextValue {
  user: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

function buildCurrentUser(meResponse: any): CurrentUser | null {
  if (!meResponse?.user) return null;

  const { user } = meResponse;
  // The /auth/me endpoint returns the user with their roles array
  const roles: any[] = user.roles ?? [];
  const firstRole = roles[0]?.role;
  const roleCode: string = firstRole?.code ?? 'EMPLOYEE';
  const frontendRole = backendRoleToFrontend(roleCode);

  // Employee info — the backend includes user.employee via Prisma relation
  const emp = user.employee;
  const firstName = emp?.firstName ?? '';
  const lastName = emp?.lastName ?? '';
  const fullName = firstName && lastName
    ? `${firstName} ${lastName}`
    : user.email.split('@')[0];
  const initials = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  return {
    id: user.id,
    email: user.email,
    status: user.status,
    employeeId: user.employeeId ?? emp?.id,
    role: frontendRole,
    roleCode,
    firstName,
    lastName,
    fullName,
    initials,
    department: emp?.department,
    jobTitle: emp?.jobTitle ?? emp?.jobPosition,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  const refresh = useCallback(async () => {
    try {
      const me = await authApi.getMe();
      setUser(buildCurrentUser(me));
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On mount, try to restore session from the server cookie
  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    // Call the real backend — sets the HTTP-only cookie
    await authApi.login({ email, password });
    // Now fetch the current user to populate auth state
    const me = await authApi.getMe();
    const currentUser = buildCurrentUser(me);
    setUser(currentUser);
    // Redirect to dashboard
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch { /* ignore */ }
    setUser(null);
    // Clear the entire React Query cache to prevent the previous user's
    // data from being shown to the next user who logs in on the same browser.
    queryClient.clear();
    router.push('/login');
  }, [router, queryClient]);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      logout,
      refresh,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
