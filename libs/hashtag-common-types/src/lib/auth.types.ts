import { Request } from 'express';

// for jwt payload storage
export interface IUserLoginInfo {
  email: string;
  userID: string;
  username: string;
}

// extending the express Request object with custom properties
export interface IGetUserAuthInfoRequest extends Request {
  user?: IUserLoginInfo;
}
