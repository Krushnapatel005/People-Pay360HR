'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Users } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="w-full max-w-md mx-auto animate-scale-in">
      <main className="w-full" aria-labelledby="login-heading">
        {/* Card */}
        <div className="bg-surface-card border border-surface-border rounded-2xl auth-card-shadow overflow-hidden backdrop-blur-xl">
          {/* Card Header */}
          <div className="bg-surface-cardHeader/80 border-b border-surface-border px-7 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-md shadow-brand-600/30 ring-1 ring-white/20">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white tracking-tight">PeoplePay360</h2>
                <p className="text-[10px] text-slate-500">HR &amp; Payroll Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Secure SSO
            </div>
          </div>

          {/* Card Body */}
          <div className="p-7 sm:p-8">
            <div className="mb-7">
              <h3 id="login-heading" className="text-2xl font-bold text-white tracking-tight">Welcome back</h3>
              <p className="mt-1 text-sm text-slate-400">Sign in to continue to your workspace.</p>
            </div>

            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = '/dashboard';
              }}
            >
              {/* Email */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-2" htmlFor="work-email">
                  Work Email
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="work-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-input border border-surface-inputBorder rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 input-transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-surface-input border border-surface-inputBorder rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 input-transition"
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    id="toggle-password-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="mt-2.5 flex justify-end">
                  <Link href="/forgot-password" className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors duration-150">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="login-submit-btn"
                  className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 active:bg-brand-700 transition-all duration-150 shadow-lg shadow-brand-600/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 focus:ring-offset-surface-card cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-slate-600">
        <p>© 2026 PeoplePay360 · Enterprise HR &amp; Payroll Management System</p>
      </footer>
    </div>
  );
}
