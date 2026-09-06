import { apiClient } from './api-client';

export const payrollApi = {
  getSalaryStructures: async () => apiClient('/api/payroll/salary-structures', { method: 'GET' }),
  createSalaryStructure: async (data: any) => apiClient('/api/payroll/salary-structures', { data }),
  updateSalaryStructure: async (id: string, data: any) => apiClient(`/api/payroll/salary-structures/${id}`, { method: 'PATCH', data }),
  getSalaryRules: async () => apiClient('/api/payroll/salary-rules', { method: 'GET' }),
  createSalaryRule: async (data: any) => apiClient('/api/payroll/salary-rules', { data }),
  updateSalaryRule: async (id: string, data: any) => apiClient(`/api/payroll/salary-rules/${id}`, { method: 'PATCH', data }),
  getPayruns: async () => apiClient('/api/payroll/payruns', { method: 'GET' }),
  getPayrunById: async (id: string) => apiClient(`/api/payroll/payruns/${id}`, { method: 'GET' }),
  createPayrun: async (data: any) => apiClient('/api/payroll/payruns', { data }),
  computePayrun: async (id: string) => apiClient(`/api/payroll/payruns/${id}/compute`, { method: 'POST' }),
  validatePayrun: async (id: string) => apiClient(`/api/payroll/payruns/${id}/validate`, { method: 'POST' }),
  markPayrunPaid: async (id: string) => apiClient(`/api/payroll/payruns/${id}/mark-paid`, { method: 'POST' }),
  getPayrunExceptions: async (id: string) => apiClient(`/api/payroll/payruns/${id}/exceptions`, { method: 'GET' }),
  getPayslips: async () => apiClient('/api/payroll/payslips', { method: 'GET' }),
  getPayslipById: async (id: string) => apiClient(`/api/payroll/payslips/${id}`, { method: 'GET' }),
  publishPayslip: async (id: string) => apiClient(`/api/payroll/payslips/${id}/publish`, { method: 'POST' }),
  sendPayslipEmail: async (id: string) => apiClient(`/api/payroll/payslips/${id}/send`, { method: 'POST' }),
};
