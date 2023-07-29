import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserDTO {
  @IsNotEmpty({ message: 'O campo não pode ser vazio' })
  @IsString({ message: 'Não é uma string válida' })
  @ApiProperty({
    example: '290b6435-13fc-4f12-8550-522ed28134fb',
    description: 'Id do usuário',
    type: 'string',
    required: true,
  })
  user_id: string;
}
