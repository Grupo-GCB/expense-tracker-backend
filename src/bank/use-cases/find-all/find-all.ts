import { Injectable } from '@nestjs/common';

import { IBankRepository, IBanksResponse } from '@/bank/interfaces';

@Injectable()
export class FindAllBanksUseCase {
  constructor(private readonly bankRepository: IBankRepository) {}

  async execute(): Promise<IBanksResponse> {
    const banks = await this.bankRepository.findAll();

    return { banks };
  }
}
