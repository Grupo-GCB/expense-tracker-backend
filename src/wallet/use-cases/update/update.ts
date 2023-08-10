import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UpdateWalletDTO } from '@/wallet/dto';
import { Wallet } from '@/wallet/infra/entities';
import { IWalletRepository } from '@/wallet/interfaces';

@Injectable()
export class UpdateWalletUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(data: UpdateWalletDTO): Promise<Wallet> {
    try {
      const wallet = await this.walletRepository.update(data);

      if (!wallet) throw new NotFoundException('Carteira não encontrada.');

      return wallet;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Erro ao atualizar a carteira.');
    }
  }
}
