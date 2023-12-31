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
  FindTransactionsByUserUseCase,
  RegisterTransactionUseCase,
  UpdateTransactionUseCase,
  FindAllByWalletIdUseCase,
} from '@/transaction/use-cases';
import {
  ISummaryResponse,
  ITransactionsResponse,
} from '@/transaction/interface';
import { IdParameterDTO } from '@/shared/interfaces';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly registerUseCase: RegisterTransactionUseCase,
    private readonly deleteUseCase: DeleteTransactionUseCase,
    private readonly updateUseCase: UpdateTransactionUseCase,
    private readonly findTransactionsByUserUseCase: FindTransactionsByUserUseCase,
    private readonly findAllByWalletIdUseCase: FindAllByWalletIdUseCase,
  ) {}

  @Post(':id')
  @ApiOperation({
    summary: 'Registrar uma transação.',
    description: 'Esta rota permite registrar uma transação de um usuário.',
  })
  @ApiCreatedResponse(API_RESPONSES.CREATED)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async create(
    @Param() { id }: IdParameterDTO,
    @Body() data: CreateTransactionDTO,
  ): Promise<Transaction> {
    return this.registerUseCase.execute(id, data);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualiza uma transação.',
    description: 'Esta rota permite atualizar uma transação de um usuário.',
  })
  @ApiCreatedResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async update(
    @Param() { id }: IdParameterDTO,
    @Body() data: UpdateTransactionDTO,
  ): Promise<Transaction> {
    return this.updateUseCase.execute(id, data);
  }

  @Get('/:user_id')
  @ApiOperation({
    summary: 'Busca todas as transações de um usuário.',
    description: 'Esta rota permite buscar as transações de um usuário.',
  })
  @ApiCreatedResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async findAllByUserId(
    @Param('user_id') user_id: string,
  ): Promise<ITransactionsResponse[]> {
    return this.findTransactionsByUserUseCase.execute(user_id);
  }

  @Get('/summary/:walletId')
  @ApiOperation({
    summary: 'Busca todas as transações atreladas a uma carteira.',
    description:
      'Esta rota permite buscar todas as transações atreladas a uma carteira.',
  })
  @ApiCreatedResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async findAllByWalletId(
    @Param('walletId') walletId: string,
  ): Promise<ISummaryResponse> {
    return this.findAllByWalletIdUseCase.execute(walletId);
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
}
