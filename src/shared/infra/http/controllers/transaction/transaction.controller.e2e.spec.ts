import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { ITransactionRepository } from '@/transaction/interface';
import { Transaction } from '@/transaction/infra/entities';
import { Categories, TransactionType } from '@/shared/constants';

describe('Transaction Controller (E2E)', () => {
  let app: INestApplication;
  let validUserId: string;
  let transactionRepository: ITransactionRepository;
  let findAllByUserIdMock: jest.SpyInstance;

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: ITransactionRepository,
          useValue: {
            findAllByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionRepository = testModule.get<ITransactionRepository>(
      ITransactionRepository,
    );
    findAllByUserIdMock = jest.spyOn(transactionRepository, 'findAllByUserId');

    app = testModule.createNestApplication();
    await app.init();

    validUserId = 'google-oauth2|456734566205483104315';
  });

  afterAll(async () => {
    await app.close();
  });

  const createMockTransaction = (): Transaction => ({
    id: '01',
    categories: Categories.CLOTHES,
    description: 'Sample Transaction 1',
    value: 100.0,
    type: TransactionType.EXPENSE,
    date: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    wallet: null,
  });

  const serializeTransaction = (transaction: Transaction): any => ({
    ...transaction,
    date: transaction.date.toISOString(),
    created_at: transaction.created_at.toISOString(),
    updated_at: transaction.updated_at.toISOString(),
  });

  describe('/transaction/:user_id (GET)', () => {
    it('should be able to return transactions for a user', async () => {
      const mockTransactions: Transaction[] = [createMockTransaction()];

      findAllByUserIdMock.mockResolvedValue(mockTransactions);

      const response = await request(app.getHttpServer())
        .get(`/transaction/${validUserId}`)
        .expect(HttpStatus.OK);

      const expectedResponse = mockTransactions.map(serializeTransaction);

      expect(response.body).toEqual(expectedResponse);
    });

    it('should be able to return an empty list of transactions', async () => {
      findAllByUserIdMock.mockResolvedValue([]);

      const response = await request(app.getHttpServer())
        .get(`/transaction/${validUserId}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual([]);
    });
  });
});
