import { Injectable, NotFoundException } from '@nestjs/common';

import { Bank } from '@/bank/infra/entities';
import { IBankRepository } from '@/bank/interfaces';

@Injectable()
export class GetBankByIdUseCase {
  constructor(private readonly bankRepository: IBankRepository) {}

  async execute(id: string): Promise<{ bank: Bank }> {
    const bank = await this.bankRepository.findById(id);

    if (!bank) {
      throw new NotFoundException('Banco não encontrado.');
    }

    return { bank };
  }
}
