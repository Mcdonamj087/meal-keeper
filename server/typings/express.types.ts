import {Request} from 'express';
import {ParamsDictionary, Query} from 'express-serve-static-core';

export interface TypedRequestBody<T> extends Request {
  body: T;
}

export interface TypedRequestParams<T extends ParamsDictionary>
  extends Request {
  params: T;
}

export interface TypedRequest<T extends ParamsDictionary, U> extends Request {
  params: T;
  body: U;
}
