import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Relation,
  PrimaryColumn,
} from 'typeorm';

import { Wallet } from '@/wallet/infra/entities';

@Entity()
export class Bank {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  picture: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ default: null })
  updated_at?: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;

  @OneToMany(() => Wallet, (wallet) => wallet.bank)
  wallet: Relation<Wallet[]>;
}
