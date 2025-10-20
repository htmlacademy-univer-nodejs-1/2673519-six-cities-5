import { inject, injectable } from 'inversify';
import { ILogger } from '../shared/libs/logger/index.js';
import { IConfig, RestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';
import { DatabaseClient } from '../shared/libs/db-client/index.js';
import { getMongoDbURI } from '../shared/helpers/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<RestSchema>,
    @inject(Component.DatabaseClient) private readonly dbClient: DatabaseClient,
  ) {}

  public async init() {
    this.logger.info('Start initializating application...');
    this.logger.info('Initializating database...');
    await this.initDb();
    this.logger.info('Initializating completed.');
  }

  private async initDb() {
    this.logger.info('Getting .env values...');

    const mongoUri = getMongoDbURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.dbClient.connect(mongoUri);
  }
}
