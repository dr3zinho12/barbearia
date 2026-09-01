import { api } from './api';

export const barbersService = {
  async list() {
    const { data } = await api.get('/barbers');
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/barbers/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/barbers', payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/barbers/${id}`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`/barbers/${id}`);
  },

  async setWorkingHours(id, workingHours) {
    const { data } = await api.put(`/barbers/${id}/working-hours`, { workingHours });
    return data;
  },

  async grantLogin(id, payload) {
    const { data } = await api.post(`/barbers/${id}/login`, payload);
    return data;
  },

  async getMe() {
    const { data } = await api.get('/barbers/me');
    return data;
  },

  async updateMe(payload) {
    const { data } = await api.put('/barbers/me', payload);
    return data;
  },

  async listMyBreaks() {
    const { data } = await api.get('/barbers/me/breaks');
    return data;
  },

  async createMyBreak(payload) {
    const { data } = await api.post('/barbers/me/breaks', payload);
    return data;
  },

  async removeMyBreak(id) {
    await api.delete(`/barbers/me/breaks/${id}`);
  },

  async updateMyWorkingHours(workingHours) {
    const { data } = await api.put('/barbers/me/working-hours', { workingHours });
    return data;
  },
};
