import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { setTimeout } from 'node:timers/promises';
import { DatabaseClient } from './db-client.interface.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../logger/index.js';
import { DB_CONNECTION_MAX_RETRIES, DB_CONNECTION_TIMEOUT } from '../../config/config.consts.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose!: typeof Mongoose;
  private isConnected: boolean;

  constructor(
    @inject(Component.Logger) private readonly logger: ILogger
  ) {
    this.isConnected = false;
  }

  public isConnectedToDatabase() {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDatabase()) {
      throw new Error('MongoDB client already connected');
    }

    this.logger.info('Trying to connect to MongoDB…');

    let attempt = 0;
    while (attempt < DB_CONNECTION_MAX_RETRIES) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.isConnected = true;
        this.logger.info('Database connection established.');
        return;
      } catch (error) {
        attempt++;
        this.logger.error(`Attempt (${attempt}/${DB_CONNECTION_MAX_RETRIES}). Failed to connect to db.`, error as Error);
        await setTimeout(DB_CONNECTION_TIMEOUT);
      }
    }

    throw new Error(`Attempt (${DB_CONNECTION_MAX_RETRIES}/${DB_CONNECTION_MAX_RETRIES}). Failed to establish db connection`);
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase()) {
      throw new Error('Not connected to the database');
    }

    await this.mongoose.disconnect?.();
    this.isConnected = false;
    this.logger.info('Database connection closed.');
  }
}
