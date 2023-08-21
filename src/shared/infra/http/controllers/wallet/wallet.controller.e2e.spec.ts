import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpStatus,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import * as request from 'supertest';

import {
  FindAllWalletsByUserIdUseCase,
  FindWalletByIdUseCase,
} from '@/wallet/use-cases';
import { UpdateWalletDTO, SaveWalletDTO } from '@/wallet/dto';
import { AppModule } from '@/app.module';
import { IWalletRepository } from '@/wallet/interfaces';
import { AccountType } from '@/shared/constants/enums';
import { Wallet } from '@/wallet/infra/entities';

describe('Wallet Controller (E2E)', () => {
  let app: INestApplication;
  let testModule: TestingModule;
  let validWalletId: string;
  let invalidWalletId: string;
  let findAllMock: jest.SpyInstance;
  let findByIdMock: jest.SpyInstance;
  let walletRepository: IWalletRepository;
  let updateWalletMock: jest.SpyInstance;
  let createWalletMock: jest.SpyInstance;

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: IWalletRepository,
          useValue: {
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

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

    walletRepository = testModule.get<IWalletRepository>(IWalletRepository);
    findByIdMock = jest.spyOn(walletRepository, 'findById');
    updateWalletMock = jest.spyOn(walletRepository, 'update');
    createWalletMock = jest.spyOn(walletRepository, 'create');

    app = testModule.createNestApplication();
    await app.init();

    validWalletId = 'existent-wallet-id';
    invalidWalletId = '0a26e4a5-5d1b-4fba-a554-8ef49b76aafb';
  });

  const updatedWalletData: UpdateWalletDTO = {
    id: '2a7fa85a-d5d8-4757-aff6-c0faf61639ec',
    bank_id: 'd344a168-60ad-48fc-9d57-64b412e4f6d4',
    account_type: AccountType.CASH,
    description: 'Nova descrição',
  };

  const validUserId = 'auth0|user-id';

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

  describe('/update (PUT)', () => {
    it('should be defined', () => {
      expect(updateWalletMock).toBeDefined();
      expect(findByIdMock).toBeDefined();
    });

    it('should be able to update a wallet', async () => {
      findByIdMock.mockResolvedValue(updatedWalletData);
      updateWalletMock.mockResolvedValue(updatedWalletData);

      const response = await request(app.getHttpServer())
        .put('/update')
        .send(updatedWalletData)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(updatedWalletData);
    });

    it('should not be able to update a wallet if bank does not exist', async () => {
      updateWalletMock.mockRejectedValue(new NotFoundException());

      const nonExistingBank: UpdateWalletDTO = {
        ...updatedWalletData,
        bank_id: 'd534a168-60ad-48fc-9d57-64b412e4f6d5',
      };

      await request(app.getHttpServer())
        .put('/update')
        .send(nonExistingBank)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should not be able to update a wallet if wallet does not exist', async () => {
      updateWalletMock.mockRejectedValue(new NotFoundException());

      const dtoWithNonExistingWallet: UpdateWalletDTO = {
        ...updatedWalletData,
        id: 'd534a168-60ad-48fc-9d57-64b412e4f6d5',
      };

      await request(app.getHttpServer())
        .put('/wallet/update')
        .send(dtoWithNonExistingWallet)
        .expect(HttpStatus.NOT_FOUND);
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
          .get(`/wallets/${validUserId}`)
          .expect(HttpStatus.OK);

        expect(response.body).toEqual(walletsSerialized);
      });

      it('should be able to return an empty wallet list', async () => {
        findAllMock.mockResolvedValue({ wallets: [] });

        const response = await request(app.getHttpServer())
          .get(`/wallets/${validUserId}`)
          .expect(HttpStatus.OK);

        expect(response.body).toEqual([]);
      });
    });

    describe('/wallet/:id (GET)', () => {
      it('should be able to return wallet data when wallet id exists', async () => {
        const walletReponse = { wallet: mockWallet };

        findByIdMock.mockResolvedValueOnce(walletReponse);

        const response = await request(app.getHttpServer())
          .get(`/wallet/${validWalletId}`)
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
          .get(`/wallet/${invalidWalletId}`)
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
