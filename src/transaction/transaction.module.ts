import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from '@/transaction/infra/entities';
import { TransactionController } from '@/shared/infra/http/controllers/transaction/transaction.controller';
import {
  DeleteTransactionUseCase,
  RegisterTransactionUseCase,
  FindTransactionsByUserUseCase,
} from '@/transaction/use-cases';
import { ITransactionRepository } from '@/transaction/interface';
import { TransactionRepository } from '@/transaction/infra/repositories';
import { IUserRepository } from '@/user/interfaces';
import { UserRepository } from '@/user/infra/repositories';
import { FindUserByIdUseCase } from '@/user/use-cases';
import { User } from '@/user/infra/entities';
import { IWalletRepository } from '@/wallet/interfaces';
import { WalletRepository } from '@/wallet/infra/repositories';
import { Wallet } from '@/wallet/infra/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User, Wallet])],
  providers: [
    RegisterTransactionUseCase,
    DeleteTransactionUseCase,
    FindTransactionsByUserUseCase,
    FindUserByIdUseCase,
    {
      provide: ITransactionRepository,
      useClass: TransactionRepository,
    },
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: IWalletRepository,
      useClass: WalletRepository,
    },
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}
