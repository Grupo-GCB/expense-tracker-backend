import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { IUserRepository } from '@/user/interfaces';
import { User } from '@/user/infra/entities';
import { ListUserByIdUseCase } from '@/user/use-cases';

describe('User controller E2E', () => {
  let app: INestApplication;
  let userId: string;
  let nonexistentUserId: string;
  let listUserByIdUseCase: ListUserByIdUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: IUserRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    listUserByIdUseCase = module.get<ListUserByIdUseCase>(ListUserByIdUseCase);

    userId = 'google-oauth2|107188552739080068634';
    nonexistentUserId = 'google-oauth2|456354566205483104315';

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/user/:id (GET)', () => {
    it('should be able to return an existing user', async () => {
      const userResult = {
        user: {
          email: 'anyEmail',
          id: 'anyId',
          name: 'anyName',
        } as User,
      };

      jest
        .spyOn(listUserByIdUseCase, 'execute')
        .mockResolvedValueOnce(userResult);

      const response = await request(app.getHttpServer())
        .get(`/user/${userId}`)
        .expect(HttpStatus.OK);
      console.log(userResult);

      expect(response.body).toMatchObject({
        email: userResult.user.email,
        id: userResult.user.id,
        name: userResult.user.name,
      });
    });

    it('should be able to return 404 for a nonexistent user', async () => {
      await request(app.getHttpServer())
        .get(`/user/${nonexistentUserId}`)

        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
