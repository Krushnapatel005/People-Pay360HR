import { apiClient } from './api-client';

export const dashboardApi = {
  getEmployeeDashboard: async () => apiClient('/api/dashboard/employee', { method: 'GET' }),
  getHrDashboard: async () => apiClient('/api/dashboard/hr', { method: 'GET' }),
  getPayrollDashboard: async () => apiClient('/api/dashboard/payroll', { method: 'GET' }),
  getAdminDashboard: async () => apiClient('/api/dashboard/admin', { method: 'GET' }),
  getAuditLogs: async () => apiClient('/api/audit-logs', { method: 'GET' }),
};
