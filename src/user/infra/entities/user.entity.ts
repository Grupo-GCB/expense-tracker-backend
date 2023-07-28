import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';

import { BudgetGoal } from '@/budget-goal/infra/entities';
import { Wallet } from '@/wallet/infra/entities';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @DeleteDateColumn({ default: null })
  deleted_at?: Date;

  @OneToMany(() => BudgetGoal, (budget_goal) => budget_goal.user)
  budget_goal?: Relation<BudgetGoal[]>;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallet?: Relation<Wallet[]>;
}
