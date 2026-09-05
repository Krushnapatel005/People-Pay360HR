'use client';
import React, { useState } from 'react';
import { Search, Bell, HelpCircle, Sun, Moon, ChevronDown, LogOut, User, Settings, Shield } from 'lucide-react';

interface TopbarProps {
  onSearchOpen: () => void;
  onNotificationsOpen: () => void;
  role: string;
  onRoleChange: (role: string) => void;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

const ROLES = [
  { id: 'employee',      label: 'Employee',       color: 'text-blue-400' },
  { id: 'hr_manager',   label: 'HR Manager',      color: 'text-emerald-400' },
  { id: 'payroll_admin', label: 'Payroll Admin',  color: 'text-amber-400' },
  { id: 'admin',         label: 'Admin',          color: 'text-violet-400' },
];

export function Topbar({ onSearchOpen, onNotificationsOpen, role, onRoleChange, theme, onThemeToggle }: TopbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const currentRole = ROLES.find((r) => r.id === role) ?? ROLES[2];

  return (
    <header className="h-[60px] flex items-center justify-between px-5 border-b border-slate-800 bg-surface-card/80 dark:bg-slate-900/80 backdrop-blur shrink-0">
      {/* Left: Search trigger */}
      <div className="flex items-center gap-3">
        <button
          id="global-search-trigger"
          onClick={onSearchOpen}
          className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-300 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all group w-56"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-slate-600 group-hover:text-slate-400 font-mono">
            <span>⌘</span><span>K</span>
          </kbd>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Role switcher (preview only) */}
        <div className="relative">
          <button
            id="role-switcher-btn"
            onClick={() => setRoleOpen((v) => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className={currentRole.color}>{currentRole.label}</span>
            <ChevronDown className="w-3 h-3 text-slate-600" />
          </button>

          {roleOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-card animate-scale-in overflow-hidden">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Preview as Role</p>
              </div>
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => { onRoleChange(r.id); setRoleOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-slate-800 transition-colors ${
                    role === r.id ? 'bg-slate-800/60' : ''
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${role === r.id ? 'bg-brand-500' : 'bg-slate-700'}`} />
                  <span className={role === r.id ? r.color : 'text-slate-400'}>{r.label}</span>
                </button>
              ))}
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
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-800 mx-1" />

        {/* Profile */}
        <div className="relative">
          <button
            id="profile-menu-btn"
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-[10px] font-bold ring-1 ring-white/10">
              AM
            </div>
            <div className="hidden sm:block text-left min-w-0">
              <p className="text-xs font-medium text-white truncate max-w-[100px]">Aarav Mehta</p>
              <p className="text-[10px] text-slate-500 truncate">Admin</p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-600 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-card animate-scale-in overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800">
                <p className="text-sm font-semibold text-white">Aarav Mehta</p>
                <p className="text-xs text-slate-500 mt-0.5">aarav.mehta@peoplepay360.com</p>
              </div>
              {[
                { icon: <User className="w-3.5 h-3.5" />, label: 'My Profile', href: '/employees/emp-001' },
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
                  onClick={() => setProfileOpen(false)}
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
