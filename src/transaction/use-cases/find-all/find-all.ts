import { Injectable } from '@nestjs/common';

import {
  ITransactionRepository,
  ITransactionResponse,
} from '@/transaction/interfaces';

@Injectable()
export class FindTransactionsByUserUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(user_id: string): Promise<ITransactionResponse[]> {
    return this.transactionRepository.findAllByUserId(user_id);
  }
}
