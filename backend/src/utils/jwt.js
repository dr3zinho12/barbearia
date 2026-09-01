import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

// Token de curta duração usado no fluxo de recuperação de senha. Em um
// ambiente de produção seria enviado por e-mail; neste projeto acadêmico,
// sem serviço de e-mail configurado, a API o retorna diretamente na resposta
// (documentado claramente como comportamento de demonstração).
export function signResetToken(userId) {
  return jwt.sign({ sub: userId, type: 'password_reset' }, env.jwtSecret, {
    expiresIn: '15m',
  });
}

export function verifyResetToken(token) {
  const payload = jwt.verify(token, env.jwtSecret);
  if (payload.type !== 'password_reset') {
    throw new Error('Token inválido');
  }
  return payload.sub;
}
