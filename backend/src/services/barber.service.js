import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { hashPassword } from '../utils/hash.js';

// O SQLite não tem um tipo de lista nativo: specialties é salvo como texto
// JSON no banco e precisa ser convertido na escrita.
function toBarberWriteData(data) {
  if (data.specialties === undefined) return data;
  return { ...data, specialties: JSON.stringify(data.specialties) };
}

export const barberService = {
  async listAll(onlyActive) {
    return prisma.barber.findMany({
      where: onlyActive ? { active: true } : undefined,
      orderBy: { name: 'asc' },
    });
  },

  async getById(id) {
    const barber = await prisma.barber.findUnique({
      where: { id },
      include: { workingHours: { orderBy: { dayOfWeek: 'asc' } } },
    });
    if (!barber) {
      throw AppError.notFound('Barbeiro não encontrado');
    }
    return barber;
  },

  async create(data) {
    return prisma.barber.create({ data: toBarberWriteData(data) });
  },

  async update(id, data) {
    const existing = await this.getById(id);
    const updated = await prisma.barber.update({ where: { id }, data: toBarberWriteData(data) });

    // Mantém o nome de exibição da conta de login sincronizado com o
    // nome público do barbeiro, quando houver uma conta vinculada.
    if (data.name && existing.userId) {
      await prisma.user.update({ where: { id: existing.userId }, data: { name: data.name } });
    }

    return updated;
  },

  async remove(id) {
    await this.getById(id);
    const linkedAppointments = await prisma.appointment.count({ where: { barberId: id } });

    if (linkedAppointments > 0) {
      return prisma.barber.update({ where: { id }, data: { active: false } });
    }

    await prisma.workingHour.deleteMany({ where: { barberId: id } });
    await prisma.blockedSchedule.deleteMany({ where: { barberId: id } });
    return prisma.barber.delete({ where: { id } });
  },

  async setWorkingHours(barberId, workingHours) {
    await this.getById(barberId);

    await prisma.$transaction([
      prisma.workingHour.deleteMany({ where: { barberId } }),
      prisma.workingHour.createMany({
        data: workingHours.map((wh) => ({ ...wh, barberId })),
      }),
    ]);

    return prisma.workingHour.findMany({ where: { barberId }, orderBy: { dayOfWeek: 'asc' } });
  },

  async getByUserId(userId) {
    const barber = await prisma.barber.findUnique({
      where: { userId },
      include: { workingHours: { orderBy: { dayOfWeek: 'asc' } } },
    });
    if (!barber) {
      throw AppError.notFound('Perfil de barbeiro não encontrado para este usuário');
    }
    return barber;
  },

  async updateOwnProfile(userId, data) {
    const barber = await this.getByUserId(userId);
    return prisma.barber.update({ where: { id: barber.id }, data: toBarberWriteData(data) });
  },

  async grantLogin(barberId, data) {
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
