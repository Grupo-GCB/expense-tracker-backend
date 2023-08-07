import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BankModule } from '@/bank/bank.module';
import { BudgetGoal } from '@/budget-goal/infra/entities';
import { Transaction } from '@/transaction/infra/entities';
import { UserModule } from '@/user/user.module';
import { Wallet } from '@/wallet/infra/entities';
import { AuthModule } from '@/auth/auth.module';
import { WalletModule } from '@/wallet/wallet.module';

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
    BudgetGoal,
    Transaction,
    AuthModule,
    Wallet,
  ],
  providers: [],
})
export class AppModule {}
