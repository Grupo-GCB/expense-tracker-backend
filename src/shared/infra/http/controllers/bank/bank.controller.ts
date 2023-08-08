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
          example: '097d340a-2298-5146-b0f4-77f1e3a0ecl9',
        },
        name: {
          type: 'string',
          example: 'PicPay',
        },
        picture: {
          type: 'string',
          example:
            'https://gcb-academy-expense-tracker.s3.sa-east-1.amazonaws.com/picpay.webp',
        },
        created_at: {
          type: 'string',
          example: '2023-08-08T15:26:43.441Z',
        },
        deleted_at: null,
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
