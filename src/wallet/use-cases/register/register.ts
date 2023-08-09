import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { IWalletRepository } from '@/wallet/interfaces';
import { SaveWalletDTO } from '@/wallet/dto';
import { Wallet } from '@/wallet/infra/entities';
import { ListUserByIdUseCase } from '@/user/use-cases';
import { FindBankByIdUseCase } from '@/bank/use-cases/';
import { AccountType } from '@/shared/constants';

@Injectable()
export class RegisterWalletUseCase {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly listUserByIdUseCase: ListUserByIdUseCase,
    private readonly findBankByIdUseCase: FindBankByIdUseCase,
  ) {}

  async createWallet({ user_id, bank_id }): Promise<Wallet> {
    const user = await this.listUserByIdUseCase.execute(user_id);
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const bank = await this.findBankByIdUseCase.execute(bank_id);
    if (!bank) throw new NotFoundException('Banco não encontrado.');

    const saveWalletDTO: SaveWalletDTO = {
      user_id,
      bank_id,
      account_type: AccountType.CHECKING_ACCOUNT,
      description: 'Descrição da carteira',
    };

    try {
      return this.walletRepository.create(saveWalletDTO);
    } catch {
      throw new BadRequestException('Erro ao criar a carteira.');
    }
  }
}
