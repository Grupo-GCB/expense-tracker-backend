import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wallet } from '@/wallet/infra/entities';
import { IWalletRepository } from '@/wallet/interfaces';
import { SaveWalletDTO } from '@/wallet/dto';
import { User } from '@/user/infra/entities';
import { Bank } from '@/bank/infra/entities';

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async create({
    user_id,
    account_type,
    bank_id,
    description,
  }: SaveWalletDTO): Promise<Wallet> {
    const wallet = this.walletRepository.create({
      user: { id: user_id } as User,
      bank: { id: bank_id } as Bank,
      account_type,
      description,
    });

    return this.walletRepository.save(wallet);
  }

  async update(wallet: Wallet): Promise<Wallet> {
    return await this.walletRepository.save(wallet);
  }

  async delete(id: string): Promise<void> {
    await this.walletRepository.softDelete({ id });
  }

  async findAllByUserId(user_id: string): Promise<Wallet[]> {
    return this.walletRepository.find({
      where: { user: { id: user_id } },
      relations: ['bank'],
    });
  }

  async findById(id: string): Promise<Wallet> {
    return this.walletRepository.findOne({
      where: { id },
      relations: ['bank'],
    });
  }
}
