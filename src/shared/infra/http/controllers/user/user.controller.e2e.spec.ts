import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';

describe('User controller E2E', () => {
  let app: INestApplication;
  let userId: string;
  let nonexistentUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userId = 'google-oauth2|456734566205483104315';
    nonexistentUserId = 'google-oauth2|456354566205483104315';

    app = moduleFixture.createNestApplication();
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

      expect(response.body).toMatchObject({
        created_at: '2023-08-01T01:45:57.171Z',
        deleted_at: null,
        email: 'john.doe@example.com',
        id: 'google-oauth2|456734566205483104315',
        name: 'John Doe',
      });
    });

    it('should be able to return 404 for a nonexistent user', async () => {
      await request(app.getHttpServer())
        .get(`/user/${nonexistentUserId}`)

        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
