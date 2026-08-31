import { z } from 'zod';

export const createBarberSchema = z.object({
  name: z.string().trim().min(2, 'Nome é obrigatório'),
  description: z.string().trim().min(1, 'Descrição é obrigatória'),
  photoUrl: z.string().trim().url('URL de foto inválida').optional().or(z.literal('')),
  specialties: z.array(z.string().trim().min(1)).default([]),
  active: z.boolean().optional(),
});

export const updateBarberSchema = createBarberSchema.partial();

const dayWorkingHourSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário inválido'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário inválido'),
  closed: z.boolean().default(false),
});

export const setBarberWorkingHoursSchema = z.object({
  workingHours: z.array(dayWorkingHourSchema).length(7, 'Informe os 7 dias da semana'),
});
