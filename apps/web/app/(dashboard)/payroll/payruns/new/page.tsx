'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from '@tanstack/react-query';
import { payrollApi } from '../../../../../../lib/payroll-api';
import { ArrowLeft, Check, ChevronRight, FileText, Calendar, Building2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../../../../../../components/layout/breadcrumbs';
import { formatCurrency, formatDate } from '../../../../../../lib/utils';

const STEPS = [
  { id: 'details', label: 'Payrun Details' },
  { id: 'structure', label: 'Salary Structure' },
  { id: 'review', label: 'Review & Create' }
];

export default function NewPayrunWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    periodStart: '',
    periodEnd: '',
    structureId: ''
  });

  const { data: structures, isLoading: isLoadingStructures } = useQuery({
    queryKey: ['salary-structures'],
    queryFn: () => payrollApi.getSalaryStructures(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => payrollApi.createPayrun({
      reference: `PR-${Date.now()}`,
      periodStart: new Date(data.periodStart).toISOString(),
      periodEnd: new Date(data.periodEnd).toISOString(),
      structureId: data.structureId,
      status: 'DRAFT',
    }),
    onSuccess: () => {
      router.push('/payroll');
    }
  });

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.name || !formData.periodStart || !formData.periodEnd) {
        alert('Please fill all required fields');
        return;
      }
    } else if (currentStep === 1) {
      if (!formData.structureId) {
        alert('Please select a salary structure');
        return;
      }
    }
    setCurrentStep(s => Math.min(STEPS.length - 1, s + 1));
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const selectedStructure = structures?.find((s: any) => s.id === formData.structureId);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/payroll" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Payrun</h1>
          <p className="text-sm text-slate-500 mt-1">Start a new payroll cycle</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0"></div>
          {STEPS.map((step, idx) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                idx < currentStep ? 'bg-emerald-500 text-white' : 
                idx === currentStep ? 'bg-brand-500 text-white ring-4 ring-brand-500/20' : 
                'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                {idx < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-xs font-semibold ${idx <= currentStep ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Details */}
        {currentStep === 0 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Payrun Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-full">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Payrun Name <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. October 2026 Regular Payroll"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Period Start <span className="text-rose-500">*</span></label>
                <input 
                  type="date" 
                  value={formData.periodStart}
                  onChange={e => setFormData({ ...formData, periodStart: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none [&::-webkit-calendar-picker-indicator]:dark:invert"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Period End <span className="text-rose-500">*</span></label>
                <input 
                  type="date" 
                  value={formData.periodEnd}
                  onChange={e => setFormData({ ...formData, periodEnd: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none [&::-webkit-calendar-picker-indicator]:dark:invert"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Structure */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Select Salary Structure</h2>
            
            {isLoadingStructures ? (
              <div className="py-8 text-center text-slate-400 text-sm">Loading structures...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {structures?.map((structure: any) => (
                  <div 
                    key={structure.id}
                    onClick={() => setFormData({ ...formData, structureId: structure.id })}
                    className={`cursor-pointer p-4 rounded-xl border transition-all ${
                      formData.structureId === structure.id 
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 ring-1 ring-brand-500'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${formData.structureId === structure.id ? 'bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{structure.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{structure.code}</p>
                        </div>
                      </div>
                      {formData.structureId === structure.id && (
                        <Check className="w-5 h-5 text-brand-500" />
                      )}
                    </div>
                  </div>
                ))}
                {structures?.length === 0 && (
                  <div className="col-span-full py-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500">No salary structures available. Please create one first.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Review Payrun</h2>
            
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Payrun Name</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{formData.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Salary Structure</p>
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-brand-500" />
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedStructure?.name || 'Unknown'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Period Start</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{formatDate(formData.periodStart)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Period End</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{formatDate(formData.periodEnd)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Ready to create</p>
                <p className="text-xs text-amber-700 dark:text-amber-400/80 mt-1">
                  Once created, this payrun will be in DRAFT state. You can then review and compute the salaries for eligible employees.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              currentStep === 0 
              ? 'text-slate-400 cursor-not-allowed opacity-50' 
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Back
          </button>
          
          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-500 transition-colors shadow-sm shadow-brand-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Payrun'} <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
