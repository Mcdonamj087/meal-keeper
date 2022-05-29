import {Response, NextFunction} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import {TypedRequestBody} from '../typings/express.types';
import User, {IUser} from '../models/user.model';

type UserNoPassword = Omit<IUser, 'password'> & {id: string};

export interface AuthBody {
  user: UserNoPassword;
}

const protect = asyncHandler(
  async (
    req: TypedRequestBody<AuthBody>,
    res: Response,
    next: NextFunction
  ) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        // Get user from the token
        const user: UserNoPassword = await User.findById(
          (decoded as JwtPayload).id
        ).select('-password');

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

export default protect;
