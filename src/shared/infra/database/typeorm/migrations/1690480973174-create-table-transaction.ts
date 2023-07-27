import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableTransaction1690480973174 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'categories',
            type: 'enum',
            enum: [
              'Casa',
              'Eletrônicos',
              'Educação',
              'Lazer',
              'Alimentação',
              'Saúde',
              'Supermercado',
              'Roupas',
              'Transporte',
              'Viagem',
              'Serviços',
              'Presentes',
              'Outros',
            ],
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'value',
            type: 'decimal',
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['income', 'expense'],
          },
          {
            name: 'date',
            type: 'timestamp',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
            default: null,
          },
          {
            name: 'walletId',
            type: 'uuid',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['walletId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'wallets',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
    await queryRunner.dropForeignKey('transactions', 'FK_WALLETID_TRANSACTION');
  }
}
