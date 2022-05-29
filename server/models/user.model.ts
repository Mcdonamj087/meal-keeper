import {Schema, model} from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
  },
  {
    timestamps: true,
  }
);

export default model('User', userSchema);
