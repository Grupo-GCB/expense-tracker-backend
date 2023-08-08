import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Bank } from '@/bank/infra/entities';
import { BankController } from '@/shared/infra/http/controllers';
import { FindBankByIdUseCase } from './use-cases';
import { IBankRepository } from './interfaces';
import { BankRepository } from './infra/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Bank])],
  controllers: [BankController],
  providers: [
    FindBankByIdUseCase,
    {
      provide: IBankRepository,
      useClass: BankRepository,
    },
  ],
})
export class BankModule {}
