import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  ISummaryResponse,
  ITransactionRepository,
  ITransactionsResponse,
} from '@/transaction/interface';
import { CreateTransactionDTO } from '@/transaction/dto';
import { Transaction } from '@/transaction/infra/entities';
import { Wallet } from '@/wallet/infra/entities';
import { Bank } from '@/bank/infra/entities';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async create(
    wallet_id: string,
    data: CreateTransactionDTO,
  ): Promise<Transaction> {
    const wallet = await this.walletRepository.findOne({
      where: { id: wallet_id },
      relations: ['bank'],
    });

    const transaction = this.transactionRepository.create({
      categories: data.categories,
      description: data.description,
      value: data.value,
      type: data.type,
      date: data.date,
      wallet: {
        id: wallet_id,
        bank: { name: wallet.bank.name } as Bank,
      } as Wallet,
    });

    return this.transactionRepository.save(transaction);
  }

  async findAllByUserId(user_id: string): Promise<ITransactionsResponse[]> {
    const transactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .innerJoin('transaction.wallet', 'wallet')
      .leftJoin('wallet.bank', 'bank')
      .where('wallet.user = :user_id', { user_id })
      .select([
        'transaction.id as id',
        'transaction.categories as category',
        'transaction.description as description',
        'transaction.value as value',
        'transaction.type as type',
        'transaction.date as date',
        'wallet.id as wallet_id',
        'bank.name as bank_name',
      ])
      .getRawMany();

    return transactions;
  }

  async findAllByWalletId(wallet_id: string): Promise<ISummaryResponse> {
    const balance = 0;

    const wallet = await this.walletRepository.findOne({
      where: { id: wallet_id },
    });

    const transactions = await this.transactionRepository.find({
      where: { wallet: { id: wallet_id } },
    });

    if (!wallet) throw new NotFoundException('Carteira não encontrada.');

    return {
      transactions,
      balance,
    };
  }

  async findById(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.wallet', 'wallet')
      .leftJoin('wallet.bank', 'bank')
      .where('transaction.id = :id', { id })
      .select([
        'transaction.id',
        'transaction.categories',
        'transaction.description',
        'transaction.value',
        'transaction.type',
        'transaction.date',
        'transaction.created_at',
        'transaction.updated_at',
        'wallet.id',
        'bank.name',
      ])
      .getOne();

    return transaction;
  }

  async update(transaction: Transaction): Promise<void> {
    await this.transactionRepository.save(transaction);
  }

  async delete(id: string): Promise<void> {
    await this.transactionRepository.softDelete({ id });
  }
}
