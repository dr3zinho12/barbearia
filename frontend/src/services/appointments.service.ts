import { Appointment, AppointmentStatus, AvailabilitySlot, PaginatedResult } from '../types';
import { api } from './api';

export interface CreateAppointmentPayload {
  barberId: string;
  serviceId: string;
  date: string;
  startTime: string;
  notes?: string;
}

export interface ListAppointmentsFilters {
  date?: string;
  barberId?: string;
  clientId?: string;
  serviceId?: string;
  status?: AppointmentStatus;
  page?: number;
  pageSize?: number;
}

export const appointmentsService = {
  async getAvailability(barberId: string, serviceId: string, date: string): Promise<AvailabilitySlot[]> {
    const { data } = await api.get<AvailabilitySlot[]>('/appointments/availability', {
      params: { barberId, serviceId, date },
    });
    return data;
  },

  async create(payload: CreateAppointmentPayload): Promise<Appointment> {
    const { data } = await api.post<Appointment>('/appointments', payload);
    return data;
  },

  async listMine(): Promise<Appointment[]> {
    const { data } = await api.get<Appointment[]>('/appointments/mine');
    return data;
  },

  async listAll(filters: ListAppointmentsFilters): Promise<PaginatedResult<Appointment>> {
    const { data } = await api.get<PaginatedResult<Appointment>>('/appointments', { params: filters });
    return data;
  },

  async cancel(id: string): Promise<Appointment> {
    const { data } = await api.put<Appointment>(`/appointments/${id}/cancel`);
    return data;
  },

  async reschedule(id: string, payload: { date: string; startTime: string }): Promise<Appointment> {
    const { data } = await api.put<Appointment>(`/appointments/${id}/reschedule`, payload);
    return data;
  },

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const { data } = await api.put<Appointment>(`/appointments/${id}/status`, { status });
    return data;
  },
};
