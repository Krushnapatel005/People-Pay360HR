import { apiClient } from '../api-client';

export const dashboardApi = {
  getMyKpis: () => apiClient('/dashboard/my-kpis', { method: 'GET' }),
  getHrKpis: () => apiClient('/dashboard/hr-kpis', { method: 'GET' }),
  getTimeOffKpis: () => apiClient('/dashboard/time-off-kpis', { method: 'GET' }),
  getPayrollKpis: () => apiClient('/dashboard/payroll-kpis', { method: 'GET' }),
  getPayrollTrend: () => apiClient('/dashboard/payroll-trend', { method: 'GET' }),
};
