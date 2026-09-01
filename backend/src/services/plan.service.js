import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export const planService = {
  async listAll(onlyActive) {
    return prisma.plan.findMany({
      where: onlyActive ? { active: true } : undefined,
      orderBy: { price: 'asc' },
    });
  },

  async getById(id) {
    const plan = await prisma.plan.findUnique({ where: { id } });
    if (!plan) {
      throw AppError.notFound('Plano não encontrado');
    }
    return plan;
  },

  async create(data) {
    return prisma.plan.create({ data });
  },

  async update(id, data) {
    await this.getById(id);
    return prisma.plan.update({ where: { id }, data });
  },

  async remove(id) {
    await this.getById(id);
    const activeSubscriptions = await prisma.subscription.count({ where: { planId: id, status: 'ACTIVE' } });

    if (activeSubscriptions > 0) {
      return prisma.plan.update({ where: { id }, data: { active: false } });
    }

    const anySubscription = await prisma.subscription.count({ where: { planId: id } });
    if (anySubscription > 0) {
      return prisma.plan.update({ where: { id }, data: { active: false } });
    }

    return prisma.plan.delete({ where: { id } });
  },

  async listSubscribers(planId) {
    await this.getById(planId);
    return prisma.subscription.findMany({
      where: { planId },
      include: { client: true },
      orderBy: { startDate: 'desc' },
    });
  },
};
