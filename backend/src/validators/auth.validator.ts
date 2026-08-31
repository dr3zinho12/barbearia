import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(6, 'A senha deve ter pelo menos 6 caracteres')
  .regex(/[A-Za-z]/, 'A senha deve conter pelo menos uma letra')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número');

const phoneSchema = z
  .string()
  .regex(/^\d{10,11}$/, 'Telefone inválido. Utilize DDD + número, apenas dígitos (10 ou 11 dígitos)');

export const registerSchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().trim().toLowerCase().email('E-mail inválido'),
  password: passwordSchema,
  phone: phoneSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres').optional(),
  phone: phoneSchema.optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('E-mail inválido'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  newPassword: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
