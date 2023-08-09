import { Injectable, NotFoundException } from '@nestjs/common';

import { IBankRepository, IBankResponse } from '@/bank/interfaces';

@Injectable()
export class FindBankByIdUseCase {
  constructor(private readonly bankRepository: IBankRepository) {}

  async execute(id: string): Promise<IBankResponse> {
    const bank = await this.bankRepository.findById(id);

    if (!bank) throw new NotFoundException('Banco não encontrado.');

    return { bank };
  }
}
