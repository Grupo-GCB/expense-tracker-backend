import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from '@/transaction/infra/entities';
import { TransactionController } from '@/shared/infra/http/controllers/transaction/transaction.controller';
import { FindTransactionsByUserUseCase } from '@/transaction/use-cases';
import { ITransactionRepository } from '@/transaction/interface';
import { TransactionRepository } from '@/transaction/infra/repositories';
import { IUserRepository } from '@/user/interfaces';
import { UserRepository } from '@/user/infra/repositories';
import { FindUserByIdUseCase } from '@/user/use-cases';
import { User } from '@/user/infra/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User])],
  providers: [
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
