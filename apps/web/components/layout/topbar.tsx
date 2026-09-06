'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, HelpCircle, Sun, Moon, ChevronDown, LogOut, User, Settings, Shield, Menu } from 'lucide-react';
import { useRole, ROLE_LABELS, ROLE_COLORS } from '../../lib/context/role-context';
import { useAuth } from '../../lib/context/auth-context';
import type { Role } from '../../lib/types';

const ROLES: { id: Role; label: string; color: string }[] = [
  { id: 'employee',       label: 'Employee',       color: ROLE_COLORS.employee },
  { id: 'hr_manager',     label: 'HR Manager',     color: ROLE_COLORS.hr_manager },
  { id: 'time_off_admin', label: 'Time Off Admin', color: ROLE_COLORS.time_off_admin },
  { id: 'payroll_user',   label: 'Payroll User',   color: ROLE_COLORS.payroll_user },
  { id: 'payroll_admin',  label: 'Payroll Admin',  color: ROLE_COLORS.payroll_admin },
  { id: 'admin',          label: 'Admin',          color: ROLE_COLORS.admin },
];

interface TopbarProps {
  onSearchOpen: () => void;
  onNotificationsOpen: () => void;
  onMobileMenuOpen: () => void;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

export function Topbar({ onSearchOpen, onNotificationsOpen, onMobileMenuOpen, theme, onThemeToggle }: TopbarProps) {
  const { role, color } = useRole();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = user?.fullName ?? user?.email ?? 'User';
  const displayInitials = user?.initials ?? '??';
  const displayEmail = user?.email ?? '';
  const employeeHref = user?.employeeId ? `/employees/${user.employeeId}` : '/employees';

  const currentRole = ROLES.find((r) => r.id === role) ?? ROLES[0];

  // Click outside to close dropdowns
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-[60px] flex items-center justify-between px-4 sm:px-5 border-b border-surface-border dark:border-slate-800 bg-[var(--bg-header)] backdrop-blur shrink-0">
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile hamburger */}
        <button
          id="mobile-menu-btn"
          onClick={onMobileMenuOpen}
          className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <button
          id="global-search-trigger"
          onClick={onSearchOpen}
          className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-300 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all group w-40 sm:w-56"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-slate-600 group-hover:text-slate-400 font-mono">
            <span>⌘</span><span>K</span>
          </kbd>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Role switcher */}
        <div className="relative" ref={roleRef}>
          <button
            id="role-switcher-btn"
            onClick={() => setRoleOpen((v) => !v)}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
            aria-label="Switch preview role"
            aria-expanded={roleOpen}
          >
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span className={`hidden sm:inline ${color}`}>{currentRole.label}</span>
            <ChevronDown className={`w-3 h-3 text-slate-600 transition-transform ${roleOpen ? 'rotate-180' : ''}`} />
          </button>

          {roleOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-card animate-scale-in overflow-hidden">
              <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-2">
                <Shield className="w-3 h-3 text-slate-500" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Your Role</p>
              </div>
              <div className="px-3 py-3 text-xs text-slate-400">
                <span className={`font-medium ${color}`}>{currentRole.label}</span>
                <p className="mt-1 text-[10px] text-slate-600">Role is set by your account permissions.</p>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button
          id="help-btn"
          className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Help and documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          id="notifications-btn"
          onClick={onNotificationsOpen}
          className="relative p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-slate-900 animate-pulse" />
        </button>

        {/* Theme toggle */}
        <button
          id="theme-toggle-btn"
          onClick={onThemeToggle}
          className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-800 mx-0.5" />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            id="profile-menu-btn"
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 hover:bg-slate-800 rounded-lg transition-colors"
            aria-expanded={profileOpen}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-[10px] font-bold ring-1 ring-white/10 shrink-0">
              {displayInitials}
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <p className="text-xs font-medium text-white truncate max-w-[100px]">{displayName}</p>
              <p className={`text-[10px] truncate ${color}`}>{ROLE_LABELS[role]}</p>
            </div>
            <ChevronDown className={`w-3 h-3 text-slate-600 hidden sm:block transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-card animate-scale-in overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800">
                <p className="text-sm font-semibold text-white">{displayName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{displayEmail}</p>
                <p className={`text-[10px] mt-1 font-medium ${color}`}>{ROLE_LABELS[role]}</p>
              </div>
              {[
                { icon: <User className="w-3.5 h-3.5" />, label: 'My Profile', href: employeeHref },
                { icon: <Settings className="w-3.5 h-3.5" />, label: 'Settings', href: '/settings' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
              <div className="border-t border-slate-800 p-1">
                <button
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  onClick={() => { setProfileOpen(false); logout(); }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
