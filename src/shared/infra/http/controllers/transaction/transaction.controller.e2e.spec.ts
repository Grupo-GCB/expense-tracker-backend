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
import { CreateTransactionDTO } from '@/transaction/dto';
import { Transaction } from '@/transaction/infra/entities';
import { ITransactionRepository } from '@/transaction/interface';
import {
  DeleteTransactionUseCase,
  RegisterTransactionUseCase,
} from '@/transaction/use-cases';
import { Wallet } from '@/wallet/infra/entities';
import { IWalletRepository } from '@/wallet/interfaces';

describe('Transaction Controller (E2E)', () => {
  let app: INestApplication;
  let testModule: TestingModule;
  let walletRepository: IWalletRepository;
  let transactionRepository: ITransactionRepository;
  let registerTransactionMock: RegisterTransactionUseCase;
  let deleteTransactionMock: DeleteTransactionUseCase;

  const validTransactionId = '5c20c7f5-26f2-4d36-bfa0-ad98795869ff';
  const invalidTransactionId = 'invalid-id';

  const mockWallet = {
    id: validTransactionId,
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Primeira Descrição de carteira.',
  } as Wallet;

  const mockTransactionResponse = {
    id: 'anyId',
    value: 50,
    type: TransactionType.INCOME,
    description: 'Descrição',
  } as Transaction;

  const transactionDataParams: CreateTransactionDTO = {
    value: 50,
    type: TransactionType.INCOME,
    description: 'Descrição',
    categories: Categories.HOME,
  } as Transaction;

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        RegisterTransactionUseCase,
        {
          provide: ITransactionRepository,
          useValue: {
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

    transactionRepository = testModule.get<ITransactionRepository>(
      ITransactionRepository,
    );
    walletRepository = testModule.get<IWalletRepository>(IWalletRepository);
    registerTransactionMock = testModule.get<RegisterTransactionUseCase>(
      RegisterTransactionUseCase,
    );
    deleteTransactionMock = testModule.get<DeleteTransactionUseCase>(
      DeleteTransactionUseCase,
    );

    app = testModule.createNestApplication();
    await app.init();
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
});
