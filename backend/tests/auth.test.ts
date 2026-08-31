import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app, uniqueEmail } from './helpers';

describe('Autenticação', () => {
  it('deve cadastrar um novo cliente e retornar um token', async () => {
    const email = uniqueEmail('novo.cliente');
    const response = await request(app).post('/api/auth/register').send({
      name: 'Novo Cliente',
      email,
      password: 'Senha@123',
      phone: '11987654321',
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe(email);
    expect(response.body.user.role).toBe('CLIENT');
    expect(response.body.user.password).toBeUndefined();
  });

  it('não deve permitir cadastro com e-mail já utilizado', async () => {
    const email = uniqueEmail('duplicado');
    const payload = { name: 'Cliente', email, password: 'Senha@123', phone: '11987654321' };

    await request(app).post('/api/auth/register').send(payload);
    const response = await request(app).post('/api/auth/register').send(payload);

    expect(response.status).toBe(409);
  });

  it('não deve permitir cadastro com senha fraca', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Cliente Fraco',
      email: uniqueEmail('fraco'),
      password: '123',
      phone: '11987654321',
    });

    expect(response.status).toBe(422);
  });

  it('deve autenticar um usuário com credenciais válidas', async () => {
    const email = uniqueEmail('login.valido');
    const password = 'Senha@123';
    await request(app).post('/api/auth/register').send({ name: 'Login Valido', email, password, phone: '11987654321' });

    const response = await request(app).post('/api/auth/login').send({ email, password });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('não deve autenticar com senha incorreta', async () => {
    const email = uniqueEmail('login.invalido');
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Login Invalido', email, password: 'Senha@123', phone: '11987654321' });

    const response = await request(app).post('/api/auth/login').send({ email, password: 'SenhaErrada@123' });

    expect(response.status).toBe(401);
  });

  it('deve retornar os dados do usuário autenticado em /me', async () => {
    const email = uniqueEmail('me');
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Usuário Me', email, password: 'Senha@123', phone: '11987654321' });

    const response = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${registerResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(email);
  });

  it('deve rejeitar acesso a /me sem token', async () => {
    const response = await request(app).get('/api/auth/me');
    expect(response.status).toBe(401);
  });
});
