import { Injectable } from '@nestjs/common';
import { ISummaryResponse } from '@/transaction/interface';
import { ITransactionRepository } from '@/transaction/interface';

@Injectable()
export class FindAllByWalletIdUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(wallet_id: string): Promise<ISummaryResponse> {
    const transactions = await this.transactionRepository.findAllByWalletId(
      wallet_id,
    );

    const balance = transactions.reduce((total, transactions) => {
      if (transactions.type === 'Income') {
        return total + transactions.value;
      } else if (transactions.type === 'Expense') {
        return total - transactions.value;
      }
    }, 0);

    return {
      transactions,
      balance,
    };
  }
}
