import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ message: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
}

// Middleware centralizado de tratamento de erros. Deve ser o último
// middleware registrado na aplicação.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
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
