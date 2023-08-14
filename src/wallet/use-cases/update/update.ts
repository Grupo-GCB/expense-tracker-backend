import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UpdateWalletDTO } from '@/wallet/dto';
import { Wallet } from '@/wallet/infra/entities';
import { IWalletRepository } from '@/wallet/interfaces';
import { FindBankByIdUseCase } from '@/bank/use-cases';

@Injectable()
export class UpdateWalletUseCase {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly findBankByIdUseCase: FindBankByIdUseCase,
  ) {}

  async execute(data: UpdateWalletDTO): Promise<Wallet> {
    const bank = await this.findBankByIdUseCase.execute(data.bank_id);
    if (!bank) throw new NotFoundException('Banco não encontrado.');

    const wallet = await this.walletRepository.findById(data.id);
    if (!wallet) throw new NotFoundException('Carteira não encontrada.');

    try {
      return this.walletRepository.update(data);
    } catch {
      throw new BadRequestException('Erro ao atualizar a carteira.');
    }
  }
}
