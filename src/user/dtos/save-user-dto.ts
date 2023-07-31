import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SaveUserDTO {
  @IsNotEmpty({ message: 'Necessário informar o id.' })
  @IsString({ message: 'Id deve ser uma string.' })
  @ApiProperty({
    example: 'auth0|58vfb567d5asdea52bc65ebba',
    description: 'Id do usuário',
    type: 'string',
    required: true,
  })
  id: string;

  @IsNotEmpty({ message: 'Necessário informar o nome.' })
  @IsString({ message: 'Nome deve ser uma string.' })
  @ApiProperty({
    example: 'John Doe',
    description: 'Nome do usuário',
    type: 'string',
    required: true,
  })
  name: string;

  @IsNotEmpty({ message: 'Necessário informar o e-mail.' })
  @IsString({ message: 'Email deve ser uma string.' })
  @IsEmail({}, { message: 'Deve ser um e-mail válido.' })
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email do usuário',
    type: 'string',
    required: true,
  })
  email: string;
}
