import type { NextFunction, Request, Response } from 'express';

import {
  IForgetPasswordNotification,
  IUser,
} from '@hashtag.io-microservices/hashtag-common-types';
import {
  amqConnection,
  AppError,
  logger,
  selectedConfig,
  sendTokens,
  successResponse,
} from '@hashtag.io-microservices/hashtag-common-utils';
import User from './user.model';
import userService from './user.service';

import crypto from 'crypto';

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

async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw AppError.recordNotFound('User', email);
    const token = crypto.randomBytes(20).toString('hex');

    user.passwordResetToken = token;
    await user.save();

    // dispatch forget password email notification job
    const payload: IForgetPasswordNotification = {
      email,
      resetToken: token,
      // TODO: update this reset url accordingly
      resetUrl: `localhost:3500/${token}`,
    };

    await amqConnection.sendToQueue(
      selectedConfig.queues.passwordResetQueue,
      payload
    );

    logger.info(`Token sent via email ${token}`);
    res.send('Email Queued...!');
  } catch (error) {
    next(error);
  }
}

export default { register, login, logout, forgotPassword };
