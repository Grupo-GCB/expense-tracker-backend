import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindTransactionsByUserUseCase } from '@/transaction/use-cases';
import { ITransactionResponse } from '@/transaction/interfaces';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly findTransactionsByUserUseCase: FindTransactionsByUserUseCase,
  ) {}

  @Get('/:user_id')
  async findAllByUserId(
    @Param('user_id') user_id: string,
  ): Promise<ITransactionResponse[]> {
    return this.findTransactionsByUserUseCase.execute(user_id);
  }
}
