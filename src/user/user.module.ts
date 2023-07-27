import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/user/infra/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
})
export class UserModule {}
