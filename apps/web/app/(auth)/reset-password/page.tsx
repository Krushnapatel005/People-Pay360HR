'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto animate-scale-in">
      <div className="bg-surface-card border border-surface-border rounded-2xl auth-card-shadow overflow-hidden">
        <div className="bg-surface-cardHeader/80 border-b border-surface-border px-7 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center ring-1 ring-white/20">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-base font-semibold text-white">Set New Password</h2>
        </div>
        <div className="p-7 sm:p-8">
          {done ? (
            <div className="text-center py-4 animate-scale-in">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Password updated!</h3>
              <p className="text-sm text-slate-400 mb-6">Your password has been reset successfully.</p>
              <Link href="/login" className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/25">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h3 className="text-2xl font-bold text-white">Create new password</h3>
                <p className="mt-1 text-sm text-slate-400">Your new password must be at least 8 characters.</p>
              </div>
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
                {[
                  { id: 'new-password', label: 'New Password', show, setShow: setShow },
                  { id: 'confirm-password', label: 'Confirm Password', show: showConfirm, setShow: setShowConfirm },
                ].map((field) => (
                  <div key={field.id}>
                    <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-2" htmlFor={field.id}>{field.label}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id={field.id}
                        type={field.show ? 'text' : 'password'}
                        required
                        minLength={8}
                        className="w-full pl-10 pr-10 py-2.5 bg-surface-input border border-surface-inputBorder rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 input-transition"
                      />
                      <button type="button" onClick={() => field.setShow((v: boolean) => !v)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors">
                        {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                <button type="submit" className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/25 cursor-pointer">
                  Reset Password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
