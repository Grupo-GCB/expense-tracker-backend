import { IsNotEmpty } from 'class-validator';

export class FindBankByNameDTO {
  @IsNotEmpty({ message: 'Necessário informar o nome do banco.' })
  name: string;
}
