import mongoose, { Schema } from 'mongoose';
import { IUser } from '@hashtag-common-types';

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, 'First Name too short'],
      maxLength: [50, 'First Name too long'],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, 'Last Name too short'],
      maxLength: [50, 'Last Name too long'],
    },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    address: String,
    city: String,
    zip: Number,
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
