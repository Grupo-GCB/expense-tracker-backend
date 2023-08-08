import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { AccountType } from '@/shared/constants/enums';

export class SaveWalletDTO {
  @ApiProperty({
    example: 'Banco Itáu',
    description: 'Título da carteira.',
  })
  @IsNotEmpty({ message: 'Necessário informar o título.' })
  title: string;

  @ApiProperty({
    enum: AccountType,
    description: 'Tipo de conta da carteira.',
  })
  @IsNotEmpty({
    message:
      'Insira um dos seguintes tipos: Conta-Corrente, Conta-Poupança, Investimento, Dinheiro e Outros',
  })
  account_type: AccountType;

  @ApiProperty({
    example: 'Esta carteira foi criada para viagens.',
    description: 'Descrição da carteira.',
  })
  @IsNotEmpty({ message: 'Necessário informar a descrição.' })
  description: string;

  @ApiProperty({
    example: '4e8b5d94-6b16-4a42-b6d1-dc58b553d109',
    description: 'ID do banco associado à carteira.',
  })
  @IsNotEmpty({ message: 'Necessário informar o id do banco.' })
  bankId: string;

  @ApiProperty({
    example: 'auth0|58vfb567d5asdea52bc65ebba',
    description: 'ID do usuário proprietário da carteira.',
  })
  @IsNotEmpty({ message: 'Necessário informar o id do usuário.' })
  userId: string;
}
