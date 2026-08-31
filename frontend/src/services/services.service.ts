import { Service } from '../types';
import { api } from './api';

export interface ServicePayload {
  name: string;
  description: string;
  price: number;
  duration: number;
  active?: boolean;
}

export const servicesService = {
  async list(): Promise<Service[]> {
    const { data } = await api.get<Service[]>('/services');
    return data;
  },

  async getById(id: string): Promise<Service> {
    const { data } = await api.get<Service>(`/services/${id}`);
    return data;
  },

  async create(payload: ServicePayload): Promise<Service> {
    const { data } = await api.post<Service>('/services', payload);
    return data;
  },

  async update(id: string, payload: Partial<ServicePayload>): Promise<Service> {
    const { data } = await api.put<Service>(`/services/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/services/${id}`);
  },
};
