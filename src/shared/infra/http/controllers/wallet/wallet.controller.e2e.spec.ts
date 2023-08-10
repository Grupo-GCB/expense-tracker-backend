import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { SaveWalletDTO } from '@/wallet/dto';
import { IWalletRepository } from '@/wallet/interfaces';
import { AccountType } from '@/shared/constants/enums';

describe('Wallet Controller E2E', () => {
  let app: INestApplication;
  let walletRepository: IWalletRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const validSaveWalletDTO: SaveWalletDTO = {
    user_id: 'auth0|58vfb567d5asdea52bc65ebba',
    bank_id: 'd344a168-60ad-48fc-9d57-64b412e4f6d4',
    account_type: AccountType.CHECKING_ACCOUNT,
    description: 'Wallet description',
  };

  it('should create a wallet', async () => {
    const response = await request(app.getHttpServer())
      .post('/wallet')
      .send(validSaveWalletDTO)
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('id');
    expect(response.body.account_type).toBe(AccountType.CHECKING_ACCOUNT);
    expect(response.body.description).toBe('Descrição da carteira');
  });

  it('should not be able to register a wallet if bankreturn 404 if bank does not exist', async () => {
    const dtoWithNonExistingBank: SaveWalletDTO = {
      ...validSaveWalletDTO,
      bank_id: 'd344a168-60ad-48fc-9d57-64b412e4f6d5',
    };

    await request(app.getHttpServer())
      .post('/wallet')
      .send(dtoWithNonExistingBank)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('should not be able to register a wallet if user does not exist', async () => {
    const dtoWithNonExistingUser: SaveWalletDTO = {
      ...validSaveWalletDTO,
      user_id: 'non_existing_user_id',
    };

    await request(app.getHttpServer())
      .post('/wallet')
      .send(dtoWithNonExistingUser)
      .expect(HttpStatus.NOT_FOUND);
  });
});
