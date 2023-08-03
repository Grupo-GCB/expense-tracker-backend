import { Module } from '@nestjs/common';

import { JwtAuthProvider } from '@/auth/providers';

@Module({
  providers: [JwtAuthProvider],
  exports: [JwtAuthProvider],
})
export class AuthModule {}
