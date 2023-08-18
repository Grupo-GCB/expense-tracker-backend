import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AccountType } from '@/shared/constants';
import { Wallet } from '@/wallet/infra/entities';
import { AppModule } from '@/app.module';
import { IWalletRepository } from '@/wallet/interfaces';
import { FindAllWalletsByUserIdUseCase } from '@/wallet/use-cases';

describe('Wallet Controller (E2E)', () => {
  let app: INestApplication;
  let findAllWalletsByUserIdUseCase: FindAllWalletsByUserIdUseCase;
  let testModule: TestingModule;

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

    app = testModule.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/wallets/:id (GET)', () => {
    it('should be able to return a list with all wallets by user id', async () => {
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
});
