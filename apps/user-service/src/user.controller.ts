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
      resetUrl: `${selectedConfig.services.userService.url}/reset/${token}`,
    };

    await amqConnection.publish(
      selectedConfig.queues.passwordResetQueue,
      selectedConfig.routingKeys.passwordForget, // routing key
      payload
    );

    logger.info(`Token "${token}" sent to email: ${email}`);
    res.send('Email queued!');
  } catch (error) {
    next(error);
  }
}

export default { register, login, logout, forgotPassword };
