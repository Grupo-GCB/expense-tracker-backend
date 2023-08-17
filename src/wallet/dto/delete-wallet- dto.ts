import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteWalletDTO {
  @ApiProperty({
    example: '4e8b5d94-6b16-4a42-b6d1-dc58b553d109',
    description: 'Id da carteira.',
  })
  @IsNotEmpty({ message: 'Necessário informar o id da carteira.' })
  @IsUUID('all', { message: 'Necessário que o id seja do tipo UUID.' })
  id: string;
}
