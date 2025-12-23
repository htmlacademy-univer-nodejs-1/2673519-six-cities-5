import chalk from 'chalk';
import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { TSVOfferParser } from '../../shared/libs/offer-parser/index.js';
import { getMongoDbURI } from '../../shared/helpers/index.js';
import { IUserService } from '../../shared/modules/user/index.js';
import { DefaultOfferService, OfferModel, IOfferService } from '../../shared/modules/offer/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/db-client/index.js';
import { ConsoleLogger, ILogger } from '../../shared/libs/logger/index.js';
import { DefaultUserService, UserModel } from '../../shared/modules/user/index.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.const.js';
import { Offer } from '../../shared/types/index.js';

export class ImportCommand implements Command {
  private dbClient: DatabaseClient;
  private userService: IUserService;
  private offerService: IOfferService;
  private readonly logger: ILogger;
  private salt: string;

  constructor() {
    this.logger = new ConsoleLogger();
    this.dbClient = new MongoDatabaseClient(this.logger);
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);

    this.onImportLine = this.onImportLine.bind(this);
    this.onImportEnd = this.onImportEnd.bind(this);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(filepath: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoDbURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;
    await this.dbClient.connect(uri);
    const fileReader = new TSVFileReader(filepath.trim());

    fileReader.on('line', this.onImportLine);
    fileReader.on('endImport', this.onImportEnd);

    try {
      await fileReader.read();
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }
      console.error(chalk.bgRed.white(`Failed import data from file: ${filepath}`));
      console.error(chalk.redBright(`Details: ${error.message}`));
    }
  }

  private async onImportLine(line: string, resolve: () => void) {
    try {
      const offerParser = new TSVOfferParser();
      const offer = offerParser.parse(line);
      await this.saveOffer(offer);
    } catch (error) {
      console.error(chalk.red(`Error processing line: ${line}`));
      if (error instanceof Error) {
        console.error(chalk.red(`Details: ${error.message}`));
      }
    } finally {
      resolve();
    }
  }

  private async onImportEnd(linesCount: number) {
    console.info(chalk.green(`Imported ${linesCount} lines`));
    await this.dbClient.disconnect();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.owner,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      openDate: offer.openDate,
      city: offer.city,
      preview: offer.preview,
      images: offer.images,
      isPremium: offer.isPremium,
      rating: offer.rating,
      housingType: offer.housingType,
      roomsCount: offer.roomsCount,
      guestsCount: offer.guestsCount,
      price: offer.price,
      amenities: offer.amenities,
      commentsCount: offer.commentsCount,
      coordinates: offer.coordinates
    }, user.id);
  }
}
