'use client';
import React, { useState } from 'react';
import { Shield, Plus, Search, Lock, User } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Breadcrumbs } from '../../../components/layout/breadcrumbs';

const ROLES = [
  { name: 'Admin',         description: 'Full access to all modules', count: 2, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { name: 'HR Manager',    description: 'Employees, contracts, time off', count: 5, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { name: 'Payroll Admin', description: 'Payroll, salary structures, payslips', count: 3, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { name: 'Employee',      description: 'View own profile and payslips', count: 114, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
];

const MOCK_USERS = [
  { id: 'u-001', name: 'Aarav Mehta',   email: 'aarav.mehta@peoplepay360.com',  role: 'Admin',         status: 'active',   lastLogin: '2026-09-05T09:00:00Z' },
  { id: 'u-002', name: 'Priya Sharma',  email: 'priya.sharma@peoplepay360.com', role: 'HR Manager',    status: 'active',   lastLogin: '2026-09-05T08:15:00Z' },
  { id: 'u-003', name: 'Rohan Gupta',   email: 'rohan.gupta@peoplepay360.com',  role: 'Payroll Admin', status: 'active',   lastLogin: '2026-09-04T17:30:00Z' },
  { id: 'u-004', name: 'Kavya Nair',    email: 'kavya.nair@peoplepay360.com',   role: 'Payroll Admin', status: 'inactive', lastLogin: '2026-08-20T10:00:00Z' },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_USERS.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
        <p className="mt-1 text-sm text-slate-400">Manage system users and role-based access control</p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ROLES.map((role) => (
          <div key={role.name} className={`flex flex-col gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-slate-700 transition-colors`}>
            <div className={`w-9 h-9 rounded-xl ${role.bg} border ${role.border} flex items-center justify-center`}>
              <Shield className={`w-4 h-4 ${role.color}`} />
            </div>
            <div>
              <p className={`text-sm font-semibold ${role.color}`}>{role.name}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{role.description}</p>
            </div>
            <p className="text-xl font-bold text-white">{role.count} <span className="text-xs text-slate-500 font-normal">users</span></p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-white">All Users</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input type="text" placeholder="Search users…" value={search} onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg bg-slate-900 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
            </div>
            <button className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-brand-sm transition-all">
              <Plus className="w-3.5 h-3.5" /> Invite User
            </button>
          </div>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/30">
              <th className="py-3 px-4 font-semibold text-slate-300">User</th>
              <th className="py-3 px-4 font-semibold text-slate-300 hidden md:table-cell">Role</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Status</th>
              <th className="py-3 px-4 font-semibold text-slate-300 hidden lg:table-cell">Last Login</th>
              <th className="py-3 px-4 font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/30 to-brand-700/30 border border-brand-500/20 flex items-center justify-center text-[10px] font-bold text-brand-300 shrink-0">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 hidden md:table-cell">
                  <span className="text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md">{user.role}</span>
                </td>
                <td className="py-3.5 px-4"><Badge status={user.status} /></td>
                <td className="py-3.5 px-4 text-slate-500 hidden lg:table-cell">{new Date(user.lastLogin).toLocaleDateString('en-IN')}</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <button className="text-[10px] px-2.5 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 transition-colors">Edit</button>
                    <button className="text-[10px] text-red-400 hover:text-red-300 transition-colors">Revoke</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
