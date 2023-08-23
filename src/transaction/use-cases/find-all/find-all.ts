import { Injectable } from '@nestjs/common';

import {
  ITransactionRepository,
  ITransactionsResponse,
} from '@/transaction/interfaces';

@Injectable()
export class FindAllTransactionsByUserIdUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(user_id: string): Promise<ITransactionsResponse> {
    const transactions = await this.transactionRepository.findAllByUserId(
      user_id,
    );

    return { transactions };
  }
}
