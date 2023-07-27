import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Bank } from '@/bank/infra/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Bank])],
  controllers: [],
})
export class BankModule {}
