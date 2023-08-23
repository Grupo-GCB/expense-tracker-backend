import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { Wallet } from '@/wallet/infra/entities';
import { API_RESPONSES } from '@/shared/constants';
import { FindAllTransactionsByUserIdUseCase } from '@/transaction/use-cases';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly findAllTransactionsByUserId: FindAllTransactionsByUserIdUseCase,
  ) {}

  @Get('all/:id')
  @ApiOkResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  @ApiOperation({
    summary: 'Listar todas as transações de um usuário pelo ID.',
    description:
      'Esta rota permite visualizar todas as transações de um usuário.',
  })
  async listAllWalletsByUserId(
    @Param('id') user_id: string,
  ): Promise<Wallet[]> {
    const { transactions } = await this.findAllTransactionsByUserId.execute(
      user_id,
    );
    return transactions;
  }
}
