import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { FindBankByIdUseCase } from '@/bank/use-cases';
import { Bank } from '@/bank/infra/entities';
import { API_RESPONSES } from '@/shared/constants';

@ApiTags('Bank')
@Controller('bank')
export class BankController {
  constructor(private readonly findBankById: FindBankByIdUseCase) {}

  @ApiOperation({
    summary: 'Listar um banco pelo ID.',
    description: 'Esta rota permite visualizar os dados de um banco.',
  })
  @ApiOkResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  @Get(':id')
  async listUser(@Param('id') bank_id: string): Promise<Bank> {
    const { bank } = await this.findBankById.execute(bank_id);
    return bank;
  }
}
