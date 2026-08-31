export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }

  static notFound(message = 'Recurso não encontrado'): AppError {
    return new AppError(message, 404);
  }

  static unauthorized(message = 'Não autenticado'): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message = 'Acesso negado'): AppError {
    return new AppError(message, 403);
  }

  static conflict(message = 'Conflito de dados'): AppError {
    return new AppError(message, 409);
  }
}
