import { Body, Controller, Param, Post } from '@nestjs/common';

import { ITransactionRepository } from '@/transaction/interface';
import { RegisterTransactionUseCase } from '@/transaction/use-cases/register/register';
import { CreateTransactionDTO } from '@/transaction/dto';
import { Transaction } from '@/transaction/infra/entities';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { API_RESPONSES } from '@/shared/constants';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly registerUseCase: RegisterTransactionUseCase,
  ) {}

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
    return await this.transactionRepository.create(wallet_id, data);
  }
}
