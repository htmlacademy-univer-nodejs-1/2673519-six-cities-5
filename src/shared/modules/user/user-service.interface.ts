import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { IDocumentExistsService } from '../../types/index.js';

export interface IUserService extends IDocumentExistsService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;

  updateAvatar(userId: string, avatarPath: string): Promise<DocumentType<UserEntity> | null>;
}
