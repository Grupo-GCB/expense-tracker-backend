import { HttpStatus, INestApplication } from '@nestjs/common';
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
  let findAllWalletsByUserIdUseCase: FindAllWalletsByUserIdUseCase;
  let findWalletByIdUseCase: FindWalletByIdUseCase;
  let testModule: TestingModule;
  let walletId: string;
  let nonExistentWalletId: string;

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

    findAllWalletsByUserIdUseCase =
      testModule.get<FindAllWalletsByUserIdUseCase>(
        FindAllWalletsByUserIdUseCase,
      );
    findWalletByIdUseCase = testModule.get<FindWalletByIdUseCase>(
      FindWalletByIdUseCase,
    );

    walletId = 'existent-wallet-id';
    nonExistentWalletId = '0a26e4a5-5d1b-4fba-a554-8ef49b76aafb';

    app = testModule.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/wallet/all (GET)', () => {
    it('should be able to return a list with all wallets', async () => {
      const wallets = [mockWallet, mockWallet];

      const walletsSerialized = wallets.map((wallet) => ({
        ...wallet,
        created_at: wallet.created_at.toISOString(),
        updated_at: wallet.updated_at.toISOString(),
      }));

      jest
        .spyOn(findAllWalletsByUserIdUseCase, 'execute')
        .mockResolvedValue({ wallets });

      const response = await request(app.getHttpServer())
        .get(`/wallets/${user_id}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(walletsSerialized);
    });

    it('should be able to return an empty wallet list', async () => {
      jest
        .spyOn(findAllWalletsByUserIdUseCase, 'execute')
        .mockResolvedValue({ wallets: [] });

      const response = await request(app.getHttpServer())
        .get(`/wallets/${user_id}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual([]);
    });
  });

  describe('/wallet/:id (GET)', () => {
    it('should be able to return wallet data when wallet id exists', async () => {
      const walletReponse = { wallet: mockWallet };
      jest
        .spyOn(findWalletByIdUseCase, 'execute')
        .mockResolvedValueOnce(walletReponse);

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
      await request(app.getHttpServer())
        .get(`/wallet/${nonExistentWalletId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
