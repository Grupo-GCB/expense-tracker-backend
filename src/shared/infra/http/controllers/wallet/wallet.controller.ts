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

import { API_RESPONSE_OK, API_BAD_REQUEST_RESPONSE } from '@/shared/constants/';

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
    ...API_RESPONSE_OK,
    type: Wallet,
  })
  @ApiBadRequestResponse({
    ...API_BAD_REQUEST_RESPONSE,
  })
  async createWallet(@Body() walletData: SaveWalletDTO): Promise<Wallet> {
    return this.walletUseCase.createWallet(walletData);
  }
}
