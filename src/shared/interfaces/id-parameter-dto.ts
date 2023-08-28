import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IdParameterDTO {
  @ApiProperty({
    example: 'cd3c245e-9dee-4d34-b74e-70fce1909ff2',
    description: 'Id passado pelo header.',
  })
  @IsUUID('all', { message: 'Necessário que o id seja do tipo UUID.' })
  id: string;
}
