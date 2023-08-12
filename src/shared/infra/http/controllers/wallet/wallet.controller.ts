import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import {
  FindAllWalletsUseCase,
  RegisterWalletUseCase,
} from '@/wallet/use-cases';
import { Wallet } from '@/wallet/infra/entities';
import { SaveWalletDTO } from '@/wallet/dto';
import { API_RESPONSES } from '@/shared/constants';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletUseCase: RegisterWalletUseCase,
    private readonly findAllWallets: FindAllWalletsUseCase,
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

  @Get()
  async listAllWallets(): Promise<Wallet[]> {
    const { wallets } = await this.findAllWallets.execute();
    return wallets;
  }
}
