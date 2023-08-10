import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { IBankRepository } from '@/bank/interfaces';
import { FindAllBanksUseCase, FindBankByIdUseCase } from '@/bank/use-cases';
import { Bank } from '@/bank/infra/entities';

describe('Bank controller E2E', () => {
  let app: INestApplication;
  let bankId: string;
  let nonExistentBankId: string;
  let findBankByIdUseCase: FindBankByIdUseCase;
  let findAllUseCase: FindAllBanksUseCase;
  let testModule: TestingModule;

  const mockBank: Bank = {
    id: 'bank-01',
    name: 'anyBank',
    logo_url: 'anyURL',
  } as Bank;

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: IBankRepository,
          useValue: {
            findById: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    findBankByIdUseCase =
      testModule.get<FindBankByIdUseCase>(FindBankByIdUseCase);
    findAllUseCase = testModule.get<FindAllBanksUseCase>(FindAllBanksUseCase);

    bankId = '87b2a64b-2651-422a-8659-c85fedafdc78';
    nonExistentBankId = 'f632a171-e958-4006-98cc-052cfedb82b5';

    app = testModule.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/bank/all (GET)', () => {
    it('should be able to return a list with banks', async () => {
      const banks = [mockBank, mockBank];
      jest.spyOn(findAllUseCase, 'execute').mockResolvedValue({ banks });

      const response = await request(app.getHttpServer())
        .get('/bank/all')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(banks);
    });

    it('should be able to return an empty list', async () => {
      jest.spyOn(findAllUseCase, 'execute').mockResolvedValue({ banks: [] });

      const response = await request(app.getHttpServer())
        .get(`/bank/all`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual([]);
    });
  });

  describe('/bank/:id (GET)', () => {
    it('should be able to return data from a database when id exists in the database', async () => {
      const bankResponse = { bank: mockBank };
      jest
        .spyOn(findBankByIdUseCase, 'execute')
        .mockResolvedValueOnce(bankResponse);

      const response = await request(app.getHttpServer())
        .get(`/bank/${bankId}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: mockBank.id,
        name: mockBank.name,
        logo_url: mockBank.logo_url,
      });
    });

    it('should be able to return 404 for a nonexistent bank', async () => {
      await request(app.getHttpServer())
        .get(`/bank/${nonExistentBankId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
