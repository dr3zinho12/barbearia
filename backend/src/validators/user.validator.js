import { z } from 'zod';

export const listUsersQuerySchema = z.object({
  search: z.string().trim().optional(),
  active: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
});

export const adminUpdateUserSchema = z.object({
  name: z.string().trim().min(3).optional(),
  phone: z
    .string()
    .regex(/^\d{10,11}$/, 'Telefone inválido. Utilize DDD + número, apenas dígitos (10 ou 11 dígitos)')
    .optional(),
  active: z.boolean().optional(),
});

export const createAdminSchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().trim().toLowerCase().email('E-mail inválido'),
  phone: z
    .string()
    .regex(/^\d{10,11}$/, 'Telefone inválido. Utilize DDD + número, apenas dígitos (10 ou 11 dígitos)'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .regex(/[A-Za-z]/, 'A senha deve conter pelo menos uma letra')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número'),
});
