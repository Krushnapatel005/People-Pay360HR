'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto animate-scale-in">
      <div className="bg-surface-card border border-surface-border rounded-2xl auth-card-shadow overflow-hidden">
        <div className="bg-surface-cardHeader/80 border-b border-surface-border px-7 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center ring-1 ring-white/20">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-base font-semibold text-white">Password Recovery</h2>
        </div>
        <div className="p-7 sm:p-8">
          {sent ? (
            <div className="text-center py-4 animate-scale-in">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Check your inbox</h3>
              <p className="text-sm text-slate-400 mb-6">We&apos;ve sent reset instructions to <span className="text-white font-medium">{email}</span></p>
              <Link href="/login" className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h3 className="text-2xl font-bold text-white tracking-tight">Forgot password?</h3>
                <p className="mt-1 text-sm text-slate-400">Enter your work email and we&apos;ll send reset instructions.</p>
              </div>
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-2" htmlFor="reset-email">Work Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="reset-email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-input border border-surface-inputBorder rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 input-transition"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/25 cursor-pointer">
                  Send Reset Link
                </button>
                <div className="text-center">
                  <Link href="/login" className="text-xs font-medium text-slate-500 hover:text-slate-300 inline-flex items-center gap-1.5 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
