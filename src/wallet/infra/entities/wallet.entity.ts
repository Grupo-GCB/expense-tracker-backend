import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Bank } from '@/bank/infra/entities';
import { AccountType } from '@/shared/constants/enums';
import { Transaction } from '@/transaction/infra/entities';
import { User } from '@/user/infra/entities';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  account_type: AccountType;

  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ default: null })
  updated_at?: Date;

  @DeleteDateColumn({ default: null })
  deleted_at?: Date;

  @ManyToOne(() => Bank)
  @JoinColumn({ name: 'bank_id' })
  bank: Bank;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Transaction, (transaction) => transaction.wallet)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;
}
