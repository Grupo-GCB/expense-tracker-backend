import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { RegisterWalletUseCase } from '@/wallet/use-cases';
import { Wallet } from '@/wallet/infra/entities';
import { SaveWalletDTO } from '@/wallet/dto';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletUseCase: RegisterWalletUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar uma carteira.',
    description: 'Esta rota permite registrar uma carteira de um usuário.',
  })
  @ApiOkResponse({
    description: 'Carteira registrada com sucesso.',
    type: Wallet,
  })
  @ApiBadRequestResponse({
    description:
      'Erro de validação. Veja a mensagem de erro para mais detalhes.',
  })
  async createWallet(@Body() walletData: SaveWalletDTO): Promise<Wallet> {
    return await this.walletUseCase.createWallet(walletData);
  }
}
