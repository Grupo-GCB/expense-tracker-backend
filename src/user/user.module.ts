import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/user/infra/entities';
import { ListUserByIdUseCase } from '@/user/use-cases';
import { IUserRepository } from '@/user/interfaces';
import { UserRepository } from '@/user/infra/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [
    ListUserByIdUseCase,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
