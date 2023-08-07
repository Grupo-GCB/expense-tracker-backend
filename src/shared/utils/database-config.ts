import 'dotenv/config';

import { IDatabaseConfig } from '@/shared/interfaces';

const env = process.env.NODE_ENV;
const envPrefix = env === 'prod' ? '' : '_DEV';

const databaseConfig: IDatabaseConfig = {
  host: process.env[`DB_HOST${envPrefix}`],
  port: Number(process.env[`DB_PORT${envPrefix}`]),
  username: process.env[`DB_USER${envPrefix}`],
  password: process.env[`DB_PASSWORD${envPrefix}`],
  database: process.env[`DB_NAME${envPrefix}`],
};

export default databaseConfig;
