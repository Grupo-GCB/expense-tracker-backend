import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/user/infra/entities';
import { Wallet } from '@/wallet/infra/entities';
import { Bank } from '@/bank/infra/entities';
import { WalletController } from '@/shared/infra/http/controllers';
import { FindAllWalletsUseCase, RegisterWalletUseCase } from '@/wallet/use-cases';
import { ListUserByIdUseCase } from '@/user/use-cases';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { IBankRepository } from '@/bank/interfaces';
import { BankRepository } from '@/bank/infra/repositories';
import { IUserRepository } from '@/user/interfaces';
import { UserRepository } from '@/user/infra/repositories';
import { IWalletRepository } from '@/wallet/interfaces';
import { WalletRepository } from '@/wallet/infra/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Bank, User])],
  providers: [
    RegisterWalletUseCase,
    ListUserByIdUseCase,
    FindBankByIdUseCase,
    FindAllWalletsUseCase,
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
  controllers: [WalletController],
})
export class WalletModule {}
