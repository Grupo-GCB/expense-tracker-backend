import {
  Entity,
  Column,
  ManyToOne,
  UpdateDateColumn,
  DeleteDateColumn,
  CreateDateColumn,
  Relation,
  PrimaryColumn,
} from 'typeorm';

import { Wallet } from '@/wallet/infra/entities';
import { Categories, TransactionType } from '@/shared/constants';

@Entity()
export class Transaction {
  @PrimaryColumn()
  id: string;

  @Column()
  categories: Categories;

  @Column()
  description: string;

  @Column('decimal')
  value: number;

  @Column()
  type: TransactionType;

  @Column({ type: 'timestamp' })
  date: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ default: null })
  updated_at?: Date;

  @DeleteDateColumn({ default: null })
  deleted_at?: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Relation<Wallet>;
}
