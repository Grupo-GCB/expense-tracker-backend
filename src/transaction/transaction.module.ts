import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  DeleteTransactionUseCase,
  RegisterTransactionUseCase,
  UpdateTransactionUseCase,
  FindTransactionsByUserUseCase,
  FindAllByWalletIdUseCase,
} from '@/transaction/use-cases';
import { FindUserByIdUseCase } from '@/user/use-cases';
import { ITransactionRepository } from '@/transaction/interface';
import { IWalletRepository } from '@/wallet/interfaces';
import { IUserRepository } from '@/user/interfaces';
import { TransactionRepository } from '@/transaction/infra/repositories';
import { UserRepository } from '@/user/infra/repositories';
import { WalletRepository } from '@/wallet/infra/repositories';
import { User } from '@/user/infra/entities';
import { Wallet } from '@/wallet/infra/entities';
import { Transaction } from '@/transaction/infra/entities';
import { TransactionController } from '@/shared/infra/http/controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User, Wallet])],
  providers: [
    RegisterTransactionUseCase,
    DeleteTransactionUseCase,
    UpdateTransactionUseCase,
    FindTransactionsByUserUseCase,
    FindUserByIdUseCase,
    FindAllByWalletIdUseCase,
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
  exports: [
    {
      provide: ITransactionRepository,
      useClass: TransactionRepository,
    },
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}
