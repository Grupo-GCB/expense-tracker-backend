import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  DeleteWalletUseCase,
  FindAllWalletsByUserIdUseCase,
  FindWalletByIdUseCase,
  RegisterWalletUseCase,
} from '@/wallet/use-cases';
import { FindUserByIdUseCase } from '@/user/use-cases';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { User } from '@/user/infra/entities';
import { Wallet } from '@/wallet/infra/entities';
import { Bank } from '@/bank/infra/entities';
import { WalletController } from '@/shared/infra/http/controllers';
import { IBankRepository } from '@/bank/interfaces';
import { BankRepository } from '@/bank/infra/repositories';
import { IUserRepository } from '@/user/interfaces';
import { UserRepository } from '@/user/infra/repositories';
import { IWalletRepository } from '@/wallet/interfaces';
import { WalletRepository } from '@/wallet/infra/repositories';
import { UpdateWalletUseCase } from '@/wallet/use-cases';
import { FindAllTransactionsByUserIdUseCase } from '@/transaction/use-cases';
import { ITransactionRepository } from '@/transaction/interfaces';
import { TransactionRepository } from '@/transaction/infra/repositories/transaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Bank, User])],
  providers: [
    RegisterWalletUseCase,
    FindUserByIdUseCase,
    FindBankByIdUseCase,
    FindWalletByIdUseCase,
    FindAllWalletsByUserIdUseCase,
    UpdateWalletUseCase,
    DeleteWalletUseCase,
    FindAllTransactionsByUserIdUseCase,
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
    {
      provide: ITransactionRepository,
      useClass: TransactionRepository,
    },
  ],
  controllers: [WalletController],
})
export class WalletModule {}
