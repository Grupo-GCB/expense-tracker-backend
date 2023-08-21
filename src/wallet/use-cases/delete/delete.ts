import { Injectable, NotFoundException } from '@nestjs/common';

import { DeleteWalletDTO } from '@/wallet/dto';
import { IWalletRepository } from '@/wallet/interfaces';

@Injectable()
export class DeleteWalletUseCase {
  constructor(private walletRepository: IWalletRepository) {}

  async execute({ id }: DeleteWalletDTO): Promise<void> {
    const wallet = await this.walletRepository.findById(id);
    if (!wallet) throw new NotFoundException('Carteira não encontrada.');

    await this.walletRepository.delete(id);
  }
}
