import { Injectable, BadRequestException } from '@nestjs/common';

import { IWalletRepository } from '@/wallet/interfaces';
import { SaveWalletDTO } from '@/wallet/dto';
import { Wallet } from '@/wallet/infra/entities';
import { ListUserByIdUseCase } from '@/user/use-cases';
import { FindBankByIdUseCase } from '@/bank/use-cases/';

@Injectable()
export class RegisterWalletUseCase {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly listUserByIdUseCase: ListUserByIdUseCase,
    private readonly findBankByIdUseCase: FindBankByIdUseCase,
  ) {}

  async createWallet(data: SaveWalletDTO): Promise<Wallet> {
    const user = await this.listUserByIdUseCase.execute(data.user_id);
    if (!user) throw new BadRequestException('Usuário não encontrado.');

    const bank = await this.findBankByIdUseCase.execute(data.bank_id);
    if (!bank) throw new BadRequestException('Banco não encontrado.');

    try {
      return this.walletRepository.create(data);
    } catch {
      throw new BadRequestException('Erro ao criar a carteira.');
    }
  }
}
