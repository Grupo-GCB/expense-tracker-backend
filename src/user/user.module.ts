import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { User } from '@/user/infra/entities';
import { ListUserByIdUseCase } from '@/user/use-cases';
import { UserRepository } from '@/user/infra/repositories';
import { IUserRepository } from './interfaces/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ secret: process.env.SECRET_KEY }),
  ],
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
