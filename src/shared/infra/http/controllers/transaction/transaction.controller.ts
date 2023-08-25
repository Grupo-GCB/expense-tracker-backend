import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Get,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { API_RESPONSES } from '@/shared/constants';
import { CreateTransactionDTO, DeleteTransactionDTO } from '@/transaction/dto';
import { UpdateTransactionDTO } from '@/transaction/dto';
import { Transaction } from '@/transaction/infra/entities';
import {
  DeleteTransactionUseCase,
  RegisterTransactionUseCase,
  UpdateTransactionUseCase,
  FindTransactionsByUserUseCase,
} from '@/transaction/use-cases';
import { ITransactionResponse } from '@/transaction/interfaces';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly registerUseCase: RegisterTransactionUseCase,
    private readonly deleteUseCase: DeleteTransactionUseCase,
    private readonly updateUseCase: UpdateTransactionUseCase,
    private readonly findTransactionsByUserUseCase: FindTransactionsByUserUseCase,
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

  @Put(':id')
  @ApiOperation({
    summary: 'Atualiza uma transação.',
    description: 'Esta rota permite atualizar uma transação de um usuário.',
  })
  @ApiCreatedResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateTransactionDTO,
  ): Promise<Transaction> {
    return this.updateUseCase.execute(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deleta uma transação.',
    description: 'Esta rota permite deletar uma transação de um usuário.',
  })
  @ApiCreatedResponse(API_RESPONSES.NO_CONTENT)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async delete(@Param() data: DeleteTransactionDTO): Promise<void> {
    await this.deleteUseCase.execute(data);
  }

  @Get('/:user_id')
  async findAllByUserId(
    @Param('user_id') user_id: string,
  ): Promise<ITransactionResponse[]> {
    return this.findTransactionsByUserUseCase.execute(user_id);
  }
}
