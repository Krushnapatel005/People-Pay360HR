'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Breadcrumbs } from '../../../components/layout/breadcrumbs';
import { useQuery } from '@tanstack/react-query';
import { contractsApi } from '../../../lib/contracts-api';
import { formatDate, formatCurrency, capitalize } from '../../../lib/utils';

export default function ContractsPage() {
  const router = useRouter();
  
  const { data: contracts = [], isLoading, error } = useQuery({
    queryKey: ['contracts'],
    queryFn: contractsApi.getAll,
  });

  if (error) {
    return (
      <div className="p-8 text-center text-red-400">
        <p>Failed to load contracts. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Contracts
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">{contracts.length} Total</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">Employee employment contracts and terms</p>
        </div>
        <Link href="/contracts/new" className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-brand-sm transition-all">
          <Plus className="w-3.5 h-3.5" /> New Contract
        </Link>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-sm">Loading contracts...</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/30">
                <th className="py-3 px-4 font-semibold text-slate-300">Reference</th>
                <th className="py-3 px-4 font-semibold text-slate-300">Employee</th>
                <th className="py-3 px-4 font-semibold text-slate-300 hidden md:table-cell">Position</th>
                <th className="py-3 px-4 font-semibold text-slate-300 hidden lg:table-cell">Type</th>
                <th className="py-3 px-4 font-semibold text-slate-300 hidden md:table-cell">Period</th>
                <th className="py-3 px-4 font-semibold text-slate-300">Wage</th>
                <th className="py-3 px-4 font-semibold text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">No contracts found</td>
                </tr>
              ) : (
                contracts.map((c: any) => {
                  const empName = c.employee ? `${c.employee.firstName} ${c.employee.lastName}` : 'Unknown';
                  return (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors cursor-pointer group" onClick={() => router.push(`/contracts/${c.id}`)}>
                      <td className="py-3.5 px-4 font-mono text-xs text-brand-400 group-hover:text-brand-300">{c.ref}</td>
                      <td className="py-3.5 px-4 font-medium text-white">{empName}</td>
                      <td className="py-3.5 px-4 text-slate-400 hidden md:table-cell">{c.jobPosition || (c.employee && c.employee.jobPosition) || '—'}</td>
                      <td className="py-3.5 px-4 hidden lg:table-cell"><Badge status={c.contractType || 'FULL_TIME'} /></td>
                      <td className="py-3.5 px-4 text-slate-400 hidden md:table-cell">
                        {formatDate(c.startDate)} {c.endDate ? `– ${formatDate(c.endDate)}` : '(Open-ended)'}
                      </td>
                      <td className="py-3.5 px-4 text-white font-semibold">{formatCurrency(c.wage || 0)}<span className="text-slate-500 font-normal">/mo</span></td>
                      <td className="py-3.5 px-4"><Badge status={c.status || 'ACTIVE'} /></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
