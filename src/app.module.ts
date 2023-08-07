import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BankModule } from '@/bank/bank.module';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { WalletModule } from '@/wallet/wallet.module';
import { BudgetGoalModule } from './budget-goal/budget-goal.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
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
