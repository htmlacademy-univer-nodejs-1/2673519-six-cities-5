import { inject, injectable } from 'inversify';
import { createSecretKey } from 'node:crypto';
import { jwtVerify, SignJWT } from 'jose';
import { Component } from '../../types/index.js';
import { IConfig, RestSchema } from '../config/index.js';
import { IAuthService, TokenPayload } from './auth-service.interface.js';

@injectable()
export class JwtService implements IAuthService {
  private readonly secretKey: ReturnType<typeof createSecretKey>;
  private readonly expiresIn: string;

  constructor(
    @inject(Component.Config) private readonly configService: IConfig<RestSchema>,
  ) {
    const secret = this.configService.get('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is required');
    }

    this.secretKey = createSecretKey(new TextEncoder().encode(secret));
    this.expiresIn = this.configService.get('JWT_EXPIRES_IN');
  }

  public async sign(payload: TokenPayload): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(this.expiresIn)
      .sign(this.secretKey);
  }

  public async verify(token: string): Promise<TokenPayload> {
    const { payload } = await jwtVerify(token, this.secretKey, { algorithms: ['HS256'] });
    return payload as TokenPayload;
  }
}
