import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateTransactionDTO } from '@/transaction/dto/update-transaction-dto';
import { ITransactionRepository } from '@/transaction/interfaces';
import { IWalletRepository } from '@/wallet/interfaces';
import { Transaction } from '@/transaction/infra/entities';

@Injectable()
export class UpdateTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly walletRepository: IWalletRepository,
  ) {}

  async execute(id: string, data: UpdateTransactionDTO): Promise<Transaction> {
    const [transaction, wallet] = await Promise.all([
      await this.transactionRepository.findById(id),
      this.walletRepository.findById(data.wallet_id),
    ]);

    if (!transaction) throw new NotFoundException('Transação não encontrada');
    if (!wallet) throw new NotFoundException('Carteira não encontrada.');

    transaction.wallet.id = data.wallet_id;

    Object.assign(transaction, data);

    await this.transactionRepository.update(transaction);

    return this.transactionRepository.findById(id);
  }
}
