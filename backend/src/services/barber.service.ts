import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { hashPassword } from '../utils/hash';

interface BarberInput {
  name: string;
  description: string;
  photoUrl?: string;
  specialties: string[];
  active?: boolean;
}

interface OwnProfileInput {
  description?: string;
  photoUrl?: string;
  specialties?: string[];
}

interface GrantLoginInput {
  email: string;
  phone: string;
  password: string;
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

  async getByUserId(userId: string) {
    const barber = await prisma.barber.findUnique({
      where: { userId },
      include: { workingHours: { orderBy: { dayOfWeek: 'asc' } } },
    });
    if (!barber) {
      throw AppError.notFound('Perfil de barbeiro não encontrado para este usuário');
    }
    return barber;
  },

  async updateOwnProfile(userId: string, data: OwnProfileInput) {
    const barber = await this.getByUserId(userId);
    return prisma.barber.update({ where: { id: barber.id }, data });
  },

  async grantLogin(barberId: string, data: GrantLoginInput) {
    const barber = await this.getById(barberId);

    if (barber.userId) {
      throw AppError.conflict('Este barbeiro já possui um acesso de login');
    }

    const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingEmail) {
      throw AppError.conflict('Já existe uma conta cadastrada com este e-mail');
    }

    const hashed = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: { name: barber.name, email: data.email, phone: data.phone, password: hashed, role: 'BARBER' },
    });

    return prisma.barber.update({ where: { id: barberId }, data: { userId: user.id } });
  },
};
