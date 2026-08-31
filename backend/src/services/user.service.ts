import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { hashPassword } from '../utils/hash';
import { CreateAdminInput } from '../validators/user.validator';

function sanitizeUser<T extends { password: string }>(user: T) {
  const { password: _password, ...rest } = user;
  return rest;
}

interface ListUsersParams {
  search?: string;
  active?: boolean;
  page?: number;
  pageSize?: number;
}

export const userService = {
  async listClients(params: ListUsersParams) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;

    const where: Prisma.UserWhereInput = {
      role: 'CLIENT',
      ...(params.active !== undefined ? { active: params.active } : {}),
      ...(params.search
        ? {
            OR: [
              { name: { contains: params.search, mode: 'insensitive' } },
              { email: { contains: params.search, mode: 'insensitive' } },
              { phone: { contains: params.search } },
            ],
          }
        : {}),
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      data: users.map(sanitizeUser),
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getClientDetail(id: string) {
    const user = await prisma.user.findFirst({ where: { id, role: 'CLIENT' } });
    if (!user) {
      throw AppError.notFound('Cliente não encontrado');
    }

    const [appointments, subscription] = await Promise.all([
      prisma.appointment.findMany({
        where: { clientId: id },
        orderBy: { date: 'desc' },
        include: { barber: true, service: true },
      }),
      prisma.subscription.findFirst({
        where: { clientId: id, status: 'ACTIVE' },
        include: { plan: true },
        orderBy: { startDate: 'desc' },
      }),
    ]);

    return { ...sanitizeUser(user), appointments, subscription };
  },

  async updateClient(id: string, data: { name?: string; phone?: string; active?: boolean }) {
    const user = await prisma.user.findFirst({ where: { id, role: 'CLIENT' } });
    if (!user) {
      throw AppError.notFound('Cliente não encontrado');
    }
    const updated = await prisma.user.update({ where: { id }, data });
    return sanitizeUser(updated);
  },

  async listAdmins() {
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, orderBy: { name: 'asc' } });
    return admins.map(sanitizeUser);
  },

  async createAdmin(data: CreateAdminInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw AppError.conflict('Já existe uma conta cadastrada com este e-mail');
    }

    const hashed = await hashPassword(data.password);
    const admin = await prisma.user.create({
      data: { name: data.name, email: data.email, phone: data.phone, password: hashed, role: 'ADMIN' },
    });

    return sanitizeUser(admin);
  },
};
