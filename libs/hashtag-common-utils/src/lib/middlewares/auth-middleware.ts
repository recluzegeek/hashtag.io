import { IGetUserAuthInfoRequest } from '@hashtag.io-microservices/hashtag-common-types';
import type { NextFunction, Response } from 'express';
import { AppError } from '../app-errors.js';
import { verifyToken } from '../jwt-tokens.js';

// Middleware to protect routes
export const auth = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw AppError.authError('Access Denied.', [
      'Bearer token is missing from request headers.',
    ]);
  }

  try {
    // Verify the token
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};
