export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }

  static notFound(message = 'Recurso não encontrado') {
    return new AppError(message, 404);
  }

  static unauthorized(message = 'Não autenticado') {
    return new AppError(message, 401);
  }

  static forbidden(message = 'Acesso negado') {
    return new AppError(message, 403);
  }

  static conflict(message = 'Conflito de dados') {
    return new AppError(message, 409);
  }
}
