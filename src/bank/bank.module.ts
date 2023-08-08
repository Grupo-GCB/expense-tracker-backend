import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Bank } from '@/bank/infra/entities';
import { IBankRepository } from './interfaces';
import { BankRepository } from '@/bank/infra/repositories';
import { FindBankByIdUseCase } from '@/bank/use-cases';

@Module({
  imports: [TypeOrmModule.forFeature([Bank])],
  providers: [
    BankRepository,
    FindBankByIdUseCase,
    {
      provide: IBankRepository,
      useClass: BankRepository,
    },
  ],
  exports: [
    FindBankByIdUseCase,
    {
      provide: IBankRepository,
      useClass: BankRepository,
    },
  ],
})
export class BankModule {}
