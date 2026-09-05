'use client';
import React from 'react';
import { X, Bell, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { timeAgo } from '../../lib/utils';

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

const MOCK_NOTIFICATIONS = [
  {
    id: '1', type: 'info' as const,
    title: 'New Time Off Request',
    message: 'Aarav Mehta submitted a 3-day PTO request for Sep 10–12.',
    isRead: false,
    createdAt: '2026-09-05T08:30:00Z',
  },
  {
    id: '2', type: 'success' as const,
    title: 'Payrun Validated',
    message: 'August 2026 Payroll has been successfully validated.',
    isRead: false,
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: '3', type: 'warning' as const,
    title: 'Contract Expiring Soon',
    message: "Ananya Patel's fixed-term contract expires on Feb 19, 2025.",
    isRead: true,
    createdAt: '2026-08-28T09:00:00Z',
  },
  {
    id: '4', type: 'info' as const,
    title: 'New Employee Onboarded',
    message: 'Arjun Singh has been added to the Engineering team.',
    isRead: true,
    createdAt: '2026-08-01T08:00:00Z',
  },
];

const ICONS = {
  success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  error:   <AlertCircle className="w-4 h-4 text-red-400" />,
  info:    <Info className="w-4 h-4 text-blue-400" />,
};

export function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40" onClick={onClose} />
      )}
      <div className={`
        fixed top-0 right-0 h-full z-50 w-80
        bg-slate-900 border-l border-slate-800 shadow-card
        transform transition-transform duration-300 ease-smooth
        ${open ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-600 text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
          {MOCK_NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-4 py-3.5 hover:bg-slate-800/40 transition-colors cursor-pointer ${
                !n.isRead ? 'bg-brand-500/5' : ''
              }`}
            >
              <div className="mt-0.5 shrink-0">{ICONS[n.type]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-xs font-medium ${n.isRead ? 'text-slate-300' : 'text-white'}`}>{n.title}</p>
                  {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 mt-0.5" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-slate-600 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-4 py-3">
          <button className="w-full text-xs text-brand-400 hover:text-brand-300 transition-colors text-center">
            Mark all as read
          </button>
        </div>
      </div>
    </>
  );
}
