import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

interface PlanInput {
  name: string;
  description: string;
  price: number;
  benefits: string[];
  active?: boolean;
}

export const planService = {
  async listAll(onlyActive: boolean) {
    return prisma.plan.findMany({
      where: onlyActive ? { active: true } : undefined,
      orderBy: { price: 'asc' },
    });
  },

  async getById(id: string) {
    const plan = await prisma.plan.findUnique({ where: { id } });
    if (!plan) {
      throw AppError.notFound('Plano não encontrado');
    }
    return plan;
  },

  async create(data: PlanInput) {
    return prisma.plan.create({ data });
  },

  async update(id: string, data: Partial<PlanInput>) {
    await this.getById(id);
    return prisma.plan.update({ where: { id }, data });
  },

  async remove(id: string) {
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

  async listSubscribers(planId: string) {
    await this.getById(planId);
    return prisma.subscription.findMany({
      where: { planId },
      include: { client: true },
      orderBy: { startDate: 'desc' },
    });
  },
};
