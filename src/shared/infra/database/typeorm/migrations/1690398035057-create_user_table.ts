import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1690398035057 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.user (
        id uuid PRIMARY KEY,
        email varchar UNIQUE,
        created_at timestamp DEFAULT NOW(),
        deleted_at timestamp
      );
    
      ALTER TABLE budget_goal ADD CONSTRAINT fk_budget_goal_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;
      ALTER TABLE wallet ADD CONSTRAINT fk_wallet_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop table public.user;
    `);
  }
}
