export class AppError extends Error {
	statusCode: number;
	status: string;
	isOperational: boolean;
	errors: string[];

	constructor(message: string, statusCode: number, errors: string[]) {
		super(message);
		this.errors = errors;
		this.isOperational = true;
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error';

		Error.captureStackTrace(this, this.constructor);
	}
}