import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';

export const serviceService = {
  async listAll(onlyActive) {
    return prisma.service.findMany({
      where: onlyActive ? { active: true } : undefined,
      orderBy: { name: 'asc' },
    });
  },

  async getById(id) {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw AppError.notFound('Serviço não encontrado');
    }
    return service;
  },

  async create(data) {
    return prisma.service.create({ data });
  },

  async update(id, data) {
    await this.getById(id);
    return prisma.service.update({ where: { id }, data });
  },

  async remove(id) {
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
