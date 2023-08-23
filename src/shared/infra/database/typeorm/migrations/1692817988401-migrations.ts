import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateWalletRelation1692817988401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "walletId"`);
    await queryRunner.query(`ALTER TABLE "wallet" ADD "transaction_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_62a01b9c3a734b96a08c621b371" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_62a01b9c3a734b96a08c621b371"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP COLUMN "transaction_id"`,
    );
    await queryRunner.query(`ALTER TABLE "transaction" ADD "walletId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}