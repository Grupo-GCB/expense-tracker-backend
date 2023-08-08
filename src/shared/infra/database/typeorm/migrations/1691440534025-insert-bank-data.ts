import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertBankData1691440534025 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO public.bank VALUES ('87b2a64b-2651-422a-8659-c85fedafdc78', 'Santander', 'https://gcb-academy-expense-tracker.s3.sa-east-1.amazonaws.com/santander.webp');
        INSERT INTO public.bank VALUES ('37b2a64b-2651-472a-8659-c85fedafdc78', 'Bradesco', 'https://gcb-academy-expense-tracker.s3.sa-east-1.amazonaws.com/bradesco.webp');
        INSERT INTO public.bank VALUES ('57b2a64b-2651-422a-8659-c85fedafdc78', 'Nubank', 'https://gcb-academy-expense-tracker.s3.sa-east-1.amazonaws.com/nubank.webp');
        INSERT INTO public.bank VALUES ('097d540a-2298-4600-b0f4-77f1e3a0ecb2', 'Picpay', 'https://gcb-academy-expense-tracker.s3.sa-east-1.amazonaws.com/picpay.webp');
        INSERT INTO public.bank VALUES ('809fddc5-e547-41d5-b77a-c1d83735f4ad', 'Banco Inter', 'https://gcb-academy-expense-tracker.s3.sa-east-1.amazonaws.com/inter.webp');
        INSERT INTO public.bank VALUES ('d5c786f1-3797-4d57-a0a1-0f44d540d859', 'Banco do Brasil', 'https://gcb-academy-expense-tracker.s3.sa-east-1.amazonaws.com/banco-do-brasil.webp');
        INSERT INTO public.bank VALUES ('e082a171-e958-4006-98cc-052cfedb82b0', 'BTG Pactual', 'https://gcb-academy-expense-tracker.s3.sa-east-1.amazonaws.com/btg-pactual.webp');
        INSERT INTO public.bank VALUES ('d344a168-60ad-48fc-9d57-64b412e4f6d4', 'C6', 'https://gcb-academy-expense-tracker.s3.sa-east-1.amazonaws.com/c6.webp');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "bank" WHERE "name" = 'Santander'; 
        DELETE FROM "bank" WHERE "name" = 'Bradesco'; 
        DELETE FROM "bank" WHERE "name" = 'Nubank'; 
        DELETE FROM "bank" WHERE "name" = 'Picpay'; 
        DELETE FROM "bank" WHERE "name" = 'Banco Inter'; 
        DELETE FROM "bank" WHERE "name" = 'Banco do Brasil'; 
        DELETE FROM "bank" WHERE "name" = 'BTG Pactual'; 
        DELETE FROM "bank" WHERE "name" = 'C6';
    `);
  }
}
