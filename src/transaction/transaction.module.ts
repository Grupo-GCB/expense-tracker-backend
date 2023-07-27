import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from '@/transaction/infra/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [],
})
export class UserModule {}
