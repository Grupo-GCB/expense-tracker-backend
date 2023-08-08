import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Bank } from '@/bank/infra/entities';
import { FindBankByNameDTO } from '@/bank/dto';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
  ) {}

  async findBankByName(data: FindBankByNameDTO): Promise<Bank[]> {
    const { name } = data;
    const banks = await this.bankRepository.find({ where: { name } });

    if (!banks || banks.length === 0) {
      throw new NotFoundException(
        'Nenhum banco encontrado com o nome fornecido.',
      );
    }

    return banks;
  }
}
