import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRelations1692819952258 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" ADD "wallet_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_08081d10759ec250c557cebd81a" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_08081d10759ec250c557cebd81a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "wallet_id"`,
    );
  }
}
