import 'dotenv/config';

import { IDatabaseConfig } from '@/shared/interfaces';

const env = process.env.NODE_ENV;
let databaseConfig: IDatabaseConfig;

if (env === 'prod') {
  databaseConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
} else if (env === 'dev') {
  databaseConfig = {
    host: process.env.DB_HOST_DEV,
    port: Number(process.env.DB_PORT_DEV),
    username: process.env.DB_USER_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: process.env.DB_NAME_DEV,
  };
}

export default databaseConfig;
