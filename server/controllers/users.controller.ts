import {Response} from 'express';
import asyncHandler from 'express-async-handler';
import {HydratedDocument} from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {TypedRequestBody} from '../typings/express.types';

import User, {IUser} from '../models/user.model';

/**
 * @desc    Register User
 * @route   POST /api/users
 * @access  Public
 */
const registerUser = asyncHandler(
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
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
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

const loginUser = asyncHandler(
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
        token: generateToken(user.id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid credentials');
    }
  }
);

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

// Generate JWT
function generateToken(id: string) {
  return jwt.sign({id}, process.env.JWT_SECRET!, {expiresIn: '30d'});
}

export default {
  registerUser,
  loginUser,
  getMe,
};
