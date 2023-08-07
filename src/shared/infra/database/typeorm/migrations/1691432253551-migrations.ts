import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1691432253551 implements MigrationInterface {
    name = 'Migrations1691432253551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "verification_code"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" ADD "verification_code" character varying NOT NULL`);
    }

}
