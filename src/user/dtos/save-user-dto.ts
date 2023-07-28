import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SaveUserDTO {
  @IsNotEmpty({ message: 'Necessário informar o id.' })
  @IsString({ message: 'Id deve ser uma string.' })
  id: string;

  @IsNotEmpty({ message: 'Necessário informar o nome.' })
  @IsString({ message: 'Nome deve ser uma string.' })
  name: string;

  @IsNotEmpty({ message: 'Necessário informar o e-mail.' })
  @IsString({ message: 'Email deve ser uma string.' })
  @IsEmail({}, { message: 'Deve ser e-mail válido.' })
  email: string;
}
