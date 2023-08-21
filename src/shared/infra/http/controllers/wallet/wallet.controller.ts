import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';

import {
  FindAllWalletsByUserIdUseCase,
  FindWalletByIdUseCase,
  RegisterWalletUseCase,
  UpdateWalletUseCase,
} from '@/wallet/use-cases';
import { Wallet } from '@/wallet/infra/entities';
import { SaveWalletDTO, UpdateWalletDTO } from '@/wallet/dto';
import { API_RESPONSES } from '@/shared/constants';

@ApiTags('Wallet')
@Controller()
export class WalletController {
  constructor(
    private readonly walletUseCase: RegisterWalletUseCase,
    private readonly findAllWalletsByUserId: FindAllWalletsByUserIdUseCase,
    private readonly findWalletById: FindWalletByIdUseCase,
    private readonly updateWalletUseCase: UpdateWalletUseCase,
  ) {}

  @Post('wallet')
  @ApiOperation({
    summary: 'Registrar uma carteira.',
    description: 'Esta rota permite registrar uma carteira de um usuário.',
  })
  @ApiOkResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async createWallet(@Body() walletData: SaveWalletDTO): Promise<Wallet> {
    return this.walletUseCase.createWallet(walletData);
  }

  @Put('update')
  @ApiOperation({
    summary: 'Atualizar uma carteira.',
    description: 'Esta rota permite atualizar a carteira de um usuário.',
  })
  @ApiOkResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async updateWallet(@Body() data: UpdateWalletDTO): Promise<Wallet> {
    return this.updateWalletUseCase.execute(data);
  }

  @Get('wallets/:id')
  @ApiOkResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  @ApiOperation({
    summary: 'Listar todas as carteiras de um usuário pelo ID.',
    description:
      'Esta rota permite visualizar todas as carteiras de um usuário.',
  })
  async listAllWalletsByUserId(
    @Param('id') user_id: string,
  ): Promise<Wallet[]> {
    const { wallets } = await this.findAllWalletsByUserId.execute(user_id);
    return wallets;
  }

  @Get('wallet/:id')
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
