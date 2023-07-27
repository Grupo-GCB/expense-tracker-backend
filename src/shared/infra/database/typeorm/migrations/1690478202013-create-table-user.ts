import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableUser1675388649812 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            drop table public.user;
        `);
  }
}
