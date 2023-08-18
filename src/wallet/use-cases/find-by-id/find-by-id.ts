import { Injectable, NotFoundException } from '@nestjs/common';

import { IWalletResponse, IWalletRepository } from '@/wallet/interfaces';

@Injectable()
export class FindWalletByIdUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(id: string): Promise<IWalletResponse> {
    const wallet = await this.walletRepository.findById(id);

    if (!wallet) throw new NotFoundException('Carteira não encontrada.');

    return { wallet };
  }
}
