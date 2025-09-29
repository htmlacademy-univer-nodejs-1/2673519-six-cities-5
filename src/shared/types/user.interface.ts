import { UserType } from './user-type.type.js';

export interface User {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  type: UserType;
}
