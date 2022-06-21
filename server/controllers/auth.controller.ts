import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import {generateAccessToken, generateRefreshToken} from '../helpers/tokens';
import {HydratedDocument} from 'mongoose';
import {Request, Response} from 'express';
import {TypedRequestBody} from '../typings/express.types';
import User, {IUser} from '../models/user.model';

/**
 * @desc    Register User
 * @route   POST /api/users
 * @access  Public
 */
const register = asyncHandler(
  async (req: TypedRequestBody<IUser>, res: Response) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    // Check if user exists
    const userExists = await User.findOne({email});
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.cookie('jwt', generateRefreshToken(user.id), {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        accessToken: generateAccessToken(user.id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  }
);

/**
 * @desc    Authenticate User
 * @route   POST /api/users/login
 * @access  Public
 */
const login = asyncHandler(
  async (
    req: TypedRequestBody<{
      email: string;
      password: string;
    }>,
    res: Response
  ) => {
    const {email, password} = req.body;

    // Check for user email
    const user = await User.findOne({email});

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        accessToken: generateAccessToken(user.id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid credentials');
    }
  }
);

/**
 * @desc    Log user out / delete refreshToken cookie
 * @route   GET /api/users/logout
 * @access  Public
 */
const logout = asyncHandler(async (req: Request, res: Response) => {
  // On client, also delete the accessToken
  const cookies = req.cookies;
  // If no jwt cookie found, then we
  if (!cookies?.jwt) {
    res.status(204); // No content
    throw new Error('Missing refresh token cookie.');
  }

  const refreshToken = cookies.jwt;

  try {
    await User.findOneAndUpdate({refreshToken}, {refreshToken: ''});

    res.clearCookie('jwt', {httpOnly: true, secure: true, sameSite: 'none'});
    res.sendStatus(204); // No Content
  } catch (error) {
    console.log(error);
    res.status(403); // Forbidden
    throw new Error('Refresh token expired.');
  }
});

/**
 * @desc    Get user data
 * @route   GET /api/users/me
 * @access  Private
 */
const getMe = asyncHandler(
  async (req: TypedRequestBody<{user: {id: string}}>, res: Response) => {
    const user: HydratedDocument<IUser> | null = await User.findById(
      req.body.user.id
    );
    const {_id, name, email} = user!;

    res.status(200).json({
      id: _id,
      name,
      email,
    });
  }
);

export default {
  register,
  login,
  logout,
  getMe,
};
