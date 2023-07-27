import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Wallet } from '@/wallet/infra/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [],
})
export class UserModule {}
