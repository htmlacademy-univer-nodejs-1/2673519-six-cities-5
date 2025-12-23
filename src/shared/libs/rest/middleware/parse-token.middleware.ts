import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from '../../../types/index.js';
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

export class ParseTokenMiddleware implements IMiddleware {
  constructor(
    private readonly authService: IAuthService,
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      return next();
    }

    try {
      req.user = await this.authService.verify(token);
    } catch {
      // ignore
    }

    return next();
  }
}
