import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BudgetGoal } from './infra/entities';

@Module({
  imports: [TypeOrmModule.forFeature([BudgetGoal])],
  controllers: [],
})
export class BankModule {}
