import {
  HttpStatus,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { IUserRepository, IDecodedTokenPayload } from '@/user/interfaces';
import { IJwtAuthProvider } from '@/auth/interfaces';

describe('UserController (E2E)', () => {
  let app: INestApplication;
  let usersRepository: IUserRepository;
  let jwtAuthProvider: IJwtAuthProvider;
  let findByEmailMock: jest.SpyInstance;
  let createUserMock: jest.SpyInstance;
  let decodeTokenMock: jest.SpyInstance;
  let userId: string;
  let nonexistentUserId: string;

  const userPayload: Pick<IDecodedTokenPayload, 'sub' | 'name' | 'email'> = {
    sub: 'auth0|58vfb567d5asdea52bc65ebba',
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(IUserRepository)
      .useValue({
        findByEmail: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
      })
      .overrideProvider(IJwtAuthProvider)
      .useValue({
        decodeToken: jest.fn(),
      })
      .compile();

    userId = 'google-oauth2|456734566205483104315';
    nonexistentUserId = 'google-oauth2|456354566205483104315';

    app = module.createNestApplication();
    usersRepository = module.get<IUserRepository>(IUserRepository);
    jwtAuthProvider = module.get<IJwtAuthProvider>(IJwtAuthProvider);

    findByEmailMock = jest.spyOn(usersRepository, 'findByEmail');
    createUserMock = jest.spyOn(usersRepository, 'create');
    decodeTokenMock = jest.spyOn(jwtAuthProvider, 'decodeToken');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/user/login (POST)', () => {
    it('should be able to return 200 if user already exists', async () => {
      findByEmailMock.mockResolvedValue(userPayload.email);
      decodeTokenMock.mockReturnValue(userPayload);

      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send({ token: 'valid-jwt-token' })
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        message: 'Usuário logado com sucesso.',
      });
    });

    it('should be able to return 201 and create a new user if the user does not exist', async () => {
      findByEmailMock.mockResolvedValue(null);
      createUserMock.mockResolvedValue(userPayload);
      decodeTokenMock.mockReturnValue(userPayload);

      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send({ token: 'valid-jwt-token' })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        message: 'Usuário criado com sucesso.',
      });
    });

    it('should be able to return 401 if token is invalid', async () => {
      decodeTokenMock.mockImplementation(() => {
        throw new UnauthorizedException('Token Inválido.');
      });

      await request(app.getHttpServer())
        .post('/user/login')
        .send({ token: 'invalid-jwt-token' })

        .expect(HttpStatus.UNAUTHORIZED);
    });
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
