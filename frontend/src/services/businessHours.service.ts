import { BlockedSchedule, WorkingHour } from '../types';
import { api } from './api';

export interface DayHourPayload {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  closed: boolean;
}

export interface BlockedSchedulePayload {
  barberId?: string;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

export const businessHoursService = {
  async get(): Promise<WorkingHour[]> {
    const { data } = await api.get<WorkingHour[]>('/business-hours');
    return data;
  },

  async set(workingHours: DayHourPayload[]): Promise<WorkingHour[]> {
    const { data } = await api.put<WorkingHour[]>('/business-hours', { workingHours });
    return data;
  },

  async listBlocked(): Promise<BlockedSchedule[]> {
    const { data } = await api.get<BlockedSchedule[]>('/business-hours/blocked');
    return data;
  },

  async createBlocked(payload: BlockedSchedulePayload): Promise<BlockedSchedule> {
    const { data } = await api.post<BlockedSchedule>('/business-hours/blocked', payload);
    return data;
  },

  async removeBlocked(id: string): Promise<void> {
    await api.delete(`/business-hours/blocked/${id}`);
  },
};
