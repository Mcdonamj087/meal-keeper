import {Request, Response} from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import {generateAccessToken, TokenPayload} from '../helpers/tokens';
import User from '../models/user.model';

const getNewRefreshToken = asyncHandler(async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.sendStatus(401);
    return;
  }
  const refreshToken = cookies.jwt;

  try {
    const user = await User.findOne({refreshToken});
    if (user) {
      // evaluate JWT
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      );
      // Check if refreshToken id is same as found user
      if (user.id !== (decoded as TokenPayload).id) res.sendStatus(403); // Forbidden
      // Create a new access token
      const accessToken = generateAccessToken(user.id);
      res.json({accessToken});
    } else {
      res.sendStatus(403); // Forbidden
    }
  } catch (error) {
    console.log(error);
    res.status(403);
    throw new Error('Authorization expired.');
  }
});

export default {
  getNewRefreshToken,
};
