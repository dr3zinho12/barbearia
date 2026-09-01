import { api } from './api';

export const authService = {
  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  async login(payload) {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },

  async me() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  async updateProfile(payload) {
    const { data } = await api.put('/auth/me', payload);
    return data;
  },

  async changePassword(payload) {
    await api.put('/auth/me/password', payload);
  },

  async forgotPassword(email) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(payload) {
    await api.post('/auth/reset-password', payload);
  },
};
