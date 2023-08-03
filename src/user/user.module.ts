import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from '@/shared/infra/http/controllers';
import { User } from '@/user/infra/entities';
import { UserRepository } from '@/user/infra/repositories';
import { IUserRepository } from '@/user/interfaces';
import { ListUserByIdUseCase } from '@/user/use-cases';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ secret: process.env.SECRET_KEY }),
  ],
  controllers: [UserController],
  providers: [
    ListUserByIdUseCase,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
