import {Request, Response, NextFunction} from 'express';
import logEvents from '../helpers/logEvents';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log events to errorLog.txt
  logEvents(`${err.name}: ${err.message}`, 'errorLog.txt');
  const statusCode = res.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};
