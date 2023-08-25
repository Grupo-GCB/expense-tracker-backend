import { Injectable } from '@nestjs/common';
import { ISummaryResponse } from '@/transaction/interface';
import { ITransactionRepository } from '@/transaction/interface';
import { TransactionType } from '@/shared/constants/enums'; // Certifique-se de importar o enum corretamente

@Injectable()
export class FindAllByWalletIdUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(wallet_id: string): Promise<ISummaryResponse> {
    const { transactions } = await this.transactionRepository.findAllByWalletId(
      wallet_id,
    );

    const balance = transactions.reduce((total, transaction) => {
      if (transaction.type === TransactionType.INCOME) {
        return total + transaction.value;
      } else if (transaction.type === TransactionType.EXPENSE) {
        return total - transaction.value;
      }
      return total;
    }, 0);

    return {
      transactions,
      balance,
    };
  }
}
