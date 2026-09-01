import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
}

// Middleware centralizado de tratamento de erros. Deve ser o último
// middleware registrado na aplicação.
export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(422).json({
      message: 'Dados inválidos',
      errors: err.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
    });
    return;
  }

  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor' });
}
