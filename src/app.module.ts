import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ormconfig } from 'orm.config';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig) /* , UserModule */],
  controllers: [],
  providers: [],
})
export class AppModule {}
