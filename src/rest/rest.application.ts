import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import cors from 'cors';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ILogger } from '../shared/libs/logger/index.js';
import { IConfig, RestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';
import { DatabaseClient } from '../shared/libs/db-client/index.js';
import { getMongoDbURI } from '../shared/helpers/index.js';
import { IController, IExceptionFilter } from '../shared/libs/rest/index.js';

@injectable()
export class RestApplication {
  private server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<RestSchema>,
    @inject(Component.DatabaseClient) private readonly dbClient: DatabaseClient,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: IExceptionFilter,
    @inject(Component.UserController) private readonly userController: IController,
    @inject(Component.OfferController) private readonly offerController: IController,
    @inject(Component.CommentController) private readonly commentController: IController,
    @inject(Component.FavoritesController) private readonly favoritesController: IController,
  ) {
    this.server = express();
  }

  public async init() {
    this.logger.info('Start initializating application...');
    await this.initDb();

    await this.initMiddleware();
    await this.initControllers();
    await this.initExceptionFilters();
    await this.initServer();

    this.logger.info('Initializating completed.');
  }

  private async initDb() {
    this.logger.info('Init database');
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

  private async initControllers() {
    this.logger.info('Init controllers');
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
    this.server.use('/offers/:offerId/comments', this.commentController.router);
    this.server.use('/favorites', this.favoritesController.router);
    this.logger.info('Controllers initialized successfully');
  }

  private async initMiddleware() {
    this.logger.info('Init middleware');

    const uploadDirectory = resolve(process.cwd(), this.config.get('UPLOAD_DIRECTORY'));
    await mkdir(uploadDirectory, { recursive: true });
    await mkdir(resolve(uploadDirectory, 'avatars'), { recursive: true });
    this.server.use('/static', express.static(uploadDirectory));

    this.server.use(cors());
    this.server.use(express.json());
    this.logger.info('Middleware initialized successfully');
  }

  private async initExceptionFilters() {
    this.logger.info('Init exception filters');
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
    this.logger.info('Exception filters initialized successfully');
  }

  private async initServer() {
    this.logger.info('Init server');
    const port = this.config.get('PORT');
    this.server.listen(port);
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
