import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { FindBankByIdUseCase } from '@/bank/use-cases';
import { Bank } from '@/bank/infra/entities';

@ApiTags('Bank')
@Controller('bank')
export class BankController {
  constructor(private readonly findBankById: FindBankByIdUseCase) {}

  @ApiOperation({
    summary: 'Listar um usuário pelo ID.',
    description: 'Esta rota permite visualizar os dados de um usuário.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'google-oauth2|456734566205483104315',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Banco não encontrado.',
  })
  @Get(':id')
  async listUser(@Param('id') bankId: string): Promise<Bank> {
    const { bank } = await this.findBankById.execute(bankId);
    return bank;
  }
}
