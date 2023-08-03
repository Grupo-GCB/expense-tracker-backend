import { Module } from '@nestjs/common';

import { JwtAuthProvider } from '@/auth/providers';
import { IJwtAuthProvider } from '@/auth/interfaces';

@Module({
  providers: [
    {
      provide: IJwtAuthProvider,
      useClass: JwtAuthProvider,
    },
  ],
  exports: [IJwtAuthProvider],
})
export class AuthModule {}
