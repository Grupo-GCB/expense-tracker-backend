import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '@/user/infra/entities';

@Entity()
export class BudgetGoal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description?: string;

  @Column()
  goal_value: number;

  @Column({ type: 'timestamp' })
  goal_date: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ default: null })
  updated_at?: Date;

  @DeleteDateColumn({ default: null })
  deleted_at?: Date;

  @ManyToOne(() => User, (user) => user.budget_goal)
  user: User;
}
