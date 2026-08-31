import { Plan, Subscription } from '../types';
import { api } from './api';

export interface PlanPayload {
  name: string;
  description: string;
  price: number;
  benefits: string[];
  active?: boolean;
}

export const plansService = {
  async list(): Promise<Plan[]> {
    const { data } = await api.get<Plan[]>('/plans');
    return data;
  },

  async getById(id: string): Promise<Plan> {
    const { data } = await api.get<Plan>(`/plans/${id}`);
    return data;
  },

  async create(payload: PlanPayload): Promise<Plan> {
    const { data } = await api.post<Plan>('/plans', payload);
    return data;
  },

  async update(id: string, payload: Partial<PlanPayload>): Promise<Plan> {
    const { data } = await api.put<Plan>(`/plans/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/plans/${id}`);
  },

  async listSubscribers(id: string): Promise<Subscription[]> {
    const { data } = await api.get<Subscription[]>(`/plans/${id}/subscribers`);
    return data;
  },

  async subscribe(id: string): Promise<Subscription> {
    const { data } = await api.post<Subscription>(`/plans/${id}/subscribe`);
    return data;
  },

  async getCurrentSubscription(): Promise<Subscription | null> {
    const { data } = await api.get<Subscription | null>('/plans/subscriptions/me');
    return data;
  },

  async cancelSubscription(): Promise<Subscription> {
    const { data } = await api.delete<Subscription>('/plans/subscriptions/me');
    return data;
  },
};
