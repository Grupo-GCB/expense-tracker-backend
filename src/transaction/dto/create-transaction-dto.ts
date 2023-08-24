import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsDate,
  Min,
  IsString,
} from 'class-validator';

import { Categories, ENUM_ERROR, TransactionType } from '@/shared/constants';
export class CreateTransactionDTO {
  @ApiProperty({
    enum: Categories,
    description: 'Categoria da transação.',
  })
  @IsNotEmpty({
    message: 'Necessário informar uma categoria.',
  })
  @IsEnum(Categories, {
    message: ENUM_ERROR.CATEGORIES,
  })
  categories: Categories;

  @ApiProperty({
    example: 'Compra no supermercado.',
    description: 'Descrição da transação.',
  })
  @IsNotEmpty({ message: 'Necessário informar a descrição.' })
  @IsString({ message: 'Descrição deve ser uma string.' })
  description: string;

  @ApiProperty({
    example: 36.99,
    description: 'Valor da transação.',
  })
  @IsNotEmpty({
    message: 'Necessário informar um valor.',
  })
  @IsNumber({}, { message: 'Value deve ser um número.' })
  @Min(0.01, { message: 'Valor não pode ser menor ou igual a zero.' })
  value: number;

  @ApiProperty({
    enum: TransactionType,
    description: 'Tipo da transação.',
  })
  @IsNotEmpty({
    message: 'Necessário informar um tipo de transação.',
  })
  @IsEnum(TransactionType, {
    message: ENUM_ERROR.TRANSACTION_TYPE,
  })
  type: TransactionType;

  @ApiProperty({
    example: '10-07-23',
    description: 'Data da transação.',
  })
  @IsNotEmpty({
    message: 'Necessário informar uma data.',
  })
  @IsDate({ message: 'Deve ser uma data.' })
  @Transform(({ value }) => new Date(value))
  date: Date;
}
