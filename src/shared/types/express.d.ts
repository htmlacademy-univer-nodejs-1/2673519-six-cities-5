import type { TokenPayload } from '../libs/auth/index.js';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export {};
