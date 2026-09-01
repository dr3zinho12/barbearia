import { business } from '../config/business.js';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import {
  addDaysToDateString,
  dateStringToDate,
  dayOfWeekFromDateString,
  minutesToTime,
  nowMinutesOfDay,
  rangesOverlap,
  timeToMinutes,
  todayDateString,
} from '../utils/time.js';

const ACTIVE_STATUSES = ['SCHEDULED', 'CONFIRMED', 'COMPLETED'];

async function getWorkingHoursForDay(barberId, dayOfWeek) {
  const barberHours = await prisma.workingHour.findFirst({ where: { barberId, dayOfWeek } });
  if (barberHours) {
    return barberHours;
  }
  return prisma.workingHour.findFirst({ where: { barberId: null, dayOfWeek } });
}

function assertBookableDate(date) {
  const today = todayDateString();
  if (date < today) {
    throw new AppError('Não é possível agendar em uma data passada');
  }
  const maxDate = addDaysToDateString(today, business.maxBookingHorizonDays);
  if (date > maxDate) {
    throw new AppError(`Só é possível agendar com até ${business.maxBookingHorizonDays} dias de antecedência`);
  }
}

async function computeAvailableSlots(
  barberId,
  serviceId,
  date,
  excludeAppointmentId,
) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !service.active) {
    throw AppError.notFound('Serviço não encontrado ou indisponível');
  }

  const barber = await prisma.barber.findUnique({ where: { id: barberId } });
  if (!barber || !barber.active) {
    throw AppError.notFound('Barbeiro não encontrado ou indisponível');
  }

  const dayOfWeek = dayOfWeekFromDateString(date);
  const workingHours = await getWorkingHoursForDay(barberId, dayOfWeek);

  if (!workingHours || workingHours.closed) {
    return [];
  }

  const dateObj = dateStringToDate(date);

  const [blockedSchedules, existingAppointments] = await Promise.all([
    prisma.blockedSchedule.findMany({ where: { date: dateObj, OR: [{ barberId }, { barberId: null }] } }),
    prisma.appointment.findMany({
      where: {
        barberId,
        date: dateObj,
        status: { in: ACTIVE_STATUSES },
        ...(excludeAppointmentId ? { id: { not: excludeAppointmentId } } : {}),
      },
    }),
  ]);

  const dayStart = timeToMinutes(workingHours.startTime);
  const dayEnd = timeToMinutes(workingHours.endTime);
  const slots = [];

  for (let start = dayStart; start + service.duration <= dayEnd; start += business.slotStepMinutes) {
    const startTime = minutesToTime(start);
    const endTime = minutesToTime(start + service.duration);

    const isBlocked = blockedSchedules.some((b) => rangesOverlap(startTime, endTime, b.startTime, b.endTime));
    const isTaken = existingAppointments.some((a) => rangesOverlap(startTime, endTime, a.startTime, a.endTime));

    if (!isBlocked && !isTaken) {
      slots.push({ startTime, endTime });
    }
  }

  return slots;
}

