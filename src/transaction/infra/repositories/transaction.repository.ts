import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Transaction } from '@/transaction/infra/entities';
import { ITransactionResponse } from '@/transaction/interface';
import { ITransactionRepository } from '@/transaction/interface';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async findAllByUserId(user_id: string): Promise<ITransactionResponse[]> {
    const transactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .innerJoin('transaction.wallet', 'wallet')
      .leftJoin('wallet.bank', 'bank')
      .where('wallet.user = :user_id', { user_id })
      .select([
        'transaction.id',
        'transaction.categories',
        'transaction.description',
        'transaction.value',
        'transaction.type',
        'transaction.date',
        'wallet.id as wallet_id',
        'bank.name as bank_name',
      ])
      .getRawMany();

    return transactions;
  }
}
