import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Relation,
  PrimaryColumn,
} from 'typeorm';

import { User } from '@/user/infra/entities';
import { Bank } from '@/bank/infra/entities';
import { Transaction } from '@/transaction/infra/entities';
import { AccountType } from '@/shared/constants';

@Entity()
export class Wallet {
  @PrimaryColumn()
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

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Bank, (bank) => bank.wallet)
  bank: Relation<Bank>;

  @ManyToOne(() => User, (user) => user.wallet)
  user: Relation<User>;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Relation<Transaction[]>;
}
