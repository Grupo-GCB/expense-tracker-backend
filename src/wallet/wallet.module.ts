import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Wallet } from '@/wallet/infra/entities';
import { WalletController } from '@/shared/infra/http/controllers/wallet/wallet.controller';
import { RegisterWalletUseCase } from './use-cases';
import { IWalletRepository } from './interfaces';
import { WalletRepository } from './infra/repositories';

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
