import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

interface ServiceInput {
  name: string;
  description: string;
  price: number;
  duration: number;
  active?: boolean;
}

export const serviceService = {
  async listAll(onlyActive: boolean) {
    return prisma.service.findMany({
      where: onlyActive ? { active: true } : undefined,
      orderBy: { name: 'asc' },
    });
  },

  async getById(id: string) {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw AppError.notFound('Serviço não encontrado');
    }
    return service;
  },

  async create(data: ServiceInput) {
    return prisma.service.create({ data });
  },

  async update(id: string, data: Partial<ServiceInput>) {
    await this.getById(id);
    return prisma.service.update({ where: { id }, data });
  },

  async remove(id: string) {
    await this.getById(id);
    const linkedAppointments = await prisma.appointment.count({ where: { serviceId: id } });

    if (linkedAppointments > 0) {
      // Não é possível excluir um serviço com agendamentos vinculados
      // (histórico precisa ser preservado); apenas desativa.
      return prisma.service.update({ where: { id }, data: { active: false } });
    }

    return prisma.service.delete({ where: { id } });
  },
};
