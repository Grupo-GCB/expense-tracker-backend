import { Injectable, NotFoundException } from '@nestjs/common';

import {
  ITransactionResponse,
  ITransactionRepository,
} from '@/transaction/interface';
import { IUserRepository } from '@/user/interfaces';

@Injectable()
export class FindTransactionsByUserUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(user_id: string): Promise<ITransactionResponse[]> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const transactions = await this.transactionRepository.findAllByUserId(
      user_id,
    );

    if (!transactions || transactions.length === 0) {
      throw new NotFoundException(
        'Transações não encontradas para este usuário.',
      );
    }

    return transactions;
  }
}
