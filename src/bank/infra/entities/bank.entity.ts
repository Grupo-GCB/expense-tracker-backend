import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Wallet } from '@/wallet/infra/entities';
@Entity()
export class Bank {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  picture: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @OneToMany(() => Wallet, (wallet) => wallet.bank)
  wallet: Wallet[];
}
