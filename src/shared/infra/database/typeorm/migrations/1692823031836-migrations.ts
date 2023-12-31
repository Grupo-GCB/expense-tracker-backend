import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRelation1692823031836 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "categories" character varying NOT NULL, "description" character varying NOT NULL, "value" numeric NOT NULL, "type" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "wallet_id" uuid, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "budget_goal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "goal_value" integer NOT NULL, "goal_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "userId" character varying, CONSTRAINT "PK_c06e71e540a20fcb4c10838cb70" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_type" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "bank_id" uuid, "user_id" character varying, CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bank" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "logo_url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_11f196da2e68cef1c7e84b4fe94" UNIQUE ("name"), CONSTRAINT "PK_7651eaf705126155142947926e8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_08081d10759ec250c557cebd81a" FOREIGN KEY ("wallet_id") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_goal" ADD CONSTRAINT "FK_ffa781323297966ce08f0213b4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_1025ead2d7e78816b252dff421a" FOREIGN KEY ("bank_id") REFERENCES "bank"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_72548a47ac4a996cd254b082522" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_72548a47ac4a996cd254b082522"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_1025ead2d7e78816b252dff421a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "budget_goal" DROP CONSTRAINT "FK_ffa781323297966ce08f0213b4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_08081d10759ec250c557cebd81a"`,
    );
    await queryRunner.query(`DROP TABLE "bank"`);
    await queryRunner.query(`DROP TABLE "wallet"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "budget_goal"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
