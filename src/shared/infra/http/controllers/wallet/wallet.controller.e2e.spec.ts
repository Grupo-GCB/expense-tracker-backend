import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { SaveWalletDTO } from '@/wallet/dto';
import { AccountType } from '@/shared/constants/enums';
import { IWalletRepository } from '@/wallet/interfaces';

describe('Wallet Controller E2E', () => {
  let app: INestApplication;
  let walletRepository: IWalletRepository;
  let createWalletMock: jest.SpyInstance;

  const walletData: SaveWalletDTO = {
    user_id: 'auth0|58vfb567d5asdea52bc65ebba',
    bank_id: 'd344a168-60ad-48fc-9d57-64b412e4f6d4',
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Descrição da carteira',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(IWalletRepository)
      .useValue({
        create: jest.fn(),
      })
      .compile();

    app = module.createNestApplication();
    walletRepository = module.get<IWalletRepository>(IWalletRepository);

    createWalletMock = jest.spyOn(walletRepository, 'create');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/wallet (POST)', () => {
    it('should create a wallet', async () => {
      createWalletMock.mockResolvedValue(walletData);

      const response = await request(app.getHttpServer())
        .post('/wallet')
        .send(walletData)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('user_id');
      expect(response.body).toHaveProperty('bank_id');
      expect(response.body.account_type).toBe(AccountType.CHECKING_ACCOUNT);
      expect(response.body.description).toBe('Descrição da carteira');
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

    it('should be defined', () => {
      expect(walletRepository).toBeDefined();
      expect(createWalletMock).toBeDefined();
    });
  });
});
