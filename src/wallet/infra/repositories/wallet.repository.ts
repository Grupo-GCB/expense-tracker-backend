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

  async create(data: SaveWalletDTO): Promise<Wallet> {
    const wallet = new Wallet();
    wallet.account_type = data.account_type;
    wallet.description = data.description;

    wallet.user = { id: data.user_id } as User;
    wallet.bank = { id: data.bank_id } as Bank;

    return this.walletRepository.save(wallet);
  }

  async findById(id: string): Promise<Wallet> {
    return this.walletRepository.findOne({ where: { id } });
  }

  async update(wallet: Wallet): Promise<Wallet> {
    return this.walletRepository.save(wallet);
  }

  async delete(id: string): Promise<void> {
    await this.walletRepository.softDelete({ id });
  }
}
