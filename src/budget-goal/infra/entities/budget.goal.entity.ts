import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { User } from '../../../user/infra/entities';

@Entity()
export class BudgetGoal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  goal_value: number;

  @Column({ type: 'timestamp' })
  goal_date: Date;

  @Column()
  created_at?: Date;

  @Column({ default: null })
  updated_at?: Date;

  @Column({ default: null })
  deleted_at?: Date;

  @ManyToOne(() => User, (user) => user.budgetGoal)
  user: User;
}
