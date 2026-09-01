import { api } from './api';

export const servicesService = {
  async list() {
    const { data } = await api.get('/services');
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/services/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/services', payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/services/${id}`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`/services/${id}`);
  },
};
