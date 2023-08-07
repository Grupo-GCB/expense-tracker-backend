import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

import databaseConfig from '@/shared/ultils/database-config';

export const ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  synchronize: false,
  entities: [`${__dirname}/**/*.entity{.ts,.js}`],
  migrations: [`src/shared/infra/database/typeorm/migrations/*{.ts,.js}`],
  migrationsRun: true,
};

const dataSource = new DataSource(ormconfig);
export default dataSource;
