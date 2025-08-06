import { type Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  age: number;
  email: string;
  address?: string;
  city?: string;
  zip?: number;
}