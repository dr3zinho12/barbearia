import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { comparePassword, hashPassword } from '../utils/hash';
import { signResetToken, signToken, verifyResetToken } from '../utils/jwt';
import { LoginInput, RegisterInput } from '../validators/auth.validator';

function sanitizeUser<T extends { password: string }>(user: T) {
  const { password: _password, ...rest } = user;
  return rest;
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw AppError.conflict('Já existe uma conta cadastrada com este e-mail');
    }

    const hashed = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashed,
        phone: input.phone,
        role: 'CLIENT',
      },
    });

    const token = signToken({ sub: user.id, role: user.role });
    return { user: sanitizeUser(user), token };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.active) {
      throw AppError.unauthorized('E-mail ou senha inválidos');
    }

    const passwordMatches = await comparePassword(input.password, user.password);
    if (!passwordMatches) {
      throw AppError.unauthorized('E-mail ou senha inválidos');
    }

    const token = signToken({ sub: user.id, role: user.role });
    return { user: sanitizeUser(user), token };
  },

  async getById(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw AppError.notFound('Usuário não encontrado');
    }
    return sanitizeUser(user);
  },

  async updateProfile(userId: string, data: { name?: string; phone?: string }) {
    const user = await prisma.user.update({ where: { id: userId }, data });
    return sanitizeUser(user);
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const matches = await comparePassword(currentPassword, user.password);
    if (!matches) {
      throw AppError.unauthorized('Senha atual incorreta');
    }
    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  },

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Não revela se o e-mail existe ou não na base.
      return { message: 'Se o e-mail existir em nossa base, um link de recuperação será enviado.' };
    }

    const resetToken = signResetToken(user.id);
    // Projeto acadêmico sem serviço de e-mail configurado: o token é
    // retornado diretamente na resposta para permitir a demonstração do
    // fluxo completo. Em produção, seria enviado por e-mail ao usuário.
    return {
      message: 'Se o e-mail existir em nossa base, um link de recuperação será enviado.',
      resetToken,
    };
  },

  async resetPassword(token: string, newPassword: string) {
    let userId: string;
    try {
      userId = verifyResetToken(token);
    } catch {
      throw AppError.unauthorized('Token de recuperação inválido ou expirado');
    }

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  },
};
