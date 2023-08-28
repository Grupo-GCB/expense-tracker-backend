import {
  HttpStatus,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { IBankRepository } from '@/bank/interfaces';
import { AccountType } from '@/shared/constants/enums';
import { IUserRepository } from '@/user/interfaces';
import { SaveWalletDTO, UpdateWalletDTO } from '@/wallet/dto';
import { Wallet } from '@/wallet/infra/entities';
import { IWalletRepository } from '@/wallet/interfaces';
import { User } from '@/user/infra/entities';
import { Bank } from '@/bank/infra/entities';
import {
  DeleteWalletUseCase,
  FindAllWalletsByUserIdUseCase,
  FindWalletByIdUseCase,
  RegisterWalletUseCase,
  UpdateWalletUseCase,
} from '@/wallet/use-cases';

describe('Wallet Controller (E2E)', () => {
  let app: INestApplication;
  let testModule: TestingModule;
  let findAllMock: jest.SpyInstance;
  let findAll: FindAllWalletsByUserIdUseCase;
  let findByIdMock: jest.SpyInstance;
  let walletRepository: IWalletRepository;
  let registerWallet: RegisterWalletUseCase;
  let deleteWallet: DeleteWalletUseCase;
  let findById: FindWalletByIdUseCase;
  let userRepository: IUserRepository;
  let bankRepository: IBankRepository;
  let updateWalletMock: UpdateWalletUseCase;

  const mockUpdateWalletData: UpdateWalletDTO = {
    bank_id: 'd344a168-60ad-48fc-9d57-64b412e4f6d4',
    account_type: AccountType.CASH,
    description: 'Nova descrição',
  };

  const updatedWallet = {
    id: 'valid-id',
    account_type: AccountType.CASH,
    description: 'Nova descrição',
  } as Wallet;

  const validUserId = 'auth0|user-id';

  const walletData: SaveWalletDTO = {
    user_id: 'auth0|58vfb567d5asdea52bc65ebba',
    bank_id: 'd344a168-60ad-48fc-9d57-64b412e4f6d4',
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Descrição da carteira',
  };

  const mockWallet = {
    id: 'existent-wallet-id',
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Descrição da carteira',
  } as Wallet;

  const mockUser = {
    id: 'valid-id',
  } as User;

  const mockBank = {
    id: 'valid-id',
  } as Bank;

  const validWalletId = '2a7fa85a-d5d8-4757-aff6-c0faf61649ec';
  const invalidWalletId = '0a26e4a5-5d1b-4fba-a554-8ef49b76aafb';
  const invalidBankId = '7a56e4a5-5d1b-4fba-a554-8ef49b76aafb';

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
        {
          provide: IUserRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: IBankRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockBank),
          },
        },
      ],
    }).compile();

    walletRepository = testModule.get<IWalletRepository>(IWalletRepository);
    userRepository = testModule.get<IUserRepository>(IUserRepository);
    bankRepository = testModule.get<IBankRepository>(IBankRepository);
    registerWallet = testModule.get<RegisterWalletUseCase>(
      RegisterWalletUseCase,
    );
    updateWalletMock = testModule.get<UpdateWalletUseCase>(UpdateWalletUseCase);
    findById = testModule.get<FindWalletByIdUseCase>(FindWalletByIdUseCase);
    findAll = testModule.get<FindAllWalletsByUserIdUseCase>(
      FindAllWalletsByUserIdUseCase,
    );
    deleteWallet = testModule.get<DeleteWalletUseCase>(DeleteWalletUseCase);
    findByIdMock = jest.spyOn(walletRepository, 'findById');
    findAllMock = jest.spyOn(walletRepository, 'findAllByUserId');
    app = testModule.createNestApplication();
    await app.init();
  });

  describe('/wallet (POST)', () => {
    it('should be defined', () => {
      expect(walletRepository).toBeDefined();
    });

    it('should create a wallet', async () => {
      jest
        .spyOn(registerWallet, 'createWallet')
        .mockResolvedValueOnce(mockWallet);

      const response = await request(app.getHttpServer())
        .post('/wallet')
        .send(walletData)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual(
        expect.objectContaining({
          account_type: 'Conta-Corrente',
          description: 'Descrição da carteira',
          id: 'existent-wallet-id',
        }),
      );
      expect(response.body.account_type).toBe(AccountType.CHECKING_ACCOUNT);
    });

    it('should not be able to register a wallet if user does not exist', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(null);

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
      jest.spyOn(bankRepository, 'findById').mockResolvedValueOnce(null);

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
      findByIdMock.mockResolvedValue(updatedWallet);
      jest
        .spyOn(updateWalletMock, 'execute')
        .mockResolvedValueOnce(updatedWallet);

      const response = await request(app.getHttpServer())
        .put(`/wallet/${validWalletId}`)
        .send(mockUpdateWalletData)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(updatedWallet);
    });

    it('should not be able to update a wallet if bank does not exist', async () => {
      jest.spyOn(walletRepository, 'update').mockResolvedValueOnce(null);

      const nonExistingBank: UpdateWalletDTO = {
        ...mockUpdateWalletData,
        bank_id: invalidBankId,
      };

      await request(app.getHttpServer())
        .put(`/wallet/${validWalletId}`)
        .send(nonExistingBank)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should not be able to update a wallet if wallet does not exist', async () => {
      jest.spyOn(walletRepository, 'update').mockResolvedValueOnce(null);

      await request(app.getHttpServer())
        .put(`/wallet/${invalidWalletId}`)
        .send(mockUpdateWalletData)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/wallet/:id (DELETE)', () => {
    it('should be able to delete a wallet', async () => {
      jest.spyOn(deleteWallet, 'execute').mockResolvedValueOnce();

      await request(app.getHttpServer())
        .delete(`/wallet/${validWalletId}`)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should not be able to delete a wallet if wallet does not exist', async () => {
      await request(app.getHttpServer())
        .delete(`/wallets/${invalidWalletId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/wallet/:id (GET)', () => {
    it('should be able to return wallet data when wallet id exists', async () => {
      const walletResponse = { wallet: mockWallet };
      jest.spyOn(findById, 'execute').mockResolvedValueOnce(walletResponse);

      await request(app.getHttpServer())
        .get(`/wallet/${validWalletId}`)
        .expect(HttpStatus.OK);
    });

    it('should be able to return 404 if wallet does not exists', async () => {
      findByIdMock.mockRejectedValue(new NotFoundException());

      await request(app.getHttpServer())
        .get(`/wallet/${invalidWalletId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('/wallet/all/:id (GET)', () => {
    it('should be able to return a list with all wallets', async () => {
      const wallets = [mockWallet, mockWallet];
      jest
        .spyOn(findAll, 'execute')
        .mockResolvedValueOnce({ wallets: wallets });

      const response = await request(app.getHttpServer())
        .get(`/wallet/all/${validUserId}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(wallets);
    });

    it('should be able to return an empty wallet list', async () => {
      findAllMock.mockResolvedValue({ wallets: [] });

      const response = await request(app.getHttpServer())
        .get(`/wallet/all/${validUserId}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual([]);
    });
  });
});
