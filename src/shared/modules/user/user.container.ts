import { types } from '@typegoose/typegoose';
import { IUserService } from './user-service.interface.js';
import { Component } from '../../types/index.js';
import { DefaultUserService } from './default-user.service.js';
import { UserEntity, UserModel } from './user.entity.js';
import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import { UserController } from './user.controller.js';
import { IController } from '../../libs/rest/controller/index.js';

export const userContainer: ContainerModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<IUserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
    options.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
    options.bind<IController>(Component.UserController).to(UserController).inSingletonScope();
  });
