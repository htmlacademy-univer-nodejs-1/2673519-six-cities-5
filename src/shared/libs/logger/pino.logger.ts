import { Logger as PinoInstance, pino, transport } from 'pino';
import { injectable } from 'inversify';
import { resolve } from 'node:path';
import { ILogger } from './logger.interface.js';

@injectable()
export class PinoLogger implements ILogger {
  private readonly logger: PinoInstance;

  constructor() {
    const logPath = 'logs/rest.log';
    const destination = resolve(process.cwd(), logPath);

    const multiTransport = transport({
      targets: [
        {
          target: 'pino/file',
          options: { destination },
          level: 'debug'
        },
        {
          target: 'pino/file',
          level: 'info',
          options: {},
        }
      ],
    });

    this.logger = pino({}, multiTransport);
    this.logger.info('PinoLogger created');
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(args, message);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error({ err: error, ...args }, message);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(args, message);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(args, message);
  }
}
