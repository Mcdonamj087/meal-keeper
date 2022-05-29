import mongoose from 'mongoose';
import {Request, Response, NextFunction} from 'express';

export const isValidMongoId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.params.id !== undefined) {
    const isValidId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!isValidId) {
      res.status(400);
      throw new Error('Invalid MongoDB _id');
    }
  }
  next();
};
