import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from '@/shared/infra/http/controllers';
import { User } from '@/user/infra/entities';
import { ListUserByIdUseCase, SignInUseCase } from '@/user/use-cases';
import { UserRepository } from '@/user/infra/repositories';
import { IUserRepository } from '@/user/interfaces';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository]), AuthModule],
  controllers: [UserController],
  providers: [
    ListUserByIdUseCase,
    SignInUseCase,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  exports: [],
})
export class UserModule {}
