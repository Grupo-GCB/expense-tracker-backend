import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTransactionDTO } from '@/transaction/dto';
import {
  ITransactionRepository,
  ITransactionResponse,
} from '@/transaction/interfaces';
import { Transaction } from '@/transaction/infra/entities';
import { Wallet } from '@/wallet/infra/entities';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(
    wallet_id: string,
    data: CreateTransactionDTO,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      categories: data.categories,
      description: data.description,
      value: data.value,
      type: data.type,
      date: data.date,
      wallet: { id: wallet_id } as Wallet,
    });

    return this.transactionRepository.save(transaction);
  }

  async findAllByUserId(user_id: string): Promise<ITransactionResponse[]> {
    const transactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .innerJoin('transaction.wallet', 'wallet')
      .where('wallet.user = :user_id', { user_id })
      .select([
        'transaction.id',
        'transaction.categories',
        'transaction.description',
        'transaction.value',
        'transaction.type',
        'transaction.date',
        'wallet.id as wallet_id',
      ])
      .getRawMany();

    return transactions;
  }

  async findById(id: string): Promise<Transaction> {
    return this.transactionRepository.findOne({ where: { id } });
  }

  async update(transaction: Transaction): Promise<void> {
    await this.transactionRepository.save(transaction);
  }

  async delete(id: string): Promise<void> {
    await this.transactionRepository.softDelete({ id });
  }
}
