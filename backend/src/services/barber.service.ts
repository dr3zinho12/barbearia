import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

interface BarberInput {
  name: string;
  description: string;
  photoUrl?: string;
  specialties: string[];
  active?: boolean;
}

interface DayWorkingHour {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  closed: boolean;
}

export const barberService = {
  async listAll(onlyActive: boolean) {
    return prisma.barber.findMany({
      where: onlyActive ? { active: true } : undefined,
      orderBy: { name: 'asc' },
    });
  },

  async getById(id: string) {
    const barber = await prisma.barber.findUnique({
      where: { id },
      include: { workingHours: { orderBy: { dayOfWeek: 'asc' } } },
    });
    if (!barber) {
      throw AppError.notFound('Barbeiro não encontrado');
    }
    return barber;
  },

  async create(data: BarberInput) {
    return prisma.barber.create({ data });
  },

  async update(id: string, data: Partial<BarberInput>) {
    await this.getById(id);
    return prisma.barber.update({ where: { id }, data });
  },

  async remove(id: string) {
    await this.getById(id);
    const linkedAppointments = await prisma.appointment.count({ where: { barberId: id } });

    if (linkedAppointments > 0) {
      return prisma.barber.update({ where: { id }, data: { active: false } });
    }

    await prisma.workingHour.deleteMany({ where: { barberId: id } });
    await prisma.blockedSchedule.deleteMany({ where: { barberId: id } });
    return prisma.barber.delete({ where: { id } });
  },

  async setWorkingHours(barberId: string, workingHours: DayWorkingHour[]) {
    await this.getById(barberId);

    await prisma.$transaction([
      prisma.workingHour.deleteMany({ where: { barberId } }),
      prisma.workingHour.createMany({
        data: workingHours.map((wh) => ({ ...wh, barberId })),
      }),
    ]);

    return prisma.workingHour.findMany({ where: { barberId }, orderBy: { dayOfWeek: 'asc' } });
  },
};
