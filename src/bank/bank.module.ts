import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Bank } from '@/bank/infra/entities';
import { BankController } from '@/shared/infra/http/controllers';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { IBankRepository } from '@/bank/interfaces';
import { BankRepository } from '@/bank/infra/repositories';

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
