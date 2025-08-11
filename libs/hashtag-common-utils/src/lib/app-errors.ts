export class AppError extends Error {
  status: string;
  errors: string[];
  statusCode: number;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    errors: string[],
    name?: string,
    isOperational?: boolean
  ) {
    super(message);
    this.name = name || 'AppError';
    this.errors = errors;
    this.statusCode = statusCode;
    this.isOperational = isOperational || true;
    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }

  static recordNotFound(modelName: string, id: string) {
    return new AppError(
      'Record not found.',
      404,
      [`${modelName} with ID ${id} not found`],
      'RecordNotFoundError'
    );
  }

  static authError(
    message = 'Invalid credentials',
    errors: string[] = ['Login failed. Either email or password is invalid.']
  ) {
    return new AppError(message, 401, errors, 'AuthError');
  }
}
