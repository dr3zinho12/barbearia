import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().trim().min(2, 'Nome é obrigatório'),
  description: z.string().trim().min(1, 'Descrição é obrigatória'),
  price: z.number().positive('Preço deve ser maior que zero'),
  duration: z.number().int().positive('Duração deve ser maior que zero (em minutos)'),
  active: z.boolean().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();
