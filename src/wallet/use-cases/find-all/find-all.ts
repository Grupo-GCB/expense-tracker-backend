import { Injectable } from '@nestjs/common';

import { IWalletRepository, IWalletsResponse } from '@/wallet/interfaces';

@Injectable()
export class FindAllWalletsByUserIdUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(user_id: string): Promise<IWalletsResponse> {
    const wallets = await this.walletRepository.findAllByUserId(user_id);

    return { wallets };
  }
}
