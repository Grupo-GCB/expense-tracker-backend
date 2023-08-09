import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Bank } from '@/bank/infra/entities';
import { IBankRepository } from '@/bank/interfaces';

@Injectable()
export class BankRepository implements IBankRepository {
  constructor(
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,
  ) {}

  async findById(id: string): Promise<Bank> {
    return this.bankRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Bank[]> {
    return this.bankRepository.find();
  }
}
