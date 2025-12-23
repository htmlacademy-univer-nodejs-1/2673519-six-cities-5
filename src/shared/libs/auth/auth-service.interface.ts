import { JWTPayload } from 'jose';

export type TokenPayload = JWTPayload & {
  id: string;
  email: string;
};

export interface IAuthService {
  sign(payload: TokenPayload): Promise<string>;
  verify(token: string): Promise<TokenPayload>;
}
