import type { Response } from 'express';
import { AppError } from './app-errors.js';

export const successResponse = (
  res: Response,
  _data: unknown = {},
  message = 'Success',
  statusCode = 200
): Response => {
  let data = _data;
  if (
    (Array.isArray(_data) && _data.length === 0) ||
    (typeof _data === 'string' && _data.length === 0)
  ) {
    data = 'No Record Found';
  }
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

export const sendErrorResponse = (res: Response, err: AppError) => {
  const { status, statusCode, message, errors } = err;
  return res.status(err.statusCode).json({
    status,
    statusCode,
    message,
    ...(errors && { errors }),
  });
};
