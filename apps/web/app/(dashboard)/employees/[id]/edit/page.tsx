'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, User, Briefcase, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../../../../../components/layout/breadcrumbs';
import { ConfirmDialog } from '../../../../../components/shared/confirm-dialog';
import { useUnsavedChanges } from '../../../../../hooks/use-unsaved-changes';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesApi } from '../../../../../lib/employees-api';

// ─── Validation Schema ────────────────────────────────────────────────────────
const schema = z.object({
  firstName:    z.string().min(2, 'First name must be at least 2 characters'),
  lastName:     z.string().min(2, 'Last name must be at least 2 characters'),
  jobPosition:  z.string().min(2, 'Job position is required'),
  department:   z.string().min(1, 'Department is required'),
  workEmail:    z.string().email('Must be a valid email'),
  workPhone:    z.string().optional(),
  hireDate:     z.string().min(1, 'Hire date is required'),
  gender:       z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  workLocation: z.string().optional(),
  managerId:    z.string().optional(),
  workScheduleId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const DEPARTMENTS = ['Engineering', 'Human Resources', 'Product', 'Design', 'Finance', 'Sales', 'Operations'];

function FormField({
  label, error, required, children,
}: {
  label: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-400">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  `w-full px-3 py-2 text-xs rounded-lg border bg-surface-card dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 transition-colors
  ${hasError
    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30'
    : 'border-surface-border dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500/30'}`;

export default function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const { data: employee, isLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeesApi.getById(id),
  });

  const {
    register, handleSubmit, formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { gender: 'prefer_not_to_say' },
    values: employee ? {
      ...employee,
      hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
    } : undefined
  });

  const { showConfirm, guardAction, confirmLeave, cancelLeave } = useUnsavedChanges(isDirty && !submitted);

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (data: FormValues) => employeesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      setSubmitted(true);
      setTimeout(() => router.push(`/employees/${id}`), 1500);
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to update employee');
    }
  });

  const onSubmit = (data: FormValues) => {
    // Convert hireDate string to ISO string for backend
    const payload = {
      ...data,
      hireDate: new Date(data.hireDate).toISOString(),
    };
    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return <div className="py-24 text-center animate-pulse text-slate-400">Loading employee details...</div>;
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Employee updated!</h2>
        <p className="text-sm text-slate-400 mt-1">Redirecting to profile…</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <button
            onClick={() => guardAction(() => router.push(`/employees/${id}`))}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-200 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Profile
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Edit Employee</h1>
          <p className="mt-1 text-xs text-slate-500">Update the employee details below.</p>
        </div>
        {isDirty && (
          <span className="text-xs text-amber-400 border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 rounded-lg">
            Unsaved changes
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Personal Information */}
        <div className="bg-surface-card dark:bg-slate-900/80 border border-surface-border dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-surface-border dark:border-slate-800">
            <User className="w-4 h-4 text-brand-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Personal Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="First Name" error={errors.firstName?.message} required>
              <input {...register('firstName')} placeholder="John" className={inputClass(!!errors.firstName)} />
            </FormField>
            <FormField label="Last Name" error={errors.lastName?.message} required>
              <input {...register('lastName')} placeholder="Doe" className={inputClass(!!errors.lastName)} />
            </FormField>
            <FormField label="Gender" error={errors.gender?.message} required>
              <select {...register('gender')} className={inputClass(!!errors.gender)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </FormField>
          </div>
        </div>

        {/* Work Information */}
        <div className="bg-surface-card dark:bg-slate-900/80 border border-surface-border dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-surface-border dark:border-slate-800">
            <Briefcase className="w-4 h-4 text-brand-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Work Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Job Position" error={errors.jobPosition?.message} required>
              <input {...register('jobPosition')} placeholder="Software Engineer" className={inputClass(!!errors.jobPosition)} />
            </FormField>
            <FormField label="Department" error={errors.department?.message} required>
              <select {...register('department')} className={inputClass(!!errors.department)}>
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </FormField>
            <FormField label="Work Email" error={errors.workEmail?.message} required>
              <input {...register('workEmail')} type="email" placeholder="john.doe@company.com" className={inputClass(!!errors.workEmail)} />
            </FormField>
            <FormField label="Hire Date" error={errors.hireDate?.message} required>
              <input {...register('hireDate')} type="date" className={inputClass(!!errors.hireDate)} />
            </FormField>
            <FormField label="Work Location" error={errors.workLocation?.message}>
              <input {...register('workLocation')} placeholder="Bengaluru HQ" className={inputClass(!!errors.workLocation)} />
            </FormField>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-surface-card dark:bg-slate-900/80 border border-surface-border dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-surface-border dark:border-slate-800">
            <Phone className="w-4 h-4 text-brand-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Contact</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Work Phone" error={errors.workPhone?.message}>
              <input {...register('workPhone')} placeholder="+91 98765 43210" className={inputClass(!!errors.workPhone)} />
            </FormField>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => guardAction(() => router.push('/employees'))}
            className="px-4 py-2 text-xs font-medium text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-3.5 h-3.5" />
            {isSubmitting ? 'Saving…' : 'Save Employee'}
          </button>
        </div>
      </form>

      {/* Unsaved changes confirm dialog */}
      <ConfirmDialog
        open={showConfirm}
        onClose={cancelLeave}
        onConfirm={confirmLeave}
        title="Discard unsaved changes?"
        description="You have unsaved changes. If you leave now, all your changes will be lost."
        confirmLabel="Discard Changes"
        cancelLabel="Keep editing"
        variant="warning"
      />
    </div>
  );
}
