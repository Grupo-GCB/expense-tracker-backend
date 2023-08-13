import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';

import {
  FindAllWalletsUseCase,
  FindWalletByIdUseCase,
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
    private readonly findWalletById: FindWalletByIdUseCase,
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

  @Get('all')
  @ApiOkResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  @ApiOperation({
    summary: 'Listar todas as carteiras.',
    description: 'Esta rota permite visualizar todas as carteiras.',
  })
  async listAllWallets(): Promise<Wallet[]> {
    const { wallets } = await this.findAllWallets.execute();
    return wallets;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Listar uma carteira pelo ID.',
    description: 'Esta rota permite visualizar os dados de uma carteira.',
  })
  @ApiResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async listWallet(@Param('id') wallet_id: string): Promise<Wallet> {
    const { wallet } = await this.findWalletById.execute(wallet_id);
    return wallet;
  }
}
