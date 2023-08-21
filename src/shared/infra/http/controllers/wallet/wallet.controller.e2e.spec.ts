import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { UpdateWalletDTO } from '@/wallet/dto';
import { AccountType } from '@/shared/constants/enums';
import { IWalletRepository } from '@/wallet/interfaces';

describe('Wallet Controller E2E', () => {
  let app: INestApplication;
  let walletRepository: IWalletRepository;
  let updateWalletMock: jest.SpyInstance;
  let deleteWalletMock: jest.SpyInstance;
  let findByIdMock: jest.SpyInstance;

  const updatedWalletData: UpdateWalletDTO = {
    id: '6c1839fc-a36e-4f5f-8a62-afdf164d9b57',
    bank_id: 'd344a168-60ad-48fc-9d57-64b412e4f6d4',
    account_type: AccountType.CASH,
    description: 'Nova descrição',
  };

  const validWalletId = '6c1839fc-a36e-4f5f-8a62-afdf164d9b57';
  const invalidWalletId = 'invalid-id';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(IWalletRepository)
      .useValue({
        update: jest.fn(),
        findById: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    app = module.createNestApplication();
    walletRepository = module.get<IWalletRepository>(IWalletRepository);

    updateWalletMock = jest.spyOn(walletRepository, 'update');
    findByIdMock = jest.spyOn(walletRepository, 'findById');
    deleteWalletMock = jest.spyOn(walletRepository, 'delete');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(updateWalletMock).toBeDefined();
    expect(findByIdMock).toBeDefined();
    expect(deleteWalletMock).toBeDefined();
  });

  describe('/wallet/update (PUT)', () => {
    it('should be able to update a wallet', async () => {
      updateWalletMock.mockResolvedValue(updatedWalletData);
      findByIdMock.mockResolvedValue(updatedWalletData);

      const response = await request(app.getHttpServer())
        .put('/wallet/update')
        .send(updatedWalletData)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(updatedWalletData);
    });

    it('should not be able to update a wallet if bank does not exist', async () => {
      updateWalletMock.mockRejectedValue(new NotFoundException());

      const dtoWithNonExistingBank: UpdateWalletDTO = {
        ...updatedWalletData,
        bank_id: 'd534a168-60ad-48fc-9d57-64b412e4f6d5',
      };

      await request(app.getHttpServer())
        .put('/wallet/update')
        .send(dtoWithNonExistingBank)
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
  });

  describe('/wallet/:id (DELETE)', () => {
    it('should be able to delete a wallet', async () => {
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
});
