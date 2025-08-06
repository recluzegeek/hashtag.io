import { AppError } from "./app-errors.js";

export class ValidationError extends AppError {
	constructor(errors: string[] = [], statusCode = 422) {
		super('Validation Failed', statusCode, errors);
		this.name = 'ValidationError';
	}
}