import {Schema, model} from 'mongoose';
import {generateRefreshToken} from '../helpers/tokens';

export interface IUser {
  name: string;
  email: string;
  password: string;
  refreshToken: string;
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
    refreshToken: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', function (next) {
  this.refreshToken = generateRefreshToken(this.id);
  next();
});

export default model<IUser>('User', userSchema);
