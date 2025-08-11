import type { NextFunction, Request, Response } from 'express';

import userService from './user.service';
import { IUser } from '@hashtag.io-microservices/hashtag-common-types';
import {
  sendTokens,
  successResponse,
} from '@hashtag.io-microservices/hashtag-common-utils';

async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user: IUser = req.body;
    const data: IUser = await userService.createUser(user);
    successResponse(res, { id: data.id }, 'User saved successfuly!');
  } catch (err) {
    next(err);
  }
}

async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await userService.loginUser(
      email,
      password
    );
    sendTokens(res, accessToken, refreshToken);
  } catch (error) {
    next(error);
  }
}

async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie('refreshToken');
    successResponse(res, {}, 'Logout Successfully');
  } catch (error) {
    next(error);
  }
}

// async function forgotPassword(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {}

export default { register, login, logout };
