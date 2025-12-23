import { Expose, Transform } from 'class-transformer';

const DEFAULT_AVATAR_PATH = 'avatars/default-avatar.jpg';

export class UserRdo {
  @Expose()
  public email: string;

  @Expose()
  @Transform(({ value }) => value || DEFAULT_AVATAR_PATH)
  public avatar: string;

  @Expose()
  public firstname: string;

  @Expose()
  public lastname: string;
}
