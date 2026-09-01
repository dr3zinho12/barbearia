import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export const subscriptionService = {
  async getCurrentForClient(clientId) {
    return prisma.subscription.findFirst({
      where: { clientId, status: 'ACTIVE' },
      include: { plan: true },
      orderBy: { startDate: 'desc' },
    });
  },

  async subscribe(clientId, planId) {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan || !plan.active) {
      throw AppError.notFound('Plano não encontrado ou indisponível');
    }

    const existing = await prisma.subscription.findFirst({ where: { clientId, status: 'ACTIVE' } });
    if (existing) {
      await prisma.subscription.update({ where: { id: existing.id }, data: { status: 'CANCELED', endDate: new Date() } });
    }

    return prisma.subscription.create({
      data: { clientId, planId, status: 'ACTIVE' },
      include: { plan: true },
    });
  },

  async cancel(clientId) {
    const subscription = await prisma.subscription.findFirst({ where: { clientId, status: 'ACTIVE' } });
    if (!subscription) {
      throw AppError.notFound('Você não possui uma assinatura ativa');
    }

    return prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'CANCELED', endDate: new Date() },
      include: { plan: true },
    });
  },
};
