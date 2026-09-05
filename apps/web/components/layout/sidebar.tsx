'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, CalendarClock,
  Clock, Umbrella, DollarSign, BarChart3, Settings,
  Shield, ChevronLeft, ChevronRight, ChevronDown,
  Building2, Banknote,
} from 'lucide-react';
import { DotBadge } from '../ui/badge';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: { id: string; label: string; href: string; badge?: number }[];
  badge?: number;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-4 h-4" />,
    href: '/dashboard',
  },
  {
    id: 'employees',
    label: 'Employees',
    icon: <Users className="w-4 h-4" />,
    children: [
      { id: 'emp-list',     label: 'All Employees', href: '/employees' },
      { id: 'emp-new',      label: 'New Employee',  href: '/employees/new' },
    ],
  },
  {
    id: 'contracts',
    label: 'Contracts',
    icon: <FileText className="w-4 h-4" />,
    children: [
      { id: 'con-list',  label: 'Contracts',          href: '/contracts' },
      { id: 'sch-list',  label: 'Working Schedules',  href: '/schedules' },
    ],
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: <CalendarClock className="w-4 h-4" />,
    href: '/attendance',
  },
  {
    id: 'time-off',
    label: 'Time Off',
    icon: <Umbrella className="w-4 h-4" />,
    children: [
      { id: 'tor-list',  label: 'Requests',    href: '/time-off',             badge: 3 },
      { id: 'tot-list',  label: 'Types',       href: '/time-off/types' },
      { id: 'la-list',   label: 'Allocations', href: '/time-off/allocations' },
    ],
  },
  {
    id: 'payroll',
    label: 'Payroll',
    icon: <Banknote className="w-4 h-4" />,
    children: [
      { id: 'pr-list',   label: 'Payruns',             href: '/payroll' },
      { id: 'ps-list',   label: 'Payslips',            href: '/payroll/payslips' },
      { id: 'ss-list',   label: 'Salary Structures',   href: '/payroll/salary-structures' },
      { id: 'sr-list',   label: 'Salary Rules',        href: '/payroll/salary-rules' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="w-4 h-4" />,
    href: '/analytics',
  },
  {
    id: 'users',
    label: 'User Management',
    icon: <Shield className="w-4 h-4" />,
    href: '/users',
    adminOnly: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-4 h-4" />,
    href: '/settings',
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(['employees', 'payroll', 'time-off'])
  );

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside
      className={`
        sidebar-transition flex flex-col
        bg-surface-card dark:bg-slate-900/95 border-r border-surface-border dark:border-slate-800
        h-full shrink-0
        ${collapsed ? 'w-[60px]' : 'w-[240px]'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800 min-h-[60px]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-bold text-xs tracking-wider text-white ring-1 ring-white/20 shadow-sm shadow-brand-600/20 shrink-0">
          HR
        </div>
        {!collapsed && (
          <div className="animate-fade-in min-w-0">
            <p className="text-sm font-bold text-white truncate">PeoplePay360</p>
            <p className="text-[10px] text-slate-500 truncate">HR &amp; Payroll Platform</p>
          </div>
        )}
      </div>

      {/* Org Selector */}
      {!collapsed && (
        <div className="px-3 py-2.5 border-b border-slate-800">
          <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-800/60 transition-colors group">
            <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors truncate flex-1 text-left">Acme Corp — India</span>
            <ChevronDown className="w-3 h-3 text-slate-600 shrink-0" />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const hasChildren = !!item.children?.length;
          const isExpanded = expandedItems.has(item.id);
          const isItemActive = item.href
            ? isActive(item.href)
            : item.children?.some((c) => isActive(c.href)) ?? false;

          return (
            <div key={item.id}>
              {/* Main nav item */}
              {item.href && !hasChildren ? (
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150
                    ${isItemActive
                      ? 'bg-brand-600/10 text-brand-400 ring-1 ring-brand-500/20 nav-active-glow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}
                    ${item.adminOnly ? 'opacity-75' : ''}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`shrink-0 ${isItemActive ? 'text-brand-400' : 'text-slate-500'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.adminOnly && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 border border-violet-500/20">
                          ADMIN
                        </span>
                      )}
                      {item.badge && <DotBadge count={item.badge} />}
                    </>
                  )}
                </Link>
              ) : (
                <button
                  onClick={() => !collapsed && toggleExpand(item.id)}
                  className={`
                    w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150
                    ${isItemActive
                      ? 'text-brand-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`shrink-0 ${isItemActive ? 'text-brand-400' : 'text-slate-500'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      <ChevronDown className={`w-3 h-3 text-slate-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>
              )}

              {/* Children */}
              {hasChildren && isExpanded && !collapsed && (
                <div className="ml-3.5 mt-0.5 pl-3 border-l border-slate-800 space-y-0.5 animate-slide-up">
                  {item.children!.map((child) => (
                    <Link
                      key={child.id}
                      href={child.href}
                      className={`
                        flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-xs transition-all duration-150
                        ${isActive(child.href)
                          ? 'text-white font-medium bg-brand-600/10 ring-1 ring-brand-500/20'
                          : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 font-normal'}
                      `}
                    >
                      <span>{child.label}</span>
                      {child.badge && <DotBadge count={child.badge} />}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-3 border-t border-slate-800">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-2.5 py-2 text-xs text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
