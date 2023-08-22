import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpStatus,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import * as request from 'supertest';

import { UpdateWalletDTO, SaveWalletDTO } from '@/wallet/dto';
import { AppModule } from '@/app.module';
import { IWalletRepository } from '@/wallet/interfaces';
import { AccountType } from '@/shared/constants/enums';
import { Wallet } from '@/wallet/infra/entities';

describe('Wallet Controller (E2E)', () => {
  let app: INestApplication;
  let testModule: TestingModule;
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
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    walletRepository = testModule.get<IWalletRepository>(IWalletRepository);
    findByIdMock = jest.spyOn(walletRepository, 'findById');
    findAllMock = jest.spyOn(walletRepository, 'findAllByUserId');
    updateWalletMock = jest.spyOn(walletRepository, 'update');
    createWalletMock = jest.spyOn(walletRepository, 'create');
    app = testModule.createNestApplication();
    await app.init();
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

  const validWalletId = '2a7fa85a-d5d8-4757-aff6-c0faf61649ec';
  const invalidWalletId = '0a26e4a5-5d1b-4fba-a554-8ef49b76aafb';

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

  describe('/wallet/id: (PUT)', () => {
    it('should be defined', () => {
      expect(updateWalletMock).toBeDefined();
      expect(findByIdMock).toBeDefined();
    });

    it('should be able to update a wallet', async () => {
      findByIdMock.mockResolvedValue(updatedWalletData);
      updateWalletMock.mockResolvedValue(updatedWalletData);

      const response = await request(app.getHttpServer())
        .put('/wallet/:id')
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
        .put('/wallet/:id')
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

    describe('/wallet/all/:id (GET)', () => {
      it('should be able to return a list with all wallets', async () => {
        const wallets = [mockWallet, mockWallet];

        const walletsSerialized = wallets.map((wallet) => ({
          ...wallet,
          created_at: wallet.created_at.toISOString(),
          updated_at: wallet.updated_at.toISOString(),
        }));

        findAllMock.mockResolvedValue({ wallets });

        const response = await request(app.getHttpServer())
          .get(`/wallet/all/${validUserId}`)
          .expect(HttpStatus.OK);

        expect(response.body).toEqual({ wallets: walletsSerialized });
      });

      it('should be able to return an empty wallet list', async () => {
        findAllMock.mockResolvedValue({ wallets: [] });

        const response = await request(app.getHttpServer())
          .get(`/wallet/all/${validUserId}`)
          .expect(HttpStatus.OK);

        expect(response.body).toEqual({ wallets: [] });
      });
    });

    describe('/wallet/:id (GET)', () => {
      it('should be able to return wallet data when wallet id exists', async () => {
        const walletResponse = { wallet: mockWallet };

        findByIdMock.mockResolvedValueOnce(walletResponse);

        const response = await request(app.getHttpServer())
          .get(`/wallet/${validWalletId}`)
          .expect(HttpStatus.OK);

        const expectedWallet = {
          ...mockWallet,
          created_at: mockWallet.created_at.toISOString(),
          updated_at: mockWallet.updated_at.toISOString(),
        };

        expect(response.body.wallet).toMatchObject(expectedWallet);
      });

      it('should be able to return 404 if wallet does not exists', async () => {
        findByIdMock.mockRejectedValue(new NotFoundException());

        await request(app.getHttpServer())
          .get(`/wallets/${invalidWalletId}`)
          .expect(HttpStatus.NOT_FOUND);
      });
    });
  });

  describe('/wallet/:id (DELETE)', () => {
    it('should be able to delete a wallet', async () => {
      findByIdMock.mockResolvedValue({});

      await request(app.getHttpServer())
        .delete(`/wallet/${validWalletId}`)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should not be able to delete a wallet if wallet does not exist', async () => {
      findByIdMock.mockRejectedValue(new NotFoundException());

      await request(app.getHttpServer())
        .delete(`/wallets/${invalidWalletId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
