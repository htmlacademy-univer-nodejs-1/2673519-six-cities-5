import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  PORT: number;
  DB_HOST: string;
  SALT: string;
}

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Connection port',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  DB_HOST: {
    doc: 'DB host ip',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  SALT: {
    doc: 'Password salt',
    format: String,
    env: 'SALT',
    default: null
  },
});
