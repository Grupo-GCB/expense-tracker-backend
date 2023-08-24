import { Injectable } from '@nestjs/common';

import {
  ITransactionResponse,
  ITransactionRepository,
} from '@/transaction/interface';

@Injectable()
export class FindTransactionsByUserUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(user_id: string): Promise<ITransactionResponse[]> {
    return this.transactionRepository.findAllByUserId(user_id);
  }
}
