import { prisma } from '../src/config/prisma.js';
import { hashPassword } from '../src/utils/hash.js';

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function main() {
  console.log('Limpando dados existentes...');
  await prisma.appointment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.blockedSchedule.deleteMany();
  await prisma.workingHour.deleteMany();
  await prisma.barber.deleteMany();
  await prisma.service.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.user.deleteMany();

  console.log('Criando administrador...');
  const adminPassword = await hashPassword('Admin@123');
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@royalcut.com',
      password: adminPassword,
      phone: '11999990000',
      role: 'ADMIN',
    },
  });

  console.log('Criando clientes...');
  const clientPassword = await hashPassword('Cliente@123');
  const clientsData = [
    { name: 'Carlos Souza', email: 'carlos.souza@example.com', phone: '11988880001' },
    { name: 'Rafael Lima', email: 'rafael.lima@example.com', phone: '11988880002' },
    { name: 'Fernanda Alves', email: 'fernanda.alves@example.com', phone: '11988880003' },
    { name: 'Juliana Costa', email: 'juliana.costa@example.com', phone: '11988880004' },
    { name: 'Marcos Pereira', email: 'marcos.pereira@example.com', phone: '11988880005' },
  ];

  const clients = await Promise.all(
    clientsData.map((data) =>
      prisma.user.create({
        data: { ...data, password: clientPassword, role: 'CLIENT' },
      }),
    ),
  );

  console.log('Criando acessos de login dos barbeiros...');
  const barberLoginPassword = await hashPassword('Barbeiro@123');
  const barberUsersData = [
    { name: 'André', email: 'andre@royalcut.com', phone: '11977770001' },
    { name: 'Davi', email: 'davi@royalcut.com', phone: '11977770002' },
    { name: 'Wendel Samuel', email: 'wendel.samuel@royalcut.com', phone: '11977770003' },
  ];
  const barberUsers = await Promise.all(
    barberUsersData.map((data) =>
      prisma.user.create({ data: { ...data, password: barberLoginPassword, role: 'BARBER' } }),
    ),
  );

  console.log('Criando barbeiros...');
  const barbers = await Promise.all([
    prisma.barber.create({
      data: {
        userId: barberUsers[0].id,
        name: 'André',
        description: 'Especialista em cortes modernos e degradê, com mais de 8 anos de experiência.',
        specialties: ['Cortes modernos', 'Degradê', 'Desenhos'],
        active: true,
      },
    }),
    prisma.barber.create({
      data: {
        userId: barberUsers[1].id,
        name: 'Davi',
        description: 'Referência em barba e cortes clássicos, unindo tradição e precisão.',
        specialties: ['Barba', 'Cortes clássicos', 'Navalha'],
        active: true,
      },
    }),
    prisma.barber.create({
      data: {
        userId: barberUsers[2].id,
        name: 'Wendel Samuel',
        description: 'Versátil em cortes e sobrancelha, sempre atento às últimas tendências.',
        specialties: ['Sobrancelha', 'Cortes infantis', 'Coloração'],
        active: true,
      },
    }),
  ]);

  console.log('Criando serviços...');
  const services = await Promise.all([
    prisma.service.create({
      data: { name: 'Corte Masculino', description: 'Corte de cabelo completo, com acabamento na navalha.', price: 35, duration: 30 },
    }),
    prisma.service.create({
      data: { name: 'Barba', description: 'Modelagem e acabamento de barba com toalha quente.', price: 25, duration: 20 },
    }),
    prisma.service.create({
      data: { name: 'Corte + Barba', description: 'Combo de corte de cabelo completo e barba.', price: 55, duration: 50 },
    }),
    prisma.service.create({
      data: { name: 'Corte + Sobrancelha', description: 'Corte de cabelo completo e design de sobrancelha.', price: 45, duration: 40 },
    }),
    prisma.service.create({
      data: { name: 'Barba + Sobrancelha', description: 'Modelagem de barba e design de sobrancelha.', price: 35, duration: 30 },
    }),
    prisma.service.create({
      data: {
        name: 'Combo Completo',
        description: 'Corte + Barba + Sobrancelha: experiência completa Royal Cut.',
        price: 65,
        duration: 60,
      },
    }),
  ]);

  console.log('Criando planos...');
  const plans = await Promise.all([
    prisma.plan.create({
      data: {
        name: 'Plano Black',
        description: 'Ideal para quem quer manter o visual em dia com economia.',
        price: 79.9,
        benefits: [
          '2 cortes por mês',
          'Agendamento prioritário',
          'Perfil do cliente',
          'Histórico de atendimentos',
          'Pode levar 2 amigos no mês',
        ],
      },
    }),
  ]);

  console.log('Configurando horário de funcionamento...');
  const businessHours = [
    { dayOfWeek: 0, startTime: '00:00', endTime: '00:00', closed: true },
    { dayOfWeek: 1, startTime: '09:00', endTime: '19:00', closed: false },
    { dayOfWeek: 2, startTime: '09:00', endTime: '19:00', closed: false },
    { dayOfWeek: 3, startTime: '09:00', endTime: '19:00', closed: false },
    { dayOfWeek: 4, startTime: '09:00', endTime: '19:00', closed: false },
    { dayOfWeek: 5, startTime: '09:00', endTime: '20:00', closed: false },
    { dayOfWeek: 6, startTime: '08:00', endTime: '18:00', closed: false },
  ];
  await prisma.workingHour.createMany({ data: businessHours.map((h) => ({ ...h, barberId: null })) });

  console.log('Criando assinaturas...');
  await prisma.subscription.create({ data: { clientId: clients[0].id, planId: plans[0].id, status: 'ACTIVE' } });
  await prisma.subscription.create({ data: { clientId: clients[1].id, planId: plans[0].id, status: 'ACTIVE' } });

  console.log('Criando agendamentos de exemplo...');
  await prisma.appointment.create({
    data: {
      clientId: clients[0].id,
      barberId: barbers[0].id,
      serviceId: services[2].id,
      date: new Date(formatDate(addDays(2))),
      startTime: '14:30',
      endTime: '15:20',
      status: 'SCHEDULED',
    },
  });

  await prisma.appointment.create({
    data: {
      clientId: clients[1].id,
      barberId: barbers[1].id,
      serviceId: services[1].id,
      date: new Date(formatDate(addDays(1))),
      startTime: '10:00',
      endTime: '10:20',
      status: 'CONFIRMED',
    },
  });

  await prisma.appointment.create({
    data: {
      clientId: clients[2].id,
      barberId: barbers[2].id,
      serviceId: services[3].id,
      date: new Date(formatDate(addDays(3))),
      startTime: '16:00',
      endTime: '16:40',
      status: 'SCHEDULED',
    },
  });

  await prisma.appointment.create({
    data: {
      clientId: clients[3].id,
      barberId: barbers[0].id,
      serviceId: services[0].id,
      date: new Date(formatDate(addDays(-7))),
      startTime: '11:00',
      endTime: '11:30',
      status: 'COMPLETED',
    },
  });

  await prisma.appointment.create({
    data: {
      clientId: clients[4].id,
      barberId: barbers[1].id,
      serviceId: services[5].id,
      date: new Date(formatDate(addDays(-5))),
      startTime: '15:00',
      endTime: '16:00',
      status: 'COMPLETED',
    },
  });

  await prisma.appointment.create({
    data: {
      clientId: clients[0].id,
      barberId: barbers[2].id,
      serviceId: services[4].id,
      date: new Date(formatDate(addDays(-3))),
      startTime: '09:30',
      endTime: '10:00',
      status: 'CANCELED',
    },
  });

  await prisma.appointment.create({
    data: {
      clientId: clients[1].id,
      barberId: barbers[0].id,
      serviceId: services[0].id,
      date: new Date(formatDate(addDays(-2))),
      startTime: '17:00',
      endTime: '17:30',
      status: 'NO_SHOW',
    },
  });

  console.log('\nSeed concluído com sucesso!');
  console.log('----------------------------------------');
  console.log('Credenciais de demonstração (dados fictícios):');
  console.log(`Administrador: ${admin.email} / Admin@123`);
  console.log('Clientes: carlos.souza@example.com ... marcos.pereira@example.com / Cliente@123');
  console.log('Barbeiros: andre@royalcut.com, davi@..., wendel.samuel@... / Barbeiro@123');
  console.log('----------------------------------------');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
