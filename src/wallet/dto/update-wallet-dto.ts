import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { AccountType } from '@/shared/constants';

export class UpdateWalletDTO {
  @ApiProperty({
    example: '4e8b5d94-6b16-4a42-b6d1-dc58b553d109',
    description: 'Id do banco associado à carteira.',
  })
  @IsNotEmpty({ message: 'Necessário informar o id do banco.' })
  @IsUUID('all', { message: 'Necessário o id seja do tipo UUID.' })
  @IsString({ message: 'Bank id deve ser uma string.' })
  bank_id: string;

  @ApiProperty({
    enum: AccountType,
    description: 'Tipo de conta da carteira.',
  })
  @IsNotEmpty({
    message: 'Necessário informar um tipo de conta.',
  })
  @IsEnum(AccountType, {
    message:
      'Insira um dos seguintes tipos: Conta-Corrente, Conta-Poupança, Investimento, Dinheiro ou Outros.',
  })
  @IsString({ message: 'Tipo da conta deve ser uma string.' })
  account_type: AccountType;

  @ApiProperty({
    example: 'Esta carteira foi criada para viagens.',
    description: 'Descrição da carteira.',
  })
  @IsNotEmpty({ message: 'Necessário informar a descrição.' })
  @IsString({ message: 'Descrição deve ser uma string.' })
  description: string;
}
