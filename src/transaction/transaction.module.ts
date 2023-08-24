import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionController } from '@/shared/infra/http/controllers/';
import { Transaction } from '@/transaction/infra/entities';
import { Wallet } from '@/wallet/infra/entities';
import { TransactionRepository } from './infra/repositories';
import { ITransactionRepository } from './interfaces';
import {
  DeleteTransactionUseCase,
  RegisterTransactionUseCase,
  UpdateTransactionUseCase,
} from '@/transaction/use-cases';
import { WalletRepository } from '@/wallet/infra/repositories';
import { IWalletRepository } from '@/wallet/interfaces';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Wallet])],
  controllers: [TransactionController],
  providers: [
    RegisterTransactionUseCase,
    DeleteTransactionUseCase,
    UpdateTransactionUseCase,
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
