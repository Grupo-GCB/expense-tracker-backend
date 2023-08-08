import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Wallet } from '@/wallet/infra/entities';
import { WalletController } from '@/shared/infra/http/controllers';
import { RegisterWalletUseCase } from '@/wallet/use-cases';
import { IWalletRepository } from '@/wallet/interfaces';
import { WalletRepository } from '@/wallet/infra/repositories';
import { ListUserByIdUseCase } from '@/user/use-cases';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { Bank } from '@/bank/infra/entities';
import { IBankRepository } from '@/bank/interfaces';
import { BankRepository } from '@/bank/infra/repositories';
import { IUserRepository } from '@/user/interfaces';
import { UserRepository } from '@/user/infra/repositories';
import { User } from '@/user/infra/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Bank, User])],
  controllers: [WalletController],
  providers: [
    RegisterWalletUseCase,
    ListUserByIdUseCase,
    FindBankByIdUseCase,
    {
      provide: IWalletRepository,
      useClass: WalletRepository,
    },
    {
      provide: IBankRepository,
      useClass: BankRepository,
    },
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
})
export class WalletModule {}
