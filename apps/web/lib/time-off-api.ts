import { apiClient } from './api-client';

export const timeOffApi = {
  getRequests: async () => apiClient('/api/time-off', { method: 'GET' }),
  getRequestById: async (id: string) => apiClient(`/api/time-off/${id}`, { method: 'GET' }),
  createRequest: async (data: any) => apiClient('/api/time-off', { data }),
  updateRequest: async (id: string, data: any) => apiClient(`/api/time-off/${id}`, { method: 'PATCH', data }),
  approveRequest: async (id: string) => apiClient(`/api/time-off/${id}/approve`, { method: 'PATCH' }),
  rejectRequest: async (id: string) => apiClient(`/api/time-off/${id}/refuse`, { method: 'PATCH' }),
  withdrawRequest: async (id: string) => apiClient(`/api/time-off/${id}`, { method: 'DELETE' }),
  getTypes: async () => apiClient('/api/time-off/types', { method: 'GET' }),
  createType: async (data: any) => apiClient('/api/time-off/types', { data }),
  updateType: async (id: string, data: any) => apiClient(`/api/time-off/types/${id}`, { method: 'PATCH', data }),
  deleteType: async (id: string) => apiClient(`/api/time-off/types/${id}`, { method: 'DELETE' }),
  getAllocations: async () => apiClient('/api/time-off/allocations', { method: 'GET' }),
  createAllocation: async (data: any) => apiClient('/api/time-off/allocations', { data }),
  updateAllocation: async (id: string, data: any) => apiClient(`/api/time-off/allocations/${id}`, { method: 'PATCH', data }),
  deleteAllocation: async (id: string) => apiClient(`/api/time-off/allocations/${id}`, { method: 'DELETE' }),
};
