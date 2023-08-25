import {
  HttpStatus,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import {
  AccountType,
  Categories,
  TransactionType,
} from '@/shared/constants/enums';
import { CreateTransactionDTO, UpdateTransactionDTO } from '@/transaction/dto';
import { Transaction } from '@/transaction/infra/entities';
import { ITransactionRepository } from '@/transaction/interface';
import {
  DeleteTransactionUseCase,
  RegisterTransactionUseCase,
  UpdateTransactionUseCase,
} from '@/transaction/use-cases';
import { Wallet } from '@/wallet/infra/entities';
import { IWalletRepository } from '@/wallet/interfaces';

describe('Transaction Controller (E2E)', () => {
  let app: INestApplication;
  let walletRepository: IWalletRepository;
  let validUserId: string;
  let transactionRepository: ITransactionRepository;
  let registerTransactionMock: RegisterTransactionUseCase;
  let updateTransactionMock: UpdateTransactionUseCase;
  let findAllByUserIdMock: jest.SpyInstance;
  let deleteTransactionMock: DeleteTransactionUseCase;

  const validTransactionId = '5c20c7f5-26f2-4d36-bfa0-ad98795869ff';
  const invalidTransactionId = 'invalid-id';

  const validWalletId = '160cb2eb-92ca-4c2b-b7ad-61c728c634dc';
  const invalidWalletId = 'invalid-id';

  const mockWallet = {
    id: validTransactionId,
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Primeira Descrição de carteira.',
  } as Wallet;

  const mockTransactionResponse = {
    id: validTransactionId,
    description: 'atualizou',
    value: 50,
    type: TransactionType.INCOME,
    wallet: {
      id: validWalletId,
    } as Wallet,
  } as Transaction;

  const transactionDataParams: CreateTransactionDTO = {
    value: 50,
    type: TransactionType.INCOME,
    description: 'Descrição',
    categories: Categories.HOME,
  } as Transaction;

  const mockUpdateDTOData: UpdateTransactionDTO = {
    wallet_id: validWalletId,
    categories: Categories.HOME,
    description: 'atualizou',
    value: 50,
    type: TransactionType.INCOME,
    date: new Date('2023-11-10'),
  };

  const mockUpdatedTransaction = {
    id: validTransactionId,
    categories: Categories.HOME,
    description: 'atualizou',
    value: 50,
    type: TransactionType.INCOME,
    wallet: {
      id: validWalletId,
    } as Wallet,
  } as Transaction;

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

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        RegisterTransactionUseCase,
        {
          provide: ITransactionRepository,
          useValue: {
            findAllByUserId: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: IWalletRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockWallet),
          },
        },
      ],
    }).compile();

    walletRepository = testModule.get<IWalletRepository>(IWalletRepository);

    transactionRepository = testModule.get<ITransactionRepository>(
      ITransactionRepository,
    );
    updateTransactionMock = testModule.get<UpdateTransactionUseCase>(
      UpdateTransactionUseCase,
    );
    registerTransactionMock = testModule.get<RegisterTransactionUseCase>(
      RegisterTransactionUseCase,
    );
    deleteTransactionMock = testModule.get<DeleteTransactionUseCase>(
      DeleteTransactionUseCase,
    );

    findAllByUserIdMock = jest.spyOn(transactionRepository, 'findAllByUserId');

    app = testModule.createNestApplication();
    await app.init();

    validUserId = 'google-oauth2|456734566205483104315';
  });

  describe('/transaction/:id (POST)', () => {
    it('should be defined', () => {
      expect(walletRepository).toBeDefined();
      expect(transactionRepository).toBeDefined();
      expect(registerTransactionMock).toBeDefined();
    });

    it('should register a transaction', async () => {
      jest
        .spyOn(registerTransactionMock, 'execute')
        .mockResolvedValue(mockTransactionResponse);
      jest.spyOn(walletRepository, 'findById').mockResolvedValue(mockWallet);
      await request(app.getHttpServer())
        .post(`/transaction/${validTransactionId}`)
        .send(transactionDataParams)
        .expect(HttpStatus.CREATED);
    });

    it('should not be able to register transaction if wallet does not exist', async () => {
      jest.spyOn(walletRepository, 'findById').mockResolvedValueOnce(null);
      jest
        .spyOn(transactionRepository, 'create')
        .mockRejectedValueOnce(new NotFoundException());

      await request(app.getHttpServer())
        .post(`/transaction/${invalidTransactionId}`)
        .send(transactionDataParams)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/transaction/:id (PUT)', () => {
    it('should be defined', () => {
      expect(walletRepository).toBeDefined();
      expect(transactionRepository).toBeDefined();
      expect(updateTransactionMock).toBeDefined();
    });

    it('should update a transaction', async () => {
      jest
        .spyOn(updateTransactionMock, 'execute')
        .mockResolvedValueOnce(mockUpdatedTransaction);

      await request(app.getHttpServer())
        .put(`/transaction/${validTransactionId}`)
        .send(mockUpdateDTOData)
        .expect(HttpStatus.OK);
    });

    it('should not be able to update transaction if transaction does not exist', async () => {
      jest.spyOn(transactionRepository, 'findById').mockResolvedValueOnce(null);

      await request(app.getHttpServer())
        .put(`/transaction/${invalidTransactionId}`)
        .send(mockUpdateDTOData)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should not be able to update transaction if wallet does not exist', async () => {
      jest.spyOn(walletRepository, 'findById').mockResolvedValueOnce(null);
      jest
        .spyOn(transactionRepository, 'findById')
        .mockResolvedValueOnce(mockUpdatedTransaction);

      mockUpdateDTOData.wallet_id = invalidWalletId;

      await request(app.getHttpServer())
        .put(`/transaction/${validTransactionId}`)
        .send(mockUpdateDTOData)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/transaction/:id (DELETE)', () => {
    it('should be able to delete a transaction', async () => {
      jest.spyOn(deleteTransactionMock, 'execute').mockResolvedValue();

      await request(app.getHttpServer())
        .delete(`/transaction/${validTransactionId}`)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should not be able to delete a transaction if transaction does not exist', async () => {
      jest
        .spyOn(transactionRepository, 'findById')
        .mockRejectedValue(new NotFoundException());

      await request(app.getHttpServer())
        .delete(`/transaction/${invalidTransactionId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/transaction/:user_id (GET)', () => {
    it('should be able to return transactions for an user', async () => {
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

  afterAll(async () => {
    await app.close();
  });
});
