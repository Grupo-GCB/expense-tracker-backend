import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wallet } from '@/wallet/infra/entities';
import { IWalletRepository } from '@/wallet/interfaces';
import { SaveWalletDTO, UpdateWalletDTO } from '@/wallet/dto';

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async create(data: SaveWalletDTO): Promise<Wallet> {
    const wallet = this.walletRepository.create(data);
    return this.walletRepository.save(wallet);
  }

  async findById(id: string): Promise<Wallet> {
    return this.walletRepository.findOne({ where: { id } });
  }

  async update(data: UpdateWalletDTO): Promise<Wallet> {
    const wallet = await this.findById(data.id);

    Object.assign(wallet, data);

    return this.walletRepository.save(wallet);
  }
}
