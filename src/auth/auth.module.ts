import { Module } from '@nestjs/common';

import { JwtAuthProvider } from './providers/jwt-auth-provider/jwt-auth-provider';
import { IAuthProvider } from './interfaces';

@Module({
  providers: [
    JwtAuthProvider,
    {
      provide: IAuthProvider,
      useClass: JwtAuthProvider,
    },
  ],
  exports: [JwtAuthProvider],
})
export class AuthModule {}
