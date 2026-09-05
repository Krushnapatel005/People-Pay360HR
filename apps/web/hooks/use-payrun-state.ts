'use client';
import { useState, useCallback } from 'react';
import type { Payrun, PayrunStatus } from '../lib/types';
import { MOCK_PAYRUNS } from '../lib/mock-data';

export function usePayrunState() {
  const [payruns, setPayruns] = useState<Payrun[]>(MOCK_PAYRUNS);

  const transition = useCallback((id: string, toStatus: PayrunStatus) => {
    setPayruns((prev) =>
      prev.map((pr) => {
        if (pr.id !== id) return pr;
        const now = new Date().toISOString();
        return {
          ...pr,
          status: toStatus,
          computedAt:  toStatus === 'computed'  ? now : pr.computedAt,
          validatedAt: toStatus === 'validated' ? now : pr.validatedAt,
          paidAt:      toStatus === 'paid'      ? now : pr.paidAt,
          // When computed, populate totalGross/Net if they were 0
          totalGross:  toStatus === 'computed' && pr.totalGross === 0
            ? pr.employees.reduce((s, e) => s + e.grossWage, 0)
            : pr.totalGross,
          totalNet:    toStatus === 'computed' && pr.totalNet === 0
            ? pr.employees.reduce((s, e) => s + e.netWage, 0)
            : pr.totalNet,
        };
      })
    );
  }, []);

  const compute  = useCallback((id: string) => transition(id, 'computed'),  [transition]);
  const validate = useCallback((id: string) => transition(id, 'validated'), [transition]);
  const markPaid = useCallback((id: string) => transition(id, 'paid'),      [transition]);
  const cancel   = useCallback((id: string) => transition(id, 'cancelled'), [transition]);

  return { payruns, compute, validate, markPaid, cancel };
}
