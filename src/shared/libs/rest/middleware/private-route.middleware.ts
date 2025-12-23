import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IMiddleware } from '../../../types/index.js';
import { HttpError } from '../errors/index.js';
import { IAuthService } from '../../auth/index.js';

function extractBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

export class PrivateRouteMiddleware implements IMiddleware {
  constructor(
    private readonly authService: IAuthService,
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      const error = new HttpError(StatusCodes.UNAUTHORIZED, 'Authorization required.');
      error.detail = 'PrivateRouteMiddleware';
      return next(error);
    }

    try {
      req.user = await this.authService.verify(token);
      return next();
    } catch {
      const error = new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid token.');
      error.detail = 'PrivateRouteMiddleware';
      return next(error);
    }
  }
}
