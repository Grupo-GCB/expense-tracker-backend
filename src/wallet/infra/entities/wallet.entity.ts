import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Bank } from './bank.entity';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  account_type: string;

  @Column()
  description: string;

  @Column()
  verification_code: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Bank, bank => bank.wallets)
  bank: Bank;

  @ManyToOne(() => User, user => user.wallets)
  user: User;

  @OneToMany(() => Transaction, transaction => transaction.wallet)
  transactions: Transaction[];
}