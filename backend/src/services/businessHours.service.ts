import { prisma } from '../config/prisma';

interface DayWorkingHour {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  closed: boolean;
}

export const businessHoursService = {
  async getBusinessHours() {
    return prisma.workingHour.findMany({ where: { barberId: null }, orderBy: { dayOfWeek: 'asc' } });
  },

  async setBusinessHours(workingHours: DayWorkingHour[]) {
    await prisma.$transaction([
      prisma.workingHour.deleteMany({ where: { barberId: null } }),
      prisma.workingHour.createMany({ data: workingHours.map((wh) => ({ ...wh, barberId: null })) }),
    ]);
    return this.getBusinessHours();
  },

  async listBlockedSchedules(params: { barberId?: string; from?: string; to?: string }) {
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

  async createBlockedSchedule(data: { barberId?: string; date: string; startTime: string; endTime: string; reason?: string }) {
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

  async removeBlockedSchedule(id: string) {
    await prisma.blockedSchedule.delete({ where: { id } });
  },
};
