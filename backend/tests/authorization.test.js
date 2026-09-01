import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app, loginAdmin, registerClient } from './helpers.js';

describe('Autorização por papel (CLIENT / ADMIN)', () => {
  it('deve impedir que um cliente acesse o dashboard administrativo', async () => {
    const client = await registerClient();
    const response = await request(app).get('/api/admin/dashboard').set('Authorization', `Bearer ${client.token}`);
    expect(response.status).toBe(403);
  });

  it('deve impedir que um cliente crie um serviço', async () => {
    const client = await registerClient();
    const response = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${client.token}`)
      .send({ name: 'Serviço Indevido', description: 'x', price: 10, duration: 10 });

    expect(response.status).toBe(403);
  });

  it('deve impedir acesso ao dashboard sem autenticação', async () => {
    const response = await request(app).get('/api/admin/dashboard');
    expect(response.status).toBe(401);
  });

  it('deve permitir que um administrador acesse o dashboard', async () => {
    const token = await loginAdmin();
    const response = await request(app).get('/api/admin/dashboard').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalClients');
    expect(response.body).toHaveProperty('totalBarbers');
  });

  it('deve permitir que um administrador liste os clientes', async () => {
    const token = await loginAdmin();
    const response = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
