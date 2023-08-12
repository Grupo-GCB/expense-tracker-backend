import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AccountType } from '@/shared/constants';
import { Wallet } from '@/wallet/infra/entities';
import { AppModule } from '@/app.module';
import { IWalletRepository } from '@/wallet/interfaces';
import { FindAllWalletsUseCase } from '@/wallet/use-cases';

describe('Wallet Controller E2E', () => {
  let app: INestApplication;
  let findAllWalletsUseCase: FindAllWalletsUseCase;
  let testModule: TestingModule;

  const mockWallet: Wallet = {
    id: '01',
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'First Wallet Description.',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    bank: null,
    user: null,
    transactions: null,
  } as Wallet;

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

    findAllWalletsUseCase = testModule.get<FindAllWalletsUseCase>(
      FindAllWalletsUseCase,
    );

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
        .spyOn(findAllWalletsUseCase, 'execute')
        .mockResolvedValue({ wallets });

      const response = await request(app.getHttpServer())
        .get('/wallet/all')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(walletsSerialized);
    });

    it('should be able to return an empty wallet list', async () => {
      jest
        .spyOn(findAllWalletsUseCase, 'execute')
        .mockResolvedValue({ wallets: [] });

      const response = await request(app.getHttpServer())
        .get('/wallet/all')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual([]);
    });
  });
});
