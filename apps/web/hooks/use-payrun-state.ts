'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payrollApi } from '../lib/payroll-api';

export function usePayrunState() {
  const queryClient = useQueryClient();

  const { data: payruns = [], isLoading, error } = useQuery({
    queryKey: ['payruns'],
    queryFn: payrollApi.getPayruns,
  });

  const computeMutation = useMutation({
    mutationFn: (id: string) => payrollApi.computePayrun(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payruns'] }),
  });

  const validateMutation = useMutation({
    mutationFn: (id: string) => payrollApi.validatePayrun(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payruns'] }),
  });

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => payrollApi.markPayrunPaid(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payruns'] }),
  });

  const cancelMutation = useMutation({
    // We don't have a cancel payrun route yet, but we'll mock it for now if needed.
    // Or we could do a DELETE or PATCH to status. Assuming no backend support, just throw.
    mutationFn: async (id: string) => {
      console.warn('Cancel payrun not implemented on backend yet');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payruns'] }),
  });

  return {
    payruns,
    isLoading,
    error,
    compute: (id: string) => computeMutation.mutate(id),
    validate: (id: string) => validateMutation.mutate(id),
    markPaid: (id: string) => markPaidMutation.mutate(id),
    cancel: (id: string) => cancelMutation.mutate(id),
  };
}
