import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm';

import { Wallet } from '@/wallet/infra/entities';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: [
      'Casa',
      'Eletrônicos',
      'Educação',
      'Lazer',
      'Alimentação',
      'Saúde',
      'Supermercado',
      'Roupas',
      'Transporte',
      'Viagem',
      'Serviços',
      'Presentes',
      'Outros',
    ],
  })
  categories: string;

  @Column()
  description: string;

  @Column('decimal')
  value: number;

  @Column({ type: 'enum', enum: ['income', 'expense'] })
  type: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ default: null })
  updated_at?: Date;

  @DeleteDateColumn({ default: null })
  deleted_at?: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;
}
