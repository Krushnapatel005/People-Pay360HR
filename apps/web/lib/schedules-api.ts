import { apiClient } from './api-client';

export const schedulesApi = {
  getAll: async () => {
    return apiClient('/api/working-schedules');
  },
  getById: async (id: string) => {
    return apiClient(`/api/working-schedules/${id}`);
  },
};
