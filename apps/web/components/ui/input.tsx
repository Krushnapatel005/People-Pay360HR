'use client';
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, iconLeft, iconRight, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium uppercase tracking-wider text-slate-300 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {iconLeft && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full py-2.5 text-sm text-white bg-surface-input border rounded-lg
              placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              ${iconLeft ? 'pl-10' : 'pl-4'}
              ${iconRight ? 'pr-10' : 'pr-4'}
              ${error
                ? 'border-red-500/60 focus:ring-red-500'
                : 'border-surface-inputBorder dark:border-slate-700'}
              dark:bg-slate-900/60 dark:text-slate-100
              ${className}
            `}
            {...props}
          />
          {iconRight && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
              {iconRight}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-medium uppercase tracking-wider text-slate-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-4 py-2.5 text-sm text-white bg-surface-input border border-surface-inputBorder rounded-lg
            placeholder-slate-500 resize-none
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
            transition-all duration-200
            dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-100
            ${error ? 'border-red-500/60' : ''}
            ${className}
          `}
          rows={3}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium uppercase tracking-wider text-slate-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-4 py-2.5 text-sm text-white bg-surface-input border border-surface-inputBorder rounded-lg
            focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
            transition-all duration-200 cursor-pointer
            dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-100
            ${error ? 'border-red-500/60' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
