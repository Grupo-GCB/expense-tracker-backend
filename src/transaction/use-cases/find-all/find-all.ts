import { Injectable } from '@nestjs/common';

import {
  ITransactionResponse,
  ITransactionRepository,
} from '@/transaction/interfaces';

@Injectable()
export class FindTransactionsByUserUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(userId: string): Promise<ITransactionResponse[]> {
    return this.transactionRepository.findAllByUserId(userId);
  }
}
