import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ormconfig } from 'orm.config';
import { BankModule } from './bank/bank.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), BankModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
