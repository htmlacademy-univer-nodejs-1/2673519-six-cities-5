import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { IMiddleware } from '../../../types/index.js';
import { HttpError } from '../errors/index.js';

export class ValidateObjectIdMiddleware implements IMiddleware {
  constructor(
    private readonly paramName: string
  ) {}

  public execute(req: Request, _res: Response, next: NextFunction): void {
    const value = req.params[this.paramName];

    if (!value || !Types.ObjectId.isValid(value)) {
      const error = new HttpError(
        StatusCodes.BAD_REQUEST,
        `Invalid ObjectId for param «${this.paramName}».`
      );
      error.detail = 'ValidateObjectIdMiddleware';
      return next(error);
    }

    next();
  }
}
