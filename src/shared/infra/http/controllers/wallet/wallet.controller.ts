import { Body, Controller, Post } from '@nestjs/common';

import { RegisterWalletUseCase } from '@/wallet/use-cases';
import { Wallet } from '@/wallet/infra/entities';
import { SaveWalletDTO } from '@/wallet/dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletUseCase: RegisterWalletUseCase) {}

  @Post()
  async createWallet(@Body() walletData: SaveWalletDTO): Promise<Wallet> {
    const createdWallet = await this.walletUseCase.createWallet(walletData);
    return createdWallet;
  }
}
