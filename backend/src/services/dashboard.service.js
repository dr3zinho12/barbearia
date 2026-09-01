import { prisma } from '../config/prisma.js';
import { addDaysToDateString, dateStringToDate, todayDateString } from '../utils/time.js';

export const dashboardService = {
  async getSummary() {
    const today = todayDateString();
    const weekEnd = addDaysToDateString(today, 6);
    const todayDate = dateStringToDate(today);
    const weekEndDate = dateStringToDate(weekEnd);

    const [
      totalClients,
      totalBarbers,
      appointmentsToday,
      appointmentsThisWeek,
      cancellationsThisWeek,
      activeSubscriptions,
      completedAppointments,
      nextAppointments,
      servicesRanking,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CLIENT', active: true } }),
      prisma.barber.count({ where: { active: true } }),
      prisma.appointment.count({ where: { date: todayDate, status: { not: 'CANCELED' } } }),
      prisma.appointment.count({
        where: { date: { gte: todayDate, lte: weekEndDate }, status: { not: 'CANCELED' } },
      }),
      prisma.appointment.count({
        where: { date: { gte: todayDate, lte: weekEndDate }, status: 'CANCELED' },
      }),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.appointment.findMany({
        where: { status: 'COMPLETED' },
        include: { service: true },
      }),
      prisma.appointment.findMany({
        where: { date: { gte: todayDate }, status: { in: ['SCHEDULED', 'CONFIRMED'] } },
        orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        take: 5,
        include: { barber: true, service: true, client: true },
      }),
      prisma.appointment.groupBy({
        by: ['serviceId'],
        where: { status: { not: 'CANCELED' } },
        _count: { serviceId: true },
        orderBy: { _count: { serviceId: 'desc' } },
        take: 5,
      }),
    ]);

    const estimatedRevenue = completedAppointments.reduce((sum, appointment) => sum + Number(appointment.service.price), 0);

    const serviceIds = servicesRanking.map((row) => row.serviceId);
    const services = await prisma.service.findMany({ where: { id: { in: serviceIds } } });
    const topServices = servicesRanking.map((row) => {
      const service = services.find((s) => s.id === row.serviceId);
      return { service, count: row._count.serviceId };
    });

    return {
      totalClients,
      totalBarbers,
      appointmentsToday,
      appointmentsThisWeek,
      cancellationsThisWeek,
      activeSubscriptions,
      estimatedRevenue,
      nextAppointments,
      topServices,
    };
  },
};
