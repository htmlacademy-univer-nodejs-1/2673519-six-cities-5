import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { IMiddleware } from '../../../types/index.js';
import { HttpError } from '../errors/index.js';

export class ValidateDtoMiddleware implements IMiddleware {
  constructor(
    private readonly dtoClass: ClassConstructor<object>
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const instance = plainToInstance(this.dtoClass, req.body);
    const errors = await validate(instance, {
      whitelist: true,
      forbidUnknownValues: true,
    });

    if (errors.length > 0) {
      const messages = errors
        .flatMap((error) => Object.values(error.constraints ?? {}))
        .join('; ');

      const httpError = new HttpError(
        StatusCodes.BAD_REQUEST,
        messages || 'Validation failed.'
      );
      httpError.detail = 'ValidateDtoMiddleware';
      return next(httpError);
    }

    req.body = instance;
    next();
  }
}
