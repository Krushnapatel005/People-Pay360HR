'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../layout/sidebar';
import { Topbar } from '../layout/topbar';
import { CommandPalette } from '../shared/command-palette';
import { NotificationsPanel } from '../shared/notifications-panel';
import { RoleBanner } from '../shared/role-banner';
import { RoleProvider } from '../../lib/context/role-context';
import { useAuth } from '../../lib/context/auth-context';

interface AppShellProps {
  children: React.ReactNode;
}

function AppShellInner({ children }: AppShellProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Persist theme
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pp360_theme') as 'dark' | 'light' | null;
      if (saved) setTheme(saved);
    } catch {}
  }, []);

  // Apply theme class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('pp360_theme', theme); } catch {}
  }, [theme]);

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
        setMobileSidebarOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Auth guard: redirect to /login if session has expired or user is not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // Show a loading screen while the session is being restored from the server cookie
  // This prevents the dashboard from briefly rendering with wrong or no user data
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-base)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <p className="text-sm text-slate-500 animate-pulse">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  // Render nothing while redirect is in progress
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-base)]">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always visible on desktop, overlay on mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto
        transition-transform duration-300 ease-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          onSearchOpen={() => setCommandOpen(true)}
          onNotificationsOpen={() => setNotificationsOpen((v) => !v)}
          onMobileMenuOpen={() => setMobileSidebarOpen(true)}
          theme={theme}
          onThemeToggle={toggleTheme}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-7">
          {children}
        </main>
      </div>

      {/* Global overlays */}
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <NotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

      {/* Role banner */}
      <RoleBanner />
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <RoleProvider>
      <AppShellInner>{children}</AppShellInner>
    </RoleProvider>
  );
}
