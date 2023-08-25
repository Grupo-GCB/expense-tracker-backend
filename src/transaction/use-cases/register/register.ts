import { Injectable, NotFoundException } from '@nestjs/common';

import { adjustValueForType } from '@/shared/utils';
import { CreateTransactionDTO } from '@/transaction/dto';
import { Transaction } from '@/transaction/infra/entities';
import { ITransactionRepository } from '@/transaction/interface';
import { IWalletRepository } from '@/wallet/interfaces';

@Injectable()
export class RegisterTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(
    wallet_id: string,
    data: CreateTransactionDTO,
  ): Promise<Transaction> {
    const wallet = await this.walletRepository.findById(wallet_id);
    if (!wallet) throw new NotFoundException('Carteira não encontrada.');

    adjustValueForType(data);

    return this.transactionRepository.create(wallet_id, data);
  }
}
