import { Categories, ENUM_ERROR, TransactionType } from '@/shared/constants';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import {
  IsEnum,
  IsDate,
  IsString,
  IsNumber,
  Min,
  IsUUID,
} from 'class-validator';

export class UpdateTransactionDTO {
  @ApiProperty({
    example: '4e8b5d94-6b16-4a42-b6d1-dc58b553d109',
    description: 'Id da wallet associada à transação.',
  })
  @IsString({ message: 'Id deve ser uma string.' })
  @IsUUID('all', { message: 'Necessário que o id seja do tipo UUID.' })
  wallet_id: string;

  @ApiProperty({
    enum: Categories,
    description: 'Categoria da transação.',
  })
  @IsEnum(Categories, {
    message: ENUM_ERROR.CATEGORIES,
  })
  categories: Categories;

  @ApiProperty({
    example: 'Compra no supermercado.',
    description: 'Descrição da transação.',
  })
  @IsString({ message: 'Descrição deve ser uma string.' })
  description: string;

  @ApiProperty({
    example: 36.99,
    description: 'Valor da transação.',
  })
  @IsNumber({}, { message: 'Value deve ser um número.' })
  @Min(0.01, { message: 'Valor não pode ser menor ou igual a zero.' })
  value: number;

  @ApiProperty({
    enum: TransactionType,
    description: 'Tipo da transação.',
  })
  @IsEnum(TransactionType, {
    message: ENUM_ERROR.TRANSACTION_TYPE,
  })
  type: TransactionType;

  @ApiProperty({
    example: '10-07-23',
    description: 'Data da transação.',
  })
  @IsDate({ message: 'Deve ser uma data.' })
  @Transform(({ value }) => new Date(value))
  date: Date;
}
