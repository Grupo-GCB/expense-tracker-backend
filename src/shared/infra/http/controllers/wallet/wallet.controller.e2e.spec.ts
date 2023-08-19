import {
  HttpStatus,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AccountType } from '@/shared/constants';
import { Wallet } from '@/wallet/infra/entities';
import { AppModule } from '@/app.module';
import { IWalletRepository } from '@/wallet/interfaces';
import {
  FindAllWalletsByUserIdUseCase,
  FindWalletByIdUseCase,
} from '@/wallet/use-cases';

describe('Wallet Controller (E2E)', () => {
  let app: INestApplication;
  let testModule: TestingModule;
  let walletId: string;
  let nonExistentWalletId: string;
  let findAllMock: jest.SpyInstance;
  let findByIdMock: jest.SpyInstance;

  const mockWallet: Wallet = {
    id: 'existent-wallet-id',
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Descrição da carteira.',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    bank: null,
    user: null,
    transactions: null,
  };

  const user_id = 'auth0|user-id';

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: IWalletRepository,
          useValue: {
            findById: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    walletId = 'existent-wallet-id';
    nonExistentWalletId = '0a26e4a5-5d1b-4fba-a554-8ef49b76aafb';

    findAllMock = jest.spyOn(
      testModule.get<FindAllWalletsByUserIdUseCase>(
        FindAllWalletsByUserIdUseCase,
      ),
      'execute',
    );
    findByIdMock = jest.spyOn(
      testModule.get<FindWalletByIdUseCase>(FindWalletByIdUseCase),
      'execute',
    );

    app = testModule.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/wallets/:id (GET)', () => {
    it('should be able to return a list with all wallets', async () => {
      const wallets = [mockWallet, mockWallet];

      const walletsSerialized = wallets.map((wallet) => ({
        ...wallet,
        created_at: wallet.created_at.toISOString(),
        updated_at: wallet.updated_at.toISOString(),
      }));

      findAllMock.mockResolvedValue({ wallets });

      const response = await request(app.getHttpServer())
        .get(`/wallets/${user_id}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(walletsSerialized);
    });

    it('should be able to return an empty wallet list', async () => {
      findAllMock.mockResolvedValue({ wallets: [] });

      const response = await request(app.getHttpServer())
        .get(`/wallets/${user_id}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual([]);
    });
  });

  describe('/wallet/:id (GET)', () => {
    it('should be able to return wallet data when wallet id exists', async () => {
      const walletReponse = { wallet: mockWallet };

      findByIdMock.mockResolvedValueOnce(walletReponse);

      const response = await request(app.getHttpServer())
        .get(`/wallet/${walletId}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: mockWallet.id,
        account_type: mockWallet.account_type,
        description: mockWallet.description,
        deleted_at: mockWallet.deleted_at,
        bank: mockWallet.bank,
        user: mockWallet.user,
        transactions: mockWallet.transactions,
      });
    });

    it('should be able to return 404 if wallet does not exists', async () => {
      findByIdMock.mockRejectedValue(new NotFoundException());

      await request(app.getHttpServer())
        .get(`/wallet/${nonExistentWalletId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