export const appointmentService = {
  async getAvailability(barberId, serviceId, date) {
    assertBookableDate(date);
    let slots = await computeAvailableSlots(barberId, serviceId, date);

    if (date === todayDateString()) {
      const now = nowMinutesOfDay();
      slots = slots.filter((slot) => timeToMinutes(slot.startTime) > now);
    }

    return slots;
  },

  async create(clientId, input) {
    assertBookableDate(input.date);

    const service = await prisma.service.findUnique({ where: { id: input.serviceId } });
    if (!service || !service.active) {
      throw AppError.notFound('Serviço não encontrado ou indisponível');
    }

    const endTime = minutesToTime(timeToMinutes(input.startTime) + service.duration);

    return prisma.$transaction(async (tx) => {
      const availableSlots = await computeAvailableSlots(input.barberId, input.serviceId, input.date);
      const isStillAvailable = availableSlots.some(
        (slot) => slot.startTime === input.startTime && slot.endTime === endTime,
      );

      if (!isStillAvailable) {
        throw AppError.conflict('Este horário não está mais disponível. Escolha outro horário.');
      }

      return tx.appointment.create({
        data: {
          clientId,
          barberId: input.barberId,
          serviceId: input.serviceId,
          date: dateStringToDate(input.date),
          startTime: input.startTime,
          endTime,
          notes: input.notes,
          status: 'SCHEDULED',
        },
        include: { barber: true, service: true, client: true },
      });
    });
  },

  async listMine(clientId) {
    return prisma.appointment.findMany({
      where: { clientId },
      orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
      include: { barber: true, service: true },
    });
  },

  async listAll(filters) {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;

    const where = {
      ...(filters.date ? { date: dateStringToDate(filters.date) } : {}),
      ...(filters.barberId ? { barberId: filters.barberId } : {}),
      ...(filters.clientId ? { clientId: filters.clientId } : {}),
      ...(filters.serviceId ? { serviceId: filters.serviceId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    };

    const [total, appointments] = await Promise.all([
      prisma.appointment.count({ where }),
      prisma.appointment.findMany({
        where,
        orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
        include: { barber: true, service: true, client: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return { data: appointments, meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) } };
  },

  async getById(id) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { barber: true, service: true, client: true },
    });
    if (!appointment) {
      throw AppError.notFound('Agendamento não encontrado');
    }
    return appointment;
  },

  async cancel(id, requester) {
    const appointment = await this.getById(id);

    if (requester.role === 'CLIENT') {
      if (appointment.clientId !== requester.id) {
        throw AppError.forbidden('Você não pode cancelar um agendamento de outro cliente');
      }
      this.assertCancellableByClient(appointment.date, appointment.startTime);
    }

    if (appointment.status === 'CANCELED' || appointment.status === 'COMPLETED') {
      throw new AppError('Este agendamento não pode mais ser cancelado');
    }

    return prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELED' },
      include: { barber: true, service: true, client: true },
    });
  },

  assertCancellableByClient(date, startTime) {
    // `date` guarda apenas o dia (meia-noite UTC); combinamos o dia com o
    // horário local para comparar com o relógio local do servidor, do
    // mesmo modo que a disponibilidade de horários é calculada.
    const [hours, minutes] = startTime.split(':').map(Number);
    const appointmentDateTime = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hours, minutes);

    const noticeMs = business.minCancellationNoticeHours * 60 * 60 * 1000;
    if (appointmentDateTime.getTime() - Date.now() < noticeMs) {
      throw new AppError(
        `Cancelamentos ou remarcações devem ser feitos com pelo menos ${business.minCancellationNoticeHours}h de antecedência`,
      );
    }
  },

  async reschedule(id, requester, newDate, newStartTime) {
    const appointment = await this.getById(id);

    if (requester.role === 'CLIENT' && appointment.clientId !== requester.id) {
      throw AppError.forbidden('Você não pode remarcar um agendamento de outro cliente');
    }

    if (appointment.status === 'CANCELED' || appointment.status === 'COMPLETED') {
      throw new AppError('Este agendamento não pode mais ser remarcado');
    }

    if (requester.role === 'CLIENT') {
      this.assertCancellableByClient(appointment.date, appointment.startTime);
    }

    assertBookableDate(newDate);
    const endTime = minutesToTime(timeToMinutes(newStartTime) + (await prisma.service.findUniqueOrThrow({ where: { id: appointment.serviceId } })).duration);

    return prisma.$transaction(async (tx) => {
      const availableSlots = await computeAvailableSlots(appointment.barberId, appointment.serviceId, newDate, id);
      const isAvailable = availableSlots.some((slot) => slot.startTime === newStartTime && slot.endTime === endTime);

      if (!isAvailable) {
        throw AppError.conflict('Este horário não está mais disponível. Escolha outro horário.');
      }

      return tx.appointment.update({
        where: { id },
        data: { date: dateStringToDate(newDate), startTime: newStartTime, endTime, status: 'SCHEDULED' },
        include: { barber: true, service: true, client: true },
      });
    });
  },

  async updateStatus(id, status, requester) {
    const appointment = await this.getById(id);

    if (requester?.role === 'BARBER' && appointment.barberId !== requester.barberId) {
      throw AppError.forbidden('Você só pode atualizar agendamentos da sua própria agenda');
    }

    return prisma.appointment.update({
      where: { id },
      data: { status },
      include: { barber: true, service: true, client: true },
    });
  },
};
