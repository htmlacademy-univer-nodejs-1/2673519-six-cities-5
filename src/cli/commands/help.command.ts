import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public execute(..._parameters: string[]): void {
    console.info('Программа для подготовки данных для REST API сервера.\n');
    console.info(`Пример: cli.js --<${chalk.blue('command')}> [--${chalk.cyanBright('arguments')}]\n`);
    console.info('Команды:\n');
    console.info(`   ${chalk.cyanBright('--version')}:\t\t\t${chalk.green('# выводит номер версии')}`);
    console.info(`   ${chalk.cyanBright('--help')}:\t\t\t${chalk.green('# печатает этот текст')}`);
    console.info(`   ${chalk.cyanBright('--import')} ${chalk.blue('<path> <DB_USER> <DB_PASSWORD> <DB_HOST> <DB_NAME> <SALT>')}:\t\t${chalk.green('# импортирует данные из TSV в MongoDB')}`);
    console.info(`   ${chalk.cyanBright('--generate')} ${chalk.blue('<n>')} ${chalk.blue('<path>')} ${chalk.blue('<url>')}:\t${chalk.green('# генерирует произвольное количество тестовых данных')}`);
  }
}
