'use client';
import React from 'react';
import Link from 'next/link';
import { use } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { Breadcrumbs } from '../../../../components/layout/breadcrumbs';
import { formatDate, formatCurrency, capitalize } from '../../../../lib/utils';
import { useQuery } from '@tanstack/react-query';
import { contractsApi } from '../../../../lib/contracts-api';

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: contract, isLoading } = useQuery({
    queryKey: ['contract', id],
    queryFn: () => contractsApi.getById(id),
  });

  if (isLoading) return <div className="py-16 text-center text-slate-400 text-sm">Loading contract...</div>;
  if (!contract) return <div className="py-16 text-center text-rose-400 text-sm">Contract not found</div>;

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      <Breadcrumbs />
      <Link href="/contracts" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-200 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Contracts
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-mono">{contract.ref}</h1>
          <p className="mt-1 text-sm text-slate-400">{contract.employeeName} · {contract.jobPosition}</p>
        </div>
        <Badge status={contract.status} />
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-white">Contract Details</h2>
        </div>
        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {[
            { label: 'Employee',           value: contract.employeeName },
            { label: 'Department',         value: contract.department },
            { label: 'Job Position',       value: contract.jobPosition },
            { label: 'Contract Type',      value: capitalize(contract.contractType) },
            { label: 'Start Date',         value: formatDate(contract.startDate) },
            { label: 'End Date',           value: contract.endDate ? formatDate(contract.endDate) : 'Open-ended' },
            { label: 'Wage',               value: `${formatCurrency(contract.wage)} / ${contract.wageType}` },
            { label: 'Currency',           value: contract.currency },
            { label: 'Work Schedule',      value: contract.workScheduleName },
            { label: 'Salary Structure',   value: contract.salaryStructureName },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
              <span className="text-xs text-slate-200">{value}</span>
            </div>
          ))}
        </div>
        {contract.notes && (
          <div className="px-5 pb-5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1.5">Notes</span>
            <p className="text-xs text-slate-400">{contract.notes}</p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Link href={`/contracts/${id}/edit`} className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors shadow-brand-sm">
          Edit Contract
        </Link>
        <button className="px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition-colors">
          Archive
        </button>
      </div>
    </div>
  );
}
