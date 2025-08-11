import type { Response } from 'express';
import { AppError } from './app-errors.js';
import logger from './logger.js';
import { sendErrorResponse } from './response-handler.js';

export const handleError = (err: AppError, res: Response) => {
  if (err.name === 'AuthError') {
    logger.warn(`Authentication Error: ${JSON.stringify(err.errors, null, 2)}`);
    return sendErrorResponse(res, err);
  }

  // Custom app errors
  if (err instanceof AppError) {
    logger.error(`[AppError] ${err.name}: ${err.message}`);
    return sendErrorResponse(res, err);
  }

  logger.error(`ERROR: ${err}`);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};
