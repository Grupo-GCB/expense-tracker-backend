import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { IBankRepository } from '@/bank/interfaces';
import { FindBankByIdUseCase } from '@/bank/use-cases';
import { Bank } from '@/bank/infra/entities';

describe('Bank controller E2E', () => {
  let app: INestApplication;
  let bankId: string;
  let nonExistentBankId: string;
  let findBankByIdUseCase: FindBankByIdUseCase;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: IBankRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    findBankByIdUseCase = module.get<FindBankByIdUseCase>(FindBankByIdUseCase);

    bankId = '87b2a64b-2651-422a-8659-c85fedafdc78';
    nonExistentBankId = 'f632a171-e958-4006-98cc-052cfedb82b5';

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/bank/:id (GET)', () => {
    it.skip('should be able to return an existing bank', async () => {
      const bank = {
        bank: {
          id: bankId,
          name: 'anyBank',
          logo_url: 'anyURL',
        } as Bank,
      };

      jest.spyOn(findBankByIdUseCase, 'execute').mockResolvedValueOnce(bank);

      const response = await request(app.getHttpServer())
        .get(`/bank/${bankId}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: bank.bank.id,
        name: bank.bank.name,
        logo_url: bank.bank.logo_url,
      });
    });

    it('should be able to return 404 for a nonexistent bank', async () => {
      await request(app.getHttpServer())
        .get(`/bank/${nonExistentBankId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
