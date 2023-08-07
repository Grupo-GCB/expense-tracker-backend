import { IsEnum, IsNotEmpty } from 'class-validator';

import { AccountType } from '@/shared/constants/enums';

export class SaveWalletDTO {
  @IsNotEmpty({ message: 'Necessário informar o título.' })
  title: string;

  @IsNotEmpty({ message: 'Necessário ser um enum.' })
  @IsEnum(AccountType)
  account_type: AccountType;

  @IsNotEmpty({ message: 'Necessário informar a descrição.' })
  description: string;

  @IsNotEmpty({ message: 'Necessário informar o id do banco.' })
  bankId: string;

  @IsNotEmpty({ message: 'Necessário informar o id do usuário.' })
  userId: string;
}
