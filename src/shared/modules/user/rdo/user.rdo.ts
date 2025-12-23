import { Expose, Transform } from 'class-transformer';
import { UserType } from '../../../types/index.js';

const DEFAULT_AVATAR_PATH = 'avatars/default-avatar.jpg';

export class UserRdo {
  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  @Transform(({ value }) => value || DEFAULT_AVATAR_PATH)
  public avatar: string;

  @Expose()
  public type: UserType;
}
