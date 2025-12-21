import { ContainerModule, ContainerModuleLoadOptions} from 'inversify';
import { RestApplication } from './rest.application.js';
import { Component } from '../shared/types/index.js';
import { ILogger, PinoLogger } from '../shared/libs/logger/index.js';
import { IConfig, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/db-client/index.js';
import { AppExceptionFilter, IExceptionFilter } from '../shared/libs/rest/index.js';

export const restApplicationContainer: ContainerModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
    options.bind<ILogger>(Component.Logger).to(PinoLogger).inSingletonScope();
    options.bind<IConfig<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
    options.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
    options.bind<IExceptionFilter>(Component.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();
  });
