import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { AccountType } from '@/shared/constants';

export class UpdateWalletDTO {
  @ApiProperty({
    example: '4e8b5d94-6b16-4a42-b6d1-dc58b553d109',
    description: 'Id da carteira.',
  })
  @IsNotEmpty({ message: 'Necessário informar o id da carteira.' })
  @IsUUID('all', { message: 'Necessário que o id seja do tipo UUID.' })
  id: string;

  @ApiProperty({
    example: '4e8b5d94-6b16-4a42-b6d1-dc58b553d109',
    description: 'Id do banco associado à carteira.',
  })
  @IsNotEmpty({ message: 'Necessário informar o id do banco.' })
  @IsUUID('all', { message: 'Necessário o id seja do tipo UUID.' })
  bank_id: string;

  @ApiProperty({
    enum: AccountType,
    description: 'Tipo de conta da carteira.',
  })
  @IsNotEmpty({
    message: 'Necessário informar um tipo de conta',
  })
  @IsEnum(AccountType, {
    message:
      'Insira um dos seguintes tipos: Conta-Corrente, Conta-Poupança, Investimento, Dinheiro ou Outros.',
  })
  account_type: AccountType;

  @ApiProperty({
    example: 'Esta carteira foi criada para viagens.',
    description: 'Descrição da carteira.',
  })
  @IsNotEmpty({ message: 'Necessário informar a descrição.' })
  description: string;
}
