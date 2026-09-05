'use client';
import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyMessage?: string;
  loading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  sortKey,
  sortDir,
  onSort,
  emptyMessage = 'No records found',
  loading = false,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-800/30">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className={`py-3 px-4 font-semibold text-slate-300 whitespace-nowrap ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                }`}
                style={col.width ? { width: col.width } : {}}
              >
                {col.sortable && onSort ? (
                  <button
                    className="flex items-center gap-1.5 hover:text-white transition-colors select-none group"
                    onClick={() => onSort(String(col.key))}
                  >
                    {col.header}
                    {sortKey === String(col.key) ? (
                      sortDir === 'asc' ? (
                        <ChevronUp className="w-3 h-3 text-brand-400" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-brand-400" />
                      )
                    ) : (
                      <ChevronsUpDown className="w-3 h-3 text-slate-600 group-hover:text-slate-400" />
                    )}
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80 text-slate-200">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={String(col.key)} className="py-3.5 px-4">
                    <div className="h-3.5 bg-slate-800 rounded shimmer" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-16 px-4 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className={`
                  transition-colors
                  ${onRowClick ? 'cursor-pointer hover:bg-slate-800/40 group' : 'hover:bg-slate-800/20'}
                `}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`py-3.5 px-4 ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                    }`}
                  >
                    {col.render
                      ? col.render(row)
                      : (row as Record<string, unknown>)[String(col.key)] as React.ReactNode ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
