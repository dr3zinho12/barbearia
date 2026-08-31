import { z } from 'zod';

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida. Utilize o formato AAAA-MM-DD');
const timeStringSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário inválido. Utilize o formato HH:mm');

export const availabilityQuerySchema = z.object({
  barberId: z.string().uuid('Barbeiro inválido'),
  serviceId: z.string().uuid('Serviço inválido'),
  date: dateStringSchema,
});

export const createAppointmentSchema = z.object({
  barberId: z.string().uuid('Barbeiro inválido'),
  serviceId: z.string().uuid('Serviço inválido'),
  date: dateStringSchema,
  startTime: timeStringSchema,
  notes: z.string().trim().max(500).optional(),
});

export const rescheduleAppointmentSchema = z.object({
  date: dateStringSchema,
  startTime: timeStringSchema,
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELED', 'NO_SHOW']),
});

export const listAppointmentsQuerySchema = z.object({
  date: dateStringSchema.optional(),
  barberId: z.string().uuid().optional(),
  clientId: z.string().uuid().optional(),
  serviceId: z.string().uuid().optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELED', 'NO_SHOW']).optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
});
