import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  PORT: number;
  DB_HOST: string;
  SALT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
  UPLOAD_DIRECTORY: string;
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
  DB_USER: {
    doc: 'Db username',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Db password',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Db Port',
    format: 'port',
    env: 'DB_PORT',
    default: '27017',
  },
  DB_NAME: {
    doc: 'Db name',
    format: String,
    env: 'DB_NAME',
    default: 'six-cities'
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for storing uploaded user files',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: 'upload'
  },
});
