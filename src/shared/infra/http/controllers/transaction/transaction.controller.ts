import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { API_RESPONSES } from '@/shared/constants';
import { CreateTransactionDTO, DeleteTransactionDTO } from '@/transaction/dto';
import { Transaction } from '@/transaction/infra/entities';
import {
  DeleteTransactionUseCase,
  RegisterTransactionUseCase,
} from '@/transaction/use-cases';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly registerUseCase: RegisterTransactionUseCase,
    private readonly deleteUseCase: DeleteTransactionUseCase,
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
    return this.registerUseCase.execute(wallet_id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Deleta uma transação.',
    description: 'Esta rota permite deletar uma transação de um usuário.',
  })
  @ApiCreatedResponse(API_RESPONSES.NO_CONTENT)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async delete(@Param() data: DeleteTransactionDTO): Promise<void> {
    await this.deleteUseCase.execute(data);
  }
}
