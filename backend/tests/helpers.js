import request from 'supertest';
import { createApp } from '../src/app.js';

export const app = createApp();

let counter = 0;
export function uniqueEmail(prefix) {
  counter += 1;
  return `${prefix}.${Date.now()}.${counter}@example.com`;
}

export async function registerClient(name = 'Cliente Teste') {
  const email = uniqueEmail('cliente.teste');
  const response = await request(app).post('/api/auth/register').send({
    name,
    email,
    password: 'Senha@123',
    phone: '11987654321',
  });

  return { token: response.body.token, email, id: response.body.user.id };
}

export async function loginAdmin() {
  const response = await request(app).post('/api/auth/login').send({
    email: 'admin@royalcut.com',
    password: 'Admin@123',
  });

  if (!response.body.token) {
    throw new Error(
      'Login do administrador de demonstração falhou. Execute "npm run seed" antes de rodar os testes.',
    );
  }

  return response.body.token;
}
