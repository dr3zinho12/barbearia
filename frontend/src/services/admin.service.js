import { api } from './api';

export const adminService = {
  async getDashboard() {
    const { data } = await api.get('/admin/dashboard');
    return data;
  },

  async listClients(filters) {
    const { data } = await api.get('/admin/users', { params: filters });
    return data;
  },

  async getClient(id) {
    const { data } = await api.get(`/admin/users/${id}`);
    return data;
  },

  async updateClient(id, payload) {
    const { data } = await api.put(`/admin/users/${id}`, payload);
    return data;
  },

  async listAdmins() {
    const { data } = await api.get('/admin/admins');
    return data;
  },

  async createAdmin(payload) {
    const { data } = await api.post('/admin/admins', payload);
    return data;
  },
};
