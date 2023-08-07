import { Injectable, NotFoundException } from '@nestjs/common';

import { IWalletRepository } from '@/wallet/interfaces';
import { SaveWalletDTO } from '@/wallet/dto';
import { Wallet } from '@/wallet/infra/entities';

@Injectable()
export class RegisterWalletUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async createWallet(data: SaveWalletDTO): Promise<Wallet> {
    try {
      return this.walletRepository.create(data);
    } catch (error) {
      throw new NotFoundException('Erro ao criar a carteira.');
    }
  }
}