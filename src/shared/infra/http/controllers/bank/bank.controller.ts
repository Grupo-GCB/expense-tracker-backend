import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { FindAllBanksUseCase, FindBankByIdUseCase } from '@/bank/use-cases';
import { Bank } from '@/bank/infra/entities';
import { API_RESPONSES } from '@/shared/constants';

@ApiTags('Bank')
@Controller('bank')
export class BankController {
  constructor(
    private readonly findBankById: FindBankByIdUseCase,
    private readonly findAll: FindAllBanksUseCase,
  ) {}

  @ApiOperation({
    summary: 'Listar um todos bancos.',
    description: 'Esta rota permite visualizar todos os bancos.',
  })
  @ApiOkResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  @Get('all')
  async listAllBanks(): Promise<Bank[]> {
    const { banks } = await this.findAll.execute();
    return banks;
  }

  @ApiOperation({
    summary: 'Listar um banco pelo ID.',
    description: 'Esta rota permite visualizar os dados de um banco.',
  })
  @ApiOkResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  @Get(':id')
  async listBank(@Param('id') bank_id: string): Promise<Bank> {
    const { bank } = await this.findBankById.execute(bank_id);
    return bank;
  }
}
