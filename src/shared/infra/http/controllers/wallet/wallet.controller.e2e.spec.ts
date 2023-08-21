import {
  HttpStatus,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
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
  let walletId: string;
  let nonExistentWalletId: string;
  let findAllMock: jest.SpyInstance;
  let findByIdMock: jest.SpyInstance;
  let walletRepository: IWalletRepository;
  let createWalletMock: jest.SpyInstance;
  let updateWalletMock: jest.SpyInstance;

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

  const updatedWalletData: UpdateWalletDTO = {
    id: '6c1839fc-a36e-4f5f-8a62-afdf164d9b57',
    bank_id: 'd344a168-60ad-48fc-9d57-64b412e4f6d4',
    account_type: AccountType.CASH,
    description: 'Nova descrição',
  };

  const walletData: SaveWalletDTO = {
    user_id: 'auth0|58vfb567d5asdea52bc65ebba',
    bank_id: 'd344a168-60ad-48fc-9d57-64b412e4f6d4',
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Descrição da carteira',
  };

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

    walletRepository = testModule.get<IWalletRepository>(IWalletRepository);
    findByIdMock = jest.spyOn(walletRepository, 'findById');
    updateWalletMock = jest.spyOn(walletRepository, 'update');
    createWalletMock = jest.spyOn(walletRepository, 'create');

    app = testModule.createNestApplication();
    await app.init();
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

  describe('/wallet/update (PUT)', () => {
    it('should be defined', () => {
      expect(updateWalletMock).toBeDefined();
      expect(findByIdMock).toBeDefined();
    });

    it('should be able to update a wallet', async () => {
      findByIdMock.mockResolvedValue(updatedWalletData);
      updateWalletMock.mockResolvedValue(updatedWalletData);

      const response = await request(app.getHttpServer())
        .put('/wallet/update')
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
        .put('/wallet/update')
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

    afterAll(async () => {
      await app.close();
    });
  });
});
