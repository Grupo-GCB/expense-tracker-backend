import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { AccountType } from '@/shared/constants/enums';
import { ENUM_ERROR } from '@/shared/constants';

export class SaveWalletDTO {
  @ApiProperty({
    enum: AccountType,
    description: 'Tipo de conta da carteira.',
  })
  @IsNotEmpty({
    message: 'Necessário informar um tipo de conta',
  })
  @IsEnum(AccountType, {
    message: ENUM_ERROR.ACCOUNT_TYPE,
  })
  account_type: AccountType;

  @ApiProperty({
    example: 'Esta carteira foi criada para viagens.',
    description: 'Descrição da carteira.',
  })
  @IsNotEmpty({ message: 'Necessário informar a descrição.' })
  @IsString({ message: 'Descrição deve ser uma string.' })
  description: string;

  @ApiProperty({
    example: '4e8b5d94-6b16-4a42-b6d1-dc58b553d109',
    description: 'Id do banco associado à carteira.',
  })
  @IsNotEmpty({ message: 'Necessário informar o id do banco.' })
  @IsUUID('all', { message: 'Necessário que o id seja do tipo UUID.' })
  @IsString({ message: 'Id deve ser uma string.' })
  bank_id: string;

  @ApiProperty({
    example: 'auth0|58vfb567d5asdea52bc65ebba',
    description: 'Id do usuário proprietário da carteira.',
  })
  @IsNotEmpty({ message: 'Necessário informar o id do usuário.' })
  @IsString({ message: 'Id deve ser uma string.' })
  user_id: string;
}
