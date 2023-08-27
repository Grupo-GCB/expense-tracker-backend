import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { API_RESPONSES } from '@/shared/constants';
import {
  DeleteWalletDTO,
  IdParameterDTO,
  SaveWalletDTO,
  UpdateWalletDTO,
} from '@/wallet/dto';
import { Wallet } from '@/wallet/infra/entities';
import {
  DeleteWalletUseCase,
  FindAllWalletsByUserIdUseCase,
  FindWalletByIdUseCase,
  RegisterWalletUseCase,
  UpdateWalletUseCase,
} from '@/wallet/use-cases';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletUseCase: RegisterWalletUseCase,
    private readonly findAllWalletsByUserId: FindAllWalletsByUserIdUseCase,
    private readonly findWalletById: FindWalletByIdUseCase,
    private readonly updateWalletUseCase: UpdateWalletUseCase,
    private readonly deleteWalletUseCase: DeleteWalletUseCase,
  ) {}

  @Post()
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

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar uma carteira.',
    description: 'Esta rota permite atualizar a carteira de um usuário.',
  })
  @ApiOkResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async updateWallet(
    @Param() { id }: IdParameterDTO,
    @Body() data: UpdateWalletDTO,
  ): Promise<Wallet> {
    return await this.updateWalletUseCase.execute(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deleção de uma carteira.',
    description: 'Esta rota permite deletar a carteira de um usuário.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse(API_RESPONSES.NO_CONTENT)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async deleteWallet(@Param() data: DeleteWalletDTO): Promise<void> {
    await this.deleteWalletUseCase.execute(data);
  }

  @Get('all/:id')
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

  @Get(':id')
  @ApiOperation({
    summary: 'Listar uma carteira pelo ID.',
    description: 'Esta rota permite visualizar os dados de uma carteira.',
  })
  @ApiResponse(API_RESPONSES.OK)
  @ApiNotFoundResponse(API_RESPONSES.NOT_FOUND)
  async listWallet(@Param() wallet_id: IdParameterDTO): Promise<Wallet> {
    const { wallet } = await this.findWalletById.execute(wallet_id);
    return wallet;
  }
}
