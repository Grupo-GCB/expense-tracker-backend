import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

import {
  DeleteWalletUseCase,
  RegisterWalletUseCase,
  UpdateWalletUseCase,
} from '@/wallet/use-cases';
import { Wallet } from '@/wallet/infra/entities';
import { DeleteWalletDTO, SaveWalletDTO, UpdateWalletDTO } from '@/wallet/dto';
import { API_RESPONSES } from '@/shared/constants';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletUseCase: RegisterWalletUseCase,
    private readonly updateWalletUseCase: UpdateWalletUseCase,
    private readonly deleteWalletUseCase: DeleteWalletUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar uma carteira.',
    description: 'Esta rota permite registrar uma carteira de um usuário.',
  })
  @ApiOkResponse(API_RESPONSES.OK)
  @ApiBadRequestResponse(API_RESPONSES.BAD_REQUEST)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async createWallet(@Body() walletData: SaveWalletDTO): Promise<Wallet> {
    return this.walletUseCase.createWallet(walletData);
  }

  @Put('update')
  @ApiOperation({
    summary: 'Atualizar uma carteira.',
    description: 'Esta rota permite atualizar uma carteira de um usuário.',
  })
  @ApiOkResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async updateWallet(@Body() data: UpdateWalletDTO): Promise<Wallet> {
    return this.updateWalletUseCase.execute(data);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse(API_RESPONSES.NO_CONTENT)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async deleteWallet(@Param() data: DeleteWalletDTO): Promise<void> {
    await this.deleteWalletUseCase.execute(data);
  }
}
