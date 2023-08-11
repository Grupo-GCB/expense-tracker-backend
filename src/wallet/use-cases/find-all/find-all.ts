import { Injectable } from '@nestjs/common';

import { IWalletRepository, IWalletsResponse } from '@/wallet/interfaces';

@Injectable()
export class FindAllWalletsUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(): Promise<IWalletsResponse> {
    const wallets = await this.walletRepository.findAll();

    return { wallets };
  }
}
