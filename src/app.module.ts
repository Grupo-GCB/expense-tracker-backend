import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';

import { BankModule } from '@/bank/bank.module';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { WalletModule } from '@/wallet/wallet.module';
import { BudgetGoalModule } from '@/budget-goal/budget-goal.module';
import { TransactionModule } from '@/transaction/transaction.module';
import { Wallet } from '@/wallet/infra/entities';
import { AuthModule } from '@/auth/auth.module';
import databaseConfig from '@/shared/utils/database-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.database,
      entities: [`${__dirname}/**/*.entity{.js,.ts}`],
      migrations: [
        `${__dirname}/shared/infra/database/typeorm/migrations/{.ts,*.js}`,
      ],
      migrationsRun: true,
    }),
    UserModule,
    WalletModule,
    BankModule,
    BudgetGoalModule,
    TransactionModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
