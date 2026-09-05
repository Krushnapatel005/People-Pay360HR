'use client';
import React, { useState, useEffect } from 'react';
import { Sidebar } from '../layout/sidebar';
import { Topbar } from '../layout/topbar';
import { CommandPalette } from '../shared/command-palette';
import { NotificationsPanel } from '../shared/notifications-panel';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [role, setRole] = useState('admin');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Keyboard shortcut Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
      if (e.key === 'Escape') {
        setCommandOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          onSearchOpen={() => setCommandOpen(true)}
          onNotificationsOpen={() => setNotificationsOpen((v) => !v)}
          role={role}
          onRoleChange={setRole}
          theme={theme}
          onThemeToggle={toggleTheme}
        />

        <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-7">
          {children}
        </main>
      </div>

      {/* Global overlays */}
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <NotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </div>
  );
}
