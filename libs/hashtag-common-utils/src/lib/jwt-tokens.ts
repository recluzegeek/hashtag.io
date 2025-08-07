import pkg, { type JwtPayload } from 'jsonwebtoken';
import { ValidationError } from './errors/validation-error.js';

import UserLoginInfo from '@hashtag-common-types';

// interface UserLoginInfo {
//   userID: string;
//   email: string;
//   name: string;
// }

import { selectedConfig } from './config.js';

const { sign, verify } = pkg;

import type { Response } from 'express';
import { successResponse } from './response-handler.js';

function createAccessToken(data: UserLoginInfo): string {
  return sign({ data }, selectedConfig.secrets.accessTokenSecret, {
    expiresIn: 15 * 60, // expires in 15 mins
  });
}

function createRefreshToken(data: UserLoginInfo): string {
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

function verifyToken(
  token: string,
  secret: string,
  errorMessage: string
): JwtPayload {
  const payload = verify(token, secret) as JwtPayload;
  if (!payload?.userID) {
    throw new ValidationError([errorMessage]);
  }
  return payload;
}

export {
  createAccessToken,
  sendTokens,
  createRefreshToken,
  sendRefreshToken,
  verifyToken,
};
