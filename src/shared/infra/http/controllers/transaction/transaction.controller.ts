import { Body, Controller, Param, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { API_RESPONSES } from '@/shared/constants';
import { CreateTransactionDTO } from '@/transaction/dto';
import { Transaction } from '@/transaction/infra/entities';
import { RegisterTransactionUseCase } from '@/transaction/use-cases';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly registerUseCase: RegisterTransactionUseCase) {}

  @Post(':id')
  @ApiOperation({
    summary: 'Registrar uma transação.',
    description: 'Esta rota permite registrar uma transação de um usuário.',
  })
  @ApiCreatedResponse(API_RESPONSES.CREATED)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async create(
    @Param('id') wallet_id: string,
    @Body() data: CreateTransactionDTO,
  ): Promise<Transaction> {
    return this.registerUseCase.execute(wallet_id, data);
  }
}
