import { Injectable, NotFoundException } from '@nestjs/common';

import { IWalletRepository } from '@/wallet/interfaces';
import { SaveWalletDTO } from '@/wallet/dto';
import { Wallet } from '@/wallet/infra/entities';
import { FindUserByIdUseCase } from '@/user/use-cases';
import { FindBankByIdUseCase } from '@/bank/use-cases/';

@Injectable()
export class RegisterWalletUseCase {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findBankByIdUseCase: FindBankByIdUseCase,
  ) {}

  async createWallet(data: SaveWalletDTO): Promise<Wallet> {
    const [user, bank] = await Promise.all([
      this.findUserByIdUseCase.execute(data.user_id),
      this.findBankByIdUseCase.execute(data.bank_id),
    ]);

    if (!user) throw new NotFoundException('Usuário não encontrado.');
    if (!bank) throw new NotFoundException('Banco não encontrado.');

    const saveWalletDTO: SaveWalletDTO = {
      user_id: data.user_id,
      bank_id: data.bank_id,
      account_type: data.account_type,
      description: data.description,
    };

    return this.walletRepository.create(saveWalletDTO);
  }
}
