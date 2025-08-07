import User from './user.model';
import bcrypt from 'bcrypt';

import {
  RecordNotFoundError,
  InvalidCredentialsError,
  createAccessToken,
  createRefreshToken,
} from '@hashtag.io-microservices/hashtag-common-utils';
import {
  IUser,
  UserLoginInfo,
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

  if (!user) throw new RecordNotFoundError('User', email);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new InvalidCredentialsError();
  }

  const userLoginInfo: UserLoginInfo = {
    email: user.email,
    userID: user.id,
    username: user.username,
  };

  const accessToken = createAccessToken(userLoginInfo);
  const refreshToken = createRefreshToken(userLoginInfo);
  return { accessToken, refreshToken };
}

export default { getAllUsers, createUser, loginUser };
