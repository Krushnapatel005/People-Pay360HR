import { apiClient } from './api-client';

export const attendanceApi = {
  getAll: async () => apiClient('/api/attendance', { method: 'GET' }),
  getById: async (id: string) => apiClient(`/api/attendance/${id}`, { method: 'GET' }),
  checkIn: async (data: any) => apiClient('/api/attendance/check-in', { data }),
  checkOut: async (data: any) => apiClient('/api/attendance/check-out', { data }),
  update: async (id: string, data: any) => apiClient(`/api/attendance/${id}`, { method: 'PATCH', data }),
  requestCorrection: async (id: string, data: any) => apiClient(`/api/attendance/${id}/correction-request`, { data }),
  approveCorrection: async (id: string) => apiClient(`/api/attendance/corrections/${id}/approve`, { method: 'POST' }),
  rejectCorrection: async (id: string) => apiClient(`/api/attendance/corrections/${id}/reject`, { method: 'POST' }),
};
