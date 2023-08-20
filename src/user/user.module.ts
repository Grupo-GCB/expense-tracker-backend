import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from '@/shared/infra/http/controllers';
import { User } from '@/user/infra/entities';
import { FindUserByIdUseCase, SignInUseCase } from '@/user/use-cases';
import { UserRepository } from '@/user/infra/repositories';
import { IUserRepository } from '@/user/interfaces';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  providers: [
    ListUserByIdUseCase,
    SignInUseCase,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  exports: [
    ListUserByIdUseCase,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
