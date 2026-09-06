import { apiClient } from './api-client';

export const usersApi = {
  getAll: async () => {
    return apiClient('/api/users');
  },
  getById: async (id: string) => {
    return apiClient(`/api/users/${id}`);
  },
  delete: async (id: string) => {
    return apiClient(`/api/users/${id}`, { method: 'DELETE' });
  },
};
