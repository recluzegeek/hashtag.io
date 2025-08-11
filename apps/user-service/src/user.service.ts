import User from './user.model';
import bcrypt from 'bcrypt';

import {
  AppError,
  createAccessToken,
  createRefreshToken,
} from '@hashtag.io-microservices/hashtag-common-utils';
import {
  IUser,
  IUserLoginInfo,
} from '@hashtag.io-microservices/hashtag-common-types';

async function getAllUsers(): Promise<IUser[]> {
  const data: IUser[] = await User.find();
  return data;
}

async function createUser(user: IUser) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = { ...user, password: hashedPassword };
  const data = await User.create({ ...newUser });
  return data;
}

async function loginUser(
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const user = await User.findOne({ email });

  if (!user) throw AppError.recordNotFound('User', email);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw AppError.authError();
  }

  const userLoginInfo: IUserLoginInfo = {
    email: user.email,
    userID: user.id,
    username: user.username,
  };

  const accessToken = createAccessToken(userLoginInfo);
  const refreshToken = createRefreshToken(userLoginInfo);
  return { accessToken, refreshToken };
}

export default { getAllUsers, createUser, loginUser };
