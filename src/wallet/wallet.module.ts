import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Wallet } from '@/wallet/infra/entities';
import { WalletController } from '@/shared/infra/http/controllers';
import { RegisterWalletUseCase } from '@/wallet/use-cases';
import { IWalletRepository } from '@/wallet/interfaces';
import { WalletRepository } from '@/wallet/infra/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [WalletController],
  providers: [
    RegisterWalletUseCase,
    {
      provide: IWalletRepository,
      useClass: WalletRepository,
    },
  ],
})
export class WalletModule {}
