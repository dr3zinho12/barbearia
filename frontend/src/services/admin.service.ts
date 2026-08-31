import { ClientDetail, DashboardSummary, PaginatedResult, User } from '../types';
import { api } from './api';

export interface ListClientsFilters {
  search?: string;
  active?: boolean;
  page?: number;
  pageSize?: number;
}

export const adminService = {
  async getDashboard(): Promise<DashboardSummary> {
    const { data } = await api.get<DashboardSummary>('/admin/dashboard');
    return data;
  },

  async listClients(filters: ListClientsFilters): Promise<PaginatedResult<User>> {
    const { data } = await api.get<PaginatedResult<User>>('/admin/users', { params: filters });
    return data;
  },

  async getClient(id: string): Promise<ClientDetail> {
    const { data } = await api.get<ClientDetail>(`/admin/users/${id}`);
    return data;
  },

  async updateClient(id: string, payload: { name?: string; phone?: string; active?: boolean }): Promise<User> {
    const { data } = await api.put<User>(`/admin/users/${id}`, payload);
    return data;
  },

  async listAdmins(): Promise<User[]> {
    const { data } = await api.get<User[]>('/admin/admins');
    return data;
  },

  async createAdmin(payload: { name: string; email: string; phone: string; password: string }): Promise<User> {
    const { data } = await api.post<User>('/admin/admins', payload);
    return data;
  },
};
