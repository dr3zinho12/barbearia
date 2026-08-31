import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app, loginAdmin, registerClient } from './helpers';

describe('CRUD de serviços', () => {
  it('deve permitir que um administrador crie, edite e desative um serviço', async () => {
    const token = await loginAdmin();

    const createResponse = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Serviço de Teste', description: 'Descrição de teste', price: 40, duration: 30 });

    expect(createResponse.status).toBe(201);
    const serviceId = createResponse.body.id;

    const updateResponse = await request(app)
      .put(`/api/services/${serviceId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 50 });

    expect(updateResponse.status).toBe(200);
    expect(Number(updateResponse.body.price)).toBe(50);

    const deleteResponse = await request(app).delete(`/api/services/${serviceId}`).set('Authorization', `Bearer ${token}`);
    expect(deleteResponse.status).toBe(204);
  });

  it('deve listar apenas serviços ativos para visitantes não autenticados', async () => {
    const token = await loginAdmin();
    await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Serviço Inativo', description: 'x', price: 10, duration: 10, active: false });

    const response = await request(app).get('/api/services');

    expect(response.status).toBe(200);
    expect(response.body.every((service: { active: boolean }) => service.active)).toBe(true);
  });

  it('não deve permitir criar serviço com preço inválido', async () => {
    const token = await loginAdmin();
    const response = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Serviço Inválido', description: 'x', price: -10, duration: 30 });

    expect(response.status).toBe(422);
  });

  it('não deve permitir que um cliente edite um serviço', async () => {
    const token = await loginAdmin();
    const client = await registerClient();

    const createResponse = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Serviço Protegido', description: 'x', price: 20, duration: 20 });

    const response = await request(app)
      .put(`/api/services/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${client.token}`)
      .send({ price: 999 });

    expect(response.status).toBe(403);
  });
});
