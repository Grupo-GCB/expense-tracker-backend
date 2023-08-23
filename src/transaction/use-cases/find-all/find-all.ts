import { Injectable } from '@nestjs/common';

import { ITransactionsResponse } from '@/transaction/interfaces';
import { IWalletRepository } from '@/wallet/interfaces';

@Injectable()
export class FindAllTransactionsByUserIdUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(user_id: string): Promise<ITransactionsResponse> {
    const transactions = await this.walletRepository.findAllByUserId(user_id);

    return { transactions };
  }
}
