import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from '@/transaction/infra/entities';
import {
  DeleteTransactionUseCase,
  RegisterTransactionUseCase,
  UpdateTransactionUseCase,
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
import { TransactionController } from '@/shared/infra/http/controllers';
import { FindAllByWalletIdUseCase } from '@/transaction/use-cases';

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
