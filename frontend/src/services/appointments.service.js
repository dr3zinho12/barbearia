import { api } from './api';

export const appointmentsService = {
  async getAvailability(barberId, serviceId, date) {
    const { data } = await api.get('/appointments/availability', {
      params: { barberId, serviceId, date },
    });
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/appointments', payload);
    return data;
  },

  async listMine() {
    const { data } = await api.get('/appointments/mine');
    return data;
  },

  async listAll(filters) {
    const { data } = await api.get('/appointments', { params: filters });
    return data;
  },

  async cancel(id) {
    const { data } = await api.put(`/appointments/${id}/cancel`);
    return data;
  },

  async reschedule(id, payload) {
    const { data } = await api.put(`/appointments/${id}/reschedule`, payload);
    return data;
  },

  async updateStatus(id, status) {
    const { data } = await api.put(`/appointments/${id}/status`, { status });
    return data;
  },
};
