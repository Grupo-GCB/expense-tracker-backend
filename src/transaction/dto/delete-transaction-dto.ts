import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteTransactionDTO {
  @ApiProperty({
    example: '5s4w0d94-6b16-4a42-b6d1-dc58b553d586',
    description: 'Id da transação.',
  })
  @IsNotEmpty({ message: 'Necessário informar o id da transação.' })
  @IsUUID('all', { message: 'Necessário que o id seja do tipo UUID.' })
  id: string;
}
