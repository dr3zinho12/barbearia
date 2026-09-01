import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../utils/jwt.js';

export function authenticate(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw AppError.unauthorized('Token de autenticação não fornecido');
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    throw AppError.unauthorized('Token inválido ou expirado');
  }
}

// Tenta autenticar sem falhar caso não haja token — usado em rotas públicas
// que exibem mais informação quando o requisitante é um administrador
// autenticado (ex.: listagem de serviços/barbeiros incluindo inativos).
export function optionalAuthenticate(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next();
    return;
  }

  try {
    const payload = verifyToken(header.slice('Bearer '.length));
    req.user = { id: payload.sub, role: payload.role };
  } catch {
    // Token inválido em rota pública: ignora e segue sem usuário autenticado.
  }
  next();
}

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      throw AppError.unauthorized();
    }
    if (!roles.includes(req.user.role)) {
      throw AppError.forbidden('Você não tem permissão para acessar este recurso');
    }
    next();
  };
}
