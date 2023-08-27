import { Injectable } from '@nestjs/common';

import {
  ISummaryResponse,
  ITransactionRepository,
} from '@/transaction/interface';

@Injectable()
export class FindAllByWalletIdUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(wallet_id: string): Promise<ISummaryResponse> {
    const { transactions } = await this.transactionRepository.findAllByWalletId(
      wallet_id,
    );

    const balance = transactions.reduce((total, transaction) => {
      return total + transaction.value;
    }, 0);

    return {
      transactions,
      balance,
    };
  }
}
