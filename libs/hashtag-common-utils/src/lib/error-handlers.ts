import type { Response } from 'express';
import { AppError } from './errors/app-errors.js';
import mongoose from 'mongoose';
import logger from './logger.js';

export const handleError = (err: AppError, res: Response) => {
  if (err instanceof mongoose.Error.ValidationError) {
    logger.warn(`Validation Error:  ${JSON.stringify(err.errors, null, 2)}`);
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors,
    });
  }

  // Custom app errors
  if (err instanceof AppError) {
    logger.error(`[AppError] ${err.name}: ${err.message}`);
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  //   if (err.isOperational) {
  //   	logger.error(`Operational Error: ${err}`);
  //   	return res.status(err.statusCode).json({
  //   		status: err.status,
  //   		message: err.message,
  //   	});
  //   }

  logger.error(`ERROR: ${err}`);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};
