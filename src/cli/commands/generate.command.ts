import got from 'got';
import chalk from 'chalk';
import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/types/index.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';

export class GenerateCommand implements Command {
  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, path, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      const response = await got.get(url).json() as unknown;
      const maybeWrapped = response as { api?: MockServerData };
      const data = maybeWrapped.api ?? (response as MockServerData);
      const tsvOfferGenerator = new TSVOfferGenerator(data);
      const tsvFileWriter = new TSVFileWriter(path);

      for (let i = 0; i < offerCount; i++) {
        await tsvFileWriter.write(tsvOfferGenerator.generate());
      }
      console.info(chalk.green(`File ${path} was created!`));
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }
      console.error(chalk.bgRed.white(`Failed to generate data from: ${path}`));
      console.error(chalk.redBright(`Details: ${error.message}`));
    }
  }
}
