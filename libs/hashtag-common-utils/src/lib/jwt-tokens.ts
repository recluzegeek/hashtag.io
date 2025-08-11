import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

import { selectedConfig } from './config.js';

import { IUserLoginInfo } from '@hashtag.io-microservices/hashtag-common-types';

import type { Response } from 'express';
import { AppError } from './app-errors.js';
import { successResponse } from './response-handler.js';

function createAccessToken(data: IUserLoginInfo): string {
  return sign({ data }, selectedConfig.secrets.accessTokenSecret, {
    // TODO: increased expiration time, should revert back to 15 in prod.
    expiresIn: 1500 * 60, // expires in 15 mins
  });
}

function createRefreshToken(data: IUserLoginInfo): string {
  return sign({ data }, selectedConfig.secrets.refreshTokenSecret, {
    expiresIn: '90d',
  });
}

function sendTokens(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days in ms
  });

  successResponse(res, { accessToken }, 'Sign in Successful.');
}

function sendRefreshToken(res: Response, refreshToken: string): void {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
  });
}

function verifyJwtToken(token: string): IUserLoginInfo {
  try {
    const decoded = verify(token, selectedConfig.secrets.accessTokenSecret) as {
      data: IUserLoginInfo;
    };
    return decoded.data;
  } catch (err) {
    throw AppError.authError('Invalid or expired token.', [
      err instanceof Error ? err.message : 'Token verification failed.',
    ]);
  }
}

export {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
  sendTokens,
  verifyJwtToken,
};
