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

export type ListUsersQueryInput = z.infer<typeof listUsersQuerySchema>;

export const adminUpdateUserSchema = z.object({
  name: z.string().trim().min(3).optional(),
  phone: z
    .string()
    .regex(/^\d{10,11}$/, 'Telefone inválido. Utilize DDD + número, apenas dígitos (10 ou 11 dígitos)')
    .optional(),
  active: z.boolean().optional(),
});
