import { z } from 'zod';

const timeStringSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário inválido. Utilize o formato HH:mm');

const dayHourSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: timeStringSchema,
  endTime: timeStringSchema,
  closed: z.boolean().default(false),
});

export const setBusinessHoursSchema = z.object({
  workingHours: z.array(dayHourSchema).length(7, 'Informe os 7 dias da semana'),
});

export const createBlockedScheduleSchema = z.object({
  barberId: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida. Utilize o formato AAAA-MM-DD'),
  startTime: timeStringSchema,
  endTime: timeStringSchema,
  reason: z.string().trim().max(200).optional(),
});
