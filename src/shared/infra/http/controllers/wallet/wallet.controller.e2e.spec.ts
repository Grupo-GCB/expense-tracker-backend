import {
  HttpStatus,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { SaveWalletDTO } from '@/wallet/dto';
import { AccountType } from '@/shared/constants/enums';
import { IWalletRepository } from '@/wallet/interfaces';
import { FindAllWalletsByUserIdUseCase } from '@/wallet/use-cases';
import { Wallet } from '@/wallet/infra/entities';

describe('Wallet Controller E2E', () => {
  let app: INestApplication;
  let walletRepository: IWalletRepository;
  let createWalletMock: jest.SpyInstance;
  let findAllWalletsByUserIdUseCase: FindAllWalletsByUserIdUseCase;

  const walletData: SaveWalletDTO = {
    user_id: 'auth0|58vfb567d5asdea52bc65ebba',
    bank_id: 'd344a168-60ad-48fc-9d57-64b412e4f6d4',
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Descrição da carteira',
  };

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
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(IWalletRepository)
      .useValue({
        create: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
      })
      .compile();

    app = module.createNestApplication();
    walletRepository = module.get<IWalletRepository>(IWalletRepository);
    findAllWalletsByUserIdUseCase = module.get<FindAllWalletsByUserIdUseCase>(
      FindAllWalletsByUserIdUseCase,
    );

    createWalletMock = jest.spyOn(walletRepository, 'create');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/wallet (POST)', () => {
    it('should be defined', () => {
      expect(walletRepository).toBeDefined();
      expect(createWalletMock).toBeDefined();
    });

    it('should create a wallet', async () => {
      createWalletMock.mockResolvedValue(walletData);

      const response = await request(app.getHttpServer())
        .post('/wallet')
        .send(walletData)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual(
        expect.objectContaining({
          user_id: expect.any(String),
          bank_id: expect.any(String),
        }),
      );
      expect(response.body.account_type).toBe(AccountType.CHECKING_ACCOUNT);
      expect(response.body.description).toBe('Descrição da carteira');
    });

    it('should not be able to register a wallet if user does not exist', async () => {
      createWalletMock.mockRejectedValue(new NotFoundException());

      const dtoWithNonExistingUser: SaveWalletDTO = {
        ...walletData,
        user_id: 'non_existing_user_id',
      };

      await request(app.getHttpServer())
        .post('/wallet')
        .send(dtoWithNonExistingUser)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should not be able to register a wallet if bank does not exist', async () => {
      createWalletMock.mockRejectedValue(new NotFoundException());

      const dtoWithNonExistingBank: SaveWalletDTO = {
        ...walletData,
        bank_id: 'd344a168-60ad-48fc-9d57-64b412e4f6d5',
      };

      await request(app.getHttpServer())
        .post('/wallet')
        .send(dtoWithNonExistingBank)
        .expect(HttpStatus.NOT_FOUND);
    });
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
