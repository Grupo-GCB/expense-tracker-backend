import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Bank } from '@/bank/infra/entities';
import { IBankRepository } from '@/bank/interfaces';
import { FindBankByNameDTO } from '@/bank/dto/find-bank-by-name-dto';

@Injectable()
export class BankRepository implements IBankRepository {
  constructor(
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,
  ) {}

  async findByName(data: FindBankByNameDTO): Promise<Bank[]> {
    return this.bankRepository.find({
      where: { name: data.name },
    });
  }
}
