import chalk from 'chalk';
import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { TSVOfferParser } from '../../shared/libs/offer-parser/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filepath] = parameters;
    const fileReader = new TSVFileReader(filepath.trim());

    fileReader.on('newLine', this.onImportLine);
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

  private onImportLine(line: string) {
    const offerParser = new TSVOfferParser();
    const offer = offerParser.parse(line);
    console.info(offer);
  }

  private onImportEnd(linesCount: number) {
    console.info(chalk.green(`Imported ${linesCount} lines`));
  }
}
