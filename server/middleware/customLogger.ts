import {Request, Response, NextFunction} from 'express';
import logEvents from '../helpers/logEvents';

export const customLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logEvents(
    `${req.method}    ${req.headers.origin}   ${req.url}`,
    'requestLog.txt'
  );
  next();
};
