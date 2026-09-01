import { z } from 'zod';

export const createPlanSchema = z.object({
  name: z.string().trim().min(2, 'Nome é obrigatório'),
  description: z.string().trim().min(1, 'Descrição é obrigatória'),
  price: z.number().positive('Preço deve ser maior que zero'),
  benefits: z.array(z.string().trim().min(1)).min(1, 'Informe pelo menos um benefício'),
  active: z.boolean().optional(),
});

export const updatePlanSchema = createPlanSchema.partial();
