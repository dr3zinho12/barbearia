import { api } from './api';

export const businessHoursService = {
  async get() {
    const { data } = await api.get('/business-hours');
    return data;
  },

  async set(workingHours) {
    const { data } = await api.put('/business-hours', { workingHours });
    return data;
  },

  async listBlocked() {
    const { data } = await api.get('/business-hours/blocked');
    return data;
  },

  async createBlocked(payload) {
    const { data } = await api.post('/business-hours/blocked', payload);
    return data;
  },

  async removeBlocked(id) {
    await api.delete(`/business-hours/blocked/${id}`);
  },
};
