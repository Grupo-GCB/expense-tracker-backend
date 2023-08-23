import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionController } from '@/shared/infra/http/controllers/';
import { Transaction } from '@/transaction/infra/entities';
import { Wallet } from '@/wallet/infra/entities';
import { TransactionRepository } from './infra/repositories';
import { ITransactionRepository } from './interface';
import { RegisterTransactionUseCase } from './use-cases/register/register';
import { WalletRepository } from '@/wallet/infra/repositories';
import { IWalletRepository } from '@/wallet/interfaces';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Wallet])],
  controllers: [TransactionController],
  providers: [
    RegisterTransactionUseCase,
    {
      provide: ITransactionRepository,
      useClass: TransactionRepository,
    },
    {
      provide: IWalletRepository,
      useClass: WalletRepository,
    },
  ],
})
export class TransactionModule {}
