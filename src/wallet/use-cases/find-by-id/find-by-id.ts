import { IWalletReponse, IWalletRepository } from '@/wallet/interfaces';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FindWalletByIdUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(id: string): Promise<IWalletReponse> {
    const wallet = await this.walletRepository.findById(id);

    if (!wallet) throw new NotFoundException('Carteira não encontrada.');

    return { wallet };
  }
}
