import { NextFunction, Request, Response } from 'express';
import { HttpMethod } from './http-method.enum.js';
import { IMiddleware } from './middleware.interface.js';

export interface IRoute {
  path: string;
  method: HttpMethod;
  middlewares?: IMiddleware[];
  handler: (req: Request, res: Response, next: NextFunction) => void;
}

