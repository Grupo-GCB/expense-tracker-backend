import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTransactionDTO } from '@/transaction/dto';
import { ITransactionRepository } from '@/transaction/interface';
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

  async findById(id: string): Promise<Transaction> {
    return this.transactionRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.transactionRepository.softDelete({ id });
  }
}
