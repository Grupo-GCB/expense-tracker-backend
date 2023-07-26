import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
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

  @Column()
  picture: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn({ default: null })
  updated_at?: Date;

  @DeleteDateColumn({ default: null })
  deleted_at?: Date;

  @OneToMany(() => BudgetGoal, (budgetGoal) => budgetGoal.user)
  budgetGoal: BudgetGoal[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet[];
}
