import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { IUserRepository } from '@/user/interfaces';

describe('User controller E2E', () => {
  let app: INestApplication;
  let userId: string;
  let nonexistentUserId: string;
  let usersRepository: IUserRepository;

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

    usersRepository = module.get<IUserRepository>(IUserRepository);

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
      const response = await request(app.getHttpServer())
        .get(`/user/${userId}`)
        .expect(HttpStatus.OK);

      const userResult = await usersRepository.findById(userId);

      expect(response.body).toMatchObject({
        email: userResult.email,
        id: userResult.id,
        name: userResult.name,
      });
    });

    it('should be able to return 404 for a nonexistent user', async () => {
      await request(app.getHttpServer())
        .get(`/user/${nonexistentUserId}`)

        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
