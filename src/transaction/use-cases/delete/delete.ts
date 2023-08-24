import { Injectable, NotFoundException } from '@nestjs/common';

import { DeleteTransactionDTO } from '@/transaction/dto';
import { ITransactionRepository } from '@/transaction/interfaces';

@Injectable()
export class DeleteTransactionUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute({ id }: DeleteTransactionDTO): Promise<void> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) throw new NotFoundException('Transação não encontrada.');

    await this.transactionRepository.delete(id);
  }
}
