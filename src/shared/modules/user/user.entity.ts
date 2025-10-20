import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';
import { getSHA256 } from '../../helpers/index.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})

export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, default: '', trim: true, type: () => String })
  public name: string;

  @prop({ required: true, unique: true, trim: true, type: () => String })
  public email: string;

  @prop({ required: false, default: '', trim: true, type: () => String })
  public avatar?: string;

  @prop({ required: true, type: () => String })
  public password: string;

  @prop({ required: true, default: 'обычный', type: () => String })
  public type: UserType;

  constructor(userData: User) {
    super();
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.name = userData.name;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = getSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
