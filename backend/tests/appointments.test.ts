import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app, loginAdmin, registerClient } from './helpers';

function futureDateString(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().slice(0, 10);
}

async function createFullyOpenBarberAndService(adminToken: string) {
  const barberResponse = await request(app)
    .post('/api/barbers')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Barbeiro de Teste', description: 'x', specialties: ['Corte'] });

  const barberId = barberResponse.body.id;

  const allDaysOpen = Array.from({ length: 7 }, (_, dayOfWeek) => ({
    dayOfWeek,
    startTime: '00:00',
    endTime: '23:30',
    closed: false,
  }));

  await request(app)
    .put(`/api/barbers/${barberId}/working-hours`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ workingHours: allDaysOpen });

  const serviceResponse = await request(app)
    .post('/api/services')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Serviço de Teste de Agendamento', description: 'x', price: 30, duration: 30 });

  return { barberId, serviceId: serviceResponse.body.id };
}

describe('Sistema de agendamento', () => {
  it('deve calcular horários disponíveis considerando o expediente do barbeiro', async () => {
    const adminToken = await loginAdmin();
    const client = await registerClient();
    const { barberId, serviceId } = await createFullyOpenBarberAndService(adminToken);
    const date = futureDateString(5);

    const response = await request(app)
      .get('/api/appointments/availability')
      .query({ barberId, serviceId, date })
      .set('Authorization', `Bearer ${client.token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('deve criar um agendamento com sucesso em um horário disponível', async () => {
    const adminToken = await loginAdmin();
    const client = await registerClient();
    const { barberId, serviceId } = await createFullyOpenBarberAndService(adminToken);
    const date = futureDateString(6);

    const availability = await request(app)
      .get('/api/appointments/availability')
      .query({ barberId, serviceId, date })
      .set('Authorization', `Bearer ${client.token}`);

    const [slot] = availability.body;

    const response = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${client.token}`)
      .send({ barberId, serviceId, date, startTime: slot.startTime });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('SCHEDULED');
  });

  it('deve impedir dois agendamentos conflitantes para o mesmo barbeiro e horário', async () => {
    const adminToken = await loginAdmin();
    const clientA = await registerClient();
    const clientB = await registerClient();
    const { barberId, serviceId } = await createFullyOpenBarberAndService(adminToken);
    const date = futureDateString(7);

    const availability = await request(app)
      .get('/api/appointments/availability')
      .query({ barberId, serviceId, date })
      .set('Authorization', `Bearer ${clientA.token}`);

    const [slot] = availability.body;

    const firstBooking = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${clientA.token}`)
      .send({ barberId, serviceId, date, startTime: slot.startTime });

    expect(firstBooking.status).toBe(201);

    const conflictingBooking = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${clientB.token}`)
      .send({ barberId, serviceId, date, startTime: slot.startTime });

    expect(conflictingBooking.status).toBe(409);
  });

  it('deve permitir que o cliente cancele o próprio agendamento e libere o horário', async () => {
    const adminToken = await loginAdmin();
    const client = await registerClient();
    const { barberId, serviceId } = await createFullyOpenBarberAndService(adminToken);
    const date = futureDateString(8);

    const availability = await request(app)
      .get('/api/appointments/availability')
      .query({ barberId, serviceId, date })
      .set('Authorization', `Bearer ${client.token}`);

    const [slot] = availability.body;

    const booking = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${client.token}`)
      .send({ barberId, serviceId, date, startTime: slot.startTime });

    const cancelResponse = await request(app)
      .put(`/api/appointments/${booking.body.id}/cancel`)
      .set('Authorization', `Bearer ${client.token}`);

    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body.status).toBe('CANCELED');

    const availabilityAfterCancel = await request(app)
      .get('/api/appointments/availability')
      .query({ barberId, serviceId, date })
      .set('Authorization', `Bearer ${client.token}`);

    expect(availabilityAfterCancel.body).toContainEqual(slot);
  });

  it('não deve permitir que um cliente cancele o agendamento de outro cliente', async () => {
    const adminToken = await loginAdmin();
    const clientA = await registerClient();
    const clientB = await registerClient();
    const { barberId, serviceId } = await createFullyOpenBarberAndService(adminToken);
    const date = futureDateString(9);

    const availability = await request(app)
      .get('/api/appointments/availability')
      .query({ barberId, serviceId, date })
      .set('Authorization', `Bearer ${clientA.token}`);

    const [slot] = availability.body;

    const booking = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${clientA.token}`)
      .send({ barberId, serviceId, date, startTime: slot.startTime });

    const response = await request(app)
      .put(`/api/appointments/${booking.body.id}/cancel`)
      .set('Authorization', `Bearer ${clientB.token}`);

    expect(response.status).toBe(403);
  });
});
