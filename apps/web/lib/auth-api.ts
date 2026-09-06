import { apiClient } from './api-client';

export const authApi = {
  login: async (credentials: any) => {
    return apiClient('/api/auth/login', { data: credentials });
  },

  logout: async () => {
    return apiClient('/api/auth/logout', { method: 'POST' });
  },

  getMe: async () => {
    return apiClient('/api/auth/me', { method: 'GET' });
  },

  forgotPassword: async (data: any) => {
    return apiClient('/api/auth/forgot-password', { data });
  },

  resetPassword: async (data: any) => {
    return apiClient('/api/auth/reset-password', { data });
  },
};
