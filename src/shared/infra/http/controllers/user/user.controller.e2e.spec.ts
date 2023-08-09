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
import { User } from '@/user/infra/entities';

describe('UserController (E2E)', () => {
  let app: INestApplication;
  let usersRepository: IUserRepository;
  let jwtAuthProvider: IJwtAuthProvider;
  let findByEmailMock: jest.SpyInstance;
  let findByIdMock: jest.SpyInstance;
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
    nonexistentUserId = 'invalid-id';

    app = module.createNestApplication();
    usersRepository = module.get<IUserRepository>(IUserRepository);
    jwtAuthProvider = module.get<IJwtAuthProvider>(IJwtAuthProvider);

    findByIdMock = jest.spyOn(usersRepository, 'findById');
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
      findByIdMock.mockResolvedValue(userPayload);

      const response = await request(app.getHttpServer())
        .get(`/user/${userId}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject(userPayload);
    });

    it.only('should be able to return 404 for a nonexistent user', async () => {
      findByIdMock.mockRejectedValue(HttpStatus.NOT_FOUND);

      await request(app.getHttpServer())
        .get(`/user/${nonexistentUserId}`)

        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
