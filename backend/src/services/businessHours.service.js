import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export const businessHoursService = {
  async getBusinessHours() {
    return prisma.workingHour.findMany({ where: { barberId: null }, orderBy: { dayOfWeek: 'asc' } });
  },

  async setBusinessHours(workingHours) {
    await prisma.$transaction([
      prisma.workingHour.deleteMany({ where: { barberId: null } }),
      prisma.workingHour.createMany({ data: workingHours.map((wh) => ({ ...wh, barberId: null })) }),
    ]);
    return this.getBusinessHours();
  },

  async listBlockedSchedules(params) {
    return prisma.blockedSchedule.findMany({
      where: {
        ...(params.barberId ? { barberId: params.barberId } : {}),
        ...(params.from || params.to
          ? {
              date: {
                ...(params.from ? { gte: new Date(params.from) } : {}),
                ...(params.to ? { lte: new Date(params.to) } : {}),
              },
            }
          : {}),
      },
      include: { barber: true },
      orderBy: { date: 'asc' },
    });
  },

  async createBlockedSchedule(data) {
    return prisma.blockedSchedule.create({
      data: {
        barberId: data.barberId,
        date: new Date(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        reason: data.reason,
      },
    });
  },

  async getBlockedScheduleById(id) {
    const blocked = await prisma.blockedSchedule.findUnique({ where: { id } });
    if (!blocked) {
      throw AppError.notFound('Bloqueio não encontrado');
    }
    return blocked;
  },

  async removeBlockedSchedule(id) {
    await prisma.blockedSchedule.delete({ where: { id } });
  },
};
