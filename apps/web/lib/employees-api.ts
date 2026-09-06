import { apiClient } from './api-client';

export const employeesApi = {
  getAll: async () => apiClient('/api/employees', { method: 'GET' }),
  getById: async (id: string) => apiClient(`/api/employees/${id}`, { method: 'GET' }),
  create: async (data: any) => apiClient('/api/employees', { data }),
  update: async (id: string, data: any) => apiClient(`/api/employees/${id}`, { method: 'PATCH', data }),
  delete: async (id: string) => apiClient(`/api/employees/${id}`, { method: 'DELETE' }),
  getContracts: async (id: string) => apiClient(`/api/employees/${id}/contracts`, { method: 'GET' }),
  getAttendance: async (id: string) => apiClient(`/api/employees/${id}/attendance`, { method: 'GET' }),
  getTimeOff: async (id: string) => apiClient(`/api/employees/${id}/time-off`, { method: 'GET' }),
  getAllocations: async (id: string) => apiClient(`/api/employees/${id}/allocations`, { method: 'GET' }),
  getActivity: async (id: string) => apiClient(`/api/employees/${id}/activity`, { method: 'GET' }),
};
