import { types } from '@typegoose/typegoose';
import { ICommentService } from './comment-service.interface.js';
import { Component } from '../../types/index.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import { DefaultCommentService } from './default-comment.service.js';
import { IController } from '../../libs/rest/index.js';
import { CommentController } from './comment.controller.js';

export const commentContainer: ContainerModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<ICommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
    options.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
    options.bind<IController>(Component.CommentController).to(CommentController).inSingletonScope();
  });
