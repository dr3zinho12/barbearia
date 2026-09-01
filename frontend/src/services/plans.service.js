import { api } from './api';

export const plansService = {
  async list() {
    const { data } = await api.get('/plans');
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/plans/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/plans', payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/plans/${id}`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`/plans/${id}`);
  },

  async listSubscribers(id) {
    const { data } = await api.get(`/plans/${id}/subscribers`);
    return data;
  },

  async subscribe(id) {
    const { data } = await api.post(`/plans/${id}/subscribe`);
    return data;
  },

  async getCurrentSubscription() {
    const { data } = await api.get('/plans/subscriptions/me');
    return data;
  },

  async cancelSubscription() {
    const { data } = await api.delete('/plans/subscriptions/me');
    return data;
  },
};
