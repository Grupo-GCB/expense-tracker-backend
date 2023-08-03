import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
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
  title: string;

  @Column()
  account_type: AccountType;

  @Column()
  description: string;

  @Column()
  verification_code: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ default: null })
  updated_at?: Date;

  @DeleteDateColumn({ default: null })
  deleted_at?: Date;

  @ManyToOne(() => Bank, (bank) => bank.wallet)
  bank: Relation<Bank>;

  @ManyToOne(() => User, (user) => user.wallet)
  user: Relation<User>;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Relation<Transaction[]>;
}
