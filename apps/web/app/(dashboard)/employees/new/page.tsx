'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, Building2, Briefcase, Calendar } from 'lucide-react';
import { Breadcrumbs } from '../../../../components/layout/breadcrumbs';

export default function NewEmployeePage() {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      <Breadcrumbs />
      <Link href="/employees" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-200 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Employees
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">New Employee</h1>
        <p className="mt-1 text-sm text-slate-400">Create a new employee record</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-3">
        {['Work Details', 'Personal Info', 'Payroll'].map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 text-xs font-medium ${step === i + 1 ? 'text-white' : step > i + 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                step === i + 1 ? 'bg-brand-600 border-brand-500 text-white' :
                step > i + 1 ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400' :
                'bg-slate-800 border-slate-700 text-slate-500'
              }`}>{i + 1}</span>
              {s}
            </div>
            {i < 2 && <div className="flex-1 h-px bg-slate-800" />}
          </React.Fragment>
        ))}
      </div>

      {/* Form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-white">{step === 1 ? 'Work Details' : step === 2 ? 'Personal Information' : 'Payroll Setup'}</h2>
        </div>
        <div className="p-6">
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { id: 'first-name', label: 'First Name', placeholder: 'Aarav', icon: <User className="w-4 h-4" />, type: 'text' },
                { id: 'last-name', label: 'Last Name', placeholder: 'Mehta', icon: <User className="w-4 h-4" />, type: 'text' },
                { id: 'work-email', label: 'Work Email', placeholder: 'aarav.mehta@company.com', icon: <Mail className="w-4 h-4" />, type: 'email', colSpan: true },
                { id: 'job-position', label: 'Job Position', placeholder: 'Senior Software Engineer', icon: <Briefcase className="w-4 h-4" />, type: 'text' },
                { id: 'department', label: 'Department', placeholder: 'Engineering', icon: <Building2 className="w-4 h-4" />, type: 'text' },
                { id: 'hire-date', label: 'Hire Date', placeholder: '', icon: <Calendar className="w-4 h-4" />, type: 'date' },
              ].map((field) => (
                <div key={field.id} className={field.colSpan ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-2" htmlFor={field.id}>{field.label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">{field.icon}</div>
                    <input id={field.id} type={field.type} placeholder={field.placeholder}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 input-transition" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {['Date of Birth', 'Gender', 'Marital Status', 'Nationality', 'Personal Email', 'Personal Mobile'].map((label) => (
                <div key={label}>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-2">{label}</label>
                  <input type="text" placeholder={`Enter ${label.toLowerCase()}`}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 input-transition" />
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {['Salary Structure', 'Work Schedule', 'Bank Account Number', 'IFSC Code'].map((label) => (
                <div key={label}>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-2">{label}</label>
                  <input type="text" placeholder={`Select ${label.toLowerCase()}`}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 input-transition" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 border border-slate-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => Math.min(3, s + 1))}
              className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors shadow-brand-sm"
            >
              Next Step
            </button>
          ) : (
            <Link href="/employees" className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors">
              Create Employee
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
