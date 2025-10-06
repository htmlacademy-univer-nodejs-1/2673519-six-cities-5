import { config } from 'dotenv';
import { inject, injectable } from 'inversify';
import { IConfig } from './config.interface.js';
import { ILogger } from '../logger/index.js';
import { configRestSchema, RestSchema } from './rest.schema.js';
import { Component } from '../../types/index.js';

@injectable()
export class RestConfig implements IConfig<RestSchema> {
  private readonly config: RestSchema;

  constructor(
    @inject(Component.Logger) private readonly logger: ILogger
  ) {
    const parsedOutput = config();
    if (parsedOutput.error) {
      throw new Error('Failed parse .env file.');
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configRestSchema.getProperties();
    this.logger.info('.env file loaded');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
