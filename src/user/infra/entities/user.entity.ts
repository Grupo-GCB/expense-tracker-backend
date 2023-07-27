import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { BudgetGoal } from '../../../budget-goal/infra/entities/budget-goal.entity';
import { Wallet } from '../../../wallet/infra/entities/wallet.entity';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn({ default: null })
  deleted_at?: Date;

  @OneToMany(() => BudgetGoal, (budgetGoal) => budgetGoal.user)
  budgetGoal: BudgetGoal[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet[];
}
