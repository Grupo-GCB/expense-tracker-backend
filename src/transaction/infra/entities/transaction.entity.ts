import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Categories, TransactionType } from '@/shared/constants/enums';
import { Wallet } from '@/wallet/infra/entities';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
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

  @OneToMany(() => Wallet, (wallet) => wallet.transaction)
  wallets: Wallet[];
}
