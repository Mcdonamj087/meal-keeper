import {Response, NextFunction} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import {TypedRequestBody} from '../typings/express.types';
import User, {IUser} from '../models/user.model';
import {ObjectId} from 'mongoose';

type UserNoPassword = Omit<IUser, 'password'> & {id?: string | ObjectId};

export interface AuthBody {
  user: UserNoPassword;
}

const verifyAuthToken = asyncHandler(
  async (
    req: TypedRequestBody<AuthBody>,
    res: Response,
    next: NextFunction
  ) => {
    let token: string | undefined;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        // Get token from header
        token = authHeader.split(' ')[1];

        // Verify token. If token is expired, the catch block will execute with error
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

        // Get user from the token
        const user = await User.findById((decoded as JwtPayload).id).select(
          '-password'
        );

        console.log(user);

        if (!user) {
          res.status(400);
          throw new Error('No user found');
        }

        // Add user data to request body
        req.body.user = user;
        next();
      } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error('Not authorized');
      }
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  }
);

export default verifyAuthToken;
