import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableWallet1690480983766 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'wallet',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'account_type',
            type: 'varchar',
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
            name: 'bankId',
            type: 'uuid',
          },
          {
            name: 'userId',
            type: 'uuid',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['bankId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'banks',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('wallet');
    await queryRunner.dropForeignKey('wallet', 'FK_BANKID_WALLET');
    await queryRunner.dropForeignKey('wallet', 'FK_USERID_WALLET');
  }
}
