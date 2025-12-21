import { IsEmail, IsIn, IsOptional, IsString, Length } from 'class-validator';
import { UserType, userTypes } from '../../../types/index.js';

export class CreateUserDto {
  @IsString()
  @Length(1, 15)
  public name: string;

  @IsEmail()
  public email: string;

  @IsOptional()
  @IsString()
  public avatarPicPath?: string;

  @IsString()
  @Length(6, 12)
  public password: string;

  @IsIn(userTypes)
  public type: UserType;
}
