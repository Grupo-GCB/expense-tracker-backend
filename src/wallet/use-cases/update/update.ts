import { Injectable, NotFoundException } from '@nestjs/common';

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

  async execute(id: string, data: UpdateWalletDTO): Promise<Wallet> {
    const [bank, wallet] = await Promise.all([
      this.findBankByIdUseCase.execute(data.bank_id),
      this.walletRepository.findById(id),
    ]);

    if (!bank) throw new NotFoundException('Banco não encontrado.');
    if (!wallet) throw new NotFoundException('Carteira não encontrada.');

    wallet.bank.id = data.bank_id;

    Object.assign(wallet, data);

    await this.walletRepository.update(wallet);

    return this.walletRepository.findById(id);
  }
}
