import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Bank } from '@/bank/infra/entities';
import { FindAllBanksUseCase, FindBankByIdUseCase } from '@/bank/use-cases';
import { IBankRepository } from '@/bank/interfaces';
import { BankRepository } from '@/bank/infra/repositories';
import { BankController } from '@/shared/infra/http/controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Bank])],
  controllers: [BankController],
  providers: [
    BankRepository,
    FindBankByIdUseCase,
    FindAllBanksUseCase,
    {
      provide: IBankRepository,
      useClass: BankRepository,
    },
  ],
  exports: [
    {
      provide: IBankRepository,
      useClass: BankRepository,
    },
  ],
})
export class BankModule {}
