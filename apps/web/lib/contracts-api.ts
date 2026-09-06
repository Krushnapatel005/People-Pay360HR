import { apiClient } from './api-client';

export const contractsApi = {
  getAll: async () => apiClient('/api/contracts', { method: 'GET' }),
  getById: async (id: string) => apiClient(`/api/contracts/${id}`, { method: 'GET' }),
  create: async (data: any) => apiClient('/api/contracts', { data }),
  update: async (id: string, data: any) => apiClient(`/api/contracts/${id}`, { method: 'PATCH', data }),
  getSchedules: async () => apiClient('/api/working-schedules', { method: 'GET' }),
  getScheduleById: async (id: string) => apiClient(`/api/working-schedules/${id}`, { method: 'GET' }),
  createSchedule: async (data: any) => apiClient('/api/working-schedules', { data }),
  updateSchedule: async (id: string, data: any) => apiClient(`/api/working-schedules/${id}`, { method: 'PATCH', data }),
};
