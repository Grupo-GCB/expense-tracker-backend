import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Bank } from '@/bank/infra/entities';
import { FindAllBanksUseCase, FindBankByIdUseCase } from '@/bank/use-cases';
import { API_RESPONSES } from '@/shared/constants';
import { IdParameterDTO } from '@/shared/interfaces';

@ApiTags('Bank')
@Controller('bank')
export class BankController {
  constructor(
    private readonly findBankById: FindBankByIdUseCase,
    private readonly findAll: FindAllBanksUseCase,
  ) {}

  @ApiOperation({
    summary: 'Listar todos bancos.',
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
  async listBank(@Param() { id }: IdParameterDTO): Promise<Bank> {
    const { bank } = await this.findBankById.execute(id);
    return bank;
  }
}
