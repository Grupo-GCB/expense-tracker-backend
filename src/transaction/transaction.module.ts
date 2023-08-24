import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from '@/transaction/infra/entities';
import { TransactionController } from '@/shared/infra/http/controllers/transaction/transaction.controller';
import { FindTransactionsByUserUseCase } from '@/transaction/use-cases';
import { ITransactionRepository } from '@/transaction/interfaces';
import { TransactionRepository } from './infra/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [
    FindTransactionsByUserUseCase,
    {
      provide: ITransactionRepository,
      useClass: TransactionRepository,
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
