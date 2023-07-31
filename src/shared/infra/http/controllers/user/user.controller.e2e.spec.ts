import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '@/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userId: string;
  let nonExistentUserId: string;

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

  beforeEach(() => {
    userId = 'af4202bb-a175-49f0-95c0-e5e41537f548';
    nonExistentUserId = 'af4202bb-a175-49f0-95c0-e5e41537f544';
  });

  it('/user/:id (GET) - should return an existing user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/user/${userId}`)
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('email');
  });

  it('/user/:id (GET) - should return 404 for a non-existent user', async () => {
    await request(app.getHttpServer())
      .get(`/user/${nonExistentUserId}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
