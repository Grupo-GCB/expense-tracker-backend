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
import { RegisterTransactionUseCase } from '@/transaction/use-cases';
import { Wallet } from '@/wallet/infra/entities';
import { IWalletRepository } from '@/wallet/interfaces';

describe('Transaction Controller (E2E)', () => {
  let app: INestApplication;
  let testModule: TestingModule;
  let walletRepository: IWalletRepository;
  let transactionRepository: ITransactionRepository;
  let registerTransactionMock: RegisterTransactionUseCase;

  const transactionValidId = '407ae2db-4abc-461d-a368-6c0a9713bac5';
  const transactionInvalidId = 'inalid-id';

  const mockWallet = {
    id: transactionValidId,
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
        .post(`/transaction/${transactionValidId}`)
        .send(transactionDataParams)
        .expect(HttpStatus.CREATED);
    });

    it('should not be able to register transaction if wallet does not exist', async () => {
      jest.spyOn(walletRepository, 'findById').mockResolvedValueOnce(null);
      jest
        .spyOn(transactionRepository, 'create')
        .mockRejectedValueOnce(new NotFoundException());

      await request(app.getHttpServer())
        .post(`/transaction/${transactionInvalidId}`)
        .send(transactionDataParams)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
