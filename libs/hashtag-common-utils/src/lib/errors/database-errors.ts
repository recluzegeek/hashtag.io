import { AppError } from "./app-errors.js";

class DatabaseError extends AppError {
	constructor(message = 'Database operation failed', errors: string[] = [], statusCode = 500) {
		super(message, statusCode, errors);
		this.name = 'DatabaseError';
	}
}

export class RecordNotFoundError extends DatabaseError {
	constructor(modelName = 'Record', id = '', statusCode = 404) {
		super('Record Not Found', [`${modelName} with ID ${id} not found`], statusCode);
		this.name = 'RecordNotFoundError';
	}
}


export class InvalidCredentialsError extends DatabaseError {
	constructor(statusCode = 401) {
		super('Invalid Credentials', ['Login failed. Invalid email or password.'], statusCode);
		this.name = 'InvalidCredentialsError';
	}
}