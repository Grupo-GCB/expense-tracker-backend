import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class GetUserDTO {
  @IsNotEmpty({ message: 'Necessário informar o id' })
  @IsString({ message: 'Id deve ser uma string' })
  @Matches(/^[a-zA-Z0-9|-]+$/, {
    message:
      'Id do usuário inválido. Deve conter apenas letras, números e traços.',
  })
  @ApiProperty({
    example: 'google-oauth2|456734566205483104315',
    description: 'Id do usuário',
    type: 'string',
    required: true,
  })
  user_id: string;
}
