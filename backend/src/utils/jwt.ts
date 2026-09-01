import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  sub: string;
  role: Role;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
}

interface ResetTokenPayload {
  sub: string;
  type: 'password_reset';
}

// Token de curta duração usado no fluxo de recuperação de senha. Em um
// ambiente de produção seria enviado por e-mail; neste projeto acadêmico,
// sem serviço de e-mail configurado, a API o retorna diretamente na resposta
// (documentado claramente como comportamento de demonstração).
export function signResetToken(userId: string): string {
  return jwt.sign({ sub: userId, type: 'password_reset' } as ResetTokenPayload, env.jwtSecret, {
    expiresIn: '15m',
  });
}

export function verifyResetToken(token: string): string {
  const payload = jwt.verify(token, env.jwtSecret) as ResetTokenPayload;
  if (payload.type !== 'password_reset') {
    throw new Error('Token inválido');
  }
  return payload.sub;
}
