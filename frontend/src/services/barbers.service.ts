import { Barber, BlockedSchedule, WorkingHour } from '../types';
import { api } from './api';

export interface BarberPayload {
  name: string;
  description: string;
  photoUrl?: string;
  specialties: string[];
  active?: boolean;
}

export interface DayWorkingHourPayload {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  closed: boolean;
}

export interface OwnBarberProfilePayload {
  description?: string;
  photoUrl?: string;
  specialties?: string[];
}

export interface GrantBarberLoginPayload {
  email: string;
  phone: string;
  password: string;
}

export interface BarberBreakPayload {
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

export const barbersService = {
  async list(): Promise<Barber[]> {
    const { data } = await api.get<Barber[]>('/barbers');
    return data;
  },

  async getById(id: string): Promise<Barber> {
    const { data } = await api.get<Barber>(`/barbers/${id}`);
    return data;
  },

  async create(payload: BarberPayload): Promise<Barber> {
    const { data } = await api.post<Barber>('/barbers', payload);
    return data;
  },

  async update(id: string, payload: Partial<BarberPayload>): Promise<Barber> {
    const { data } = await api.put<Barber>(`/barbers/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/barbers/${id}`);
  },

  async setWorkingHours(id: string, workingHours: DayWorkingHourPayload[]): Promise<WorkingHour[]> {
    const { data } = await api.put<WorkingHour[]>(`/barbers/${id}/working-hours`, { workingHours });
    return data;
  },

  async grantLogin(id: string, payload: GrantBarberLoginPayload): Promise<Barber> {
    const { data } = await api.post<Barber>(`/barbers/${id}/login`, payload);
    return data;
  },

  async getMe(): Promise<Barber> {
    const { data } = await api.get<Barber>('/barbers/me');
    return data;
  },

  async updateMe(payload: OwnBarberProfilePayload): Promise<Barber> {
    const { data } = await api.put<Barber>('/barbers/me', payload);
    return data;
  },

  async listMyBreaks(): Promise<BlockedSchedule[]> {
    const { data } = await api.get<BlockedSchedule[]>('/barbers/me/breaks');
    return data;
  },

  async createMyBreak(payload: BarberBreakPayload): Promise<BlockedSchedule> {
    const { data } = await api.post<BlockedSchedule>('/barbers/me/breaks', payload);
    return data;
  },

  async removeMyBreak(id: string): Promise<void> {
    await api.delete(`/barbers/me/breaks/${id}`);
  },
};
