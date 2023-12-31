import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpStatus,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { IUserRepository, IDecodedTokenPayload } from '@/user/interfaces';
import { IJwtAuthProvider } from '@/auth/interfaces';

describe('User Controller (E2E)', () => {
  let app: INestApplication;
  let validUserId: string;
  let nonexistentUserId: string;
  let testModule: TestingModule;
  let userRepository: IUserRepository;
  let jwtAuthProvider: IJwtAuthProvider;
  let findByEmailMock: jest.SpyInstance;
  let findByIdMock: jest.SpyInstance;
  let createUserMock: jest.SpyInstance;
  let decodeTokenMock: jest.SpyInstance;

  beforeAll(async () => {
    testModule = await Test.createTestingModule({
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

    userRepository = testModule.get<IUserRepository>(IUserRepository);
    jwtAuthProvider = testModule.get<IJwtAuthProvider>(IJwtAuthProvider);

    findByIdMock = jest.spyOn(userRepository, 'findById');
    findByEmailMock = jest.spyOn(userRepository, 'findByEmail');
    createUserMock = jest.spyOn(userRepository, 'create');
    decodeTokenMock = jest.spyOn(jwtAuthProvider, 'decodeToken');

    app = testModule.createNestApplication();
    await app.init();

    validUserId = 'google-oauth2|456734566205483104315';
  });

  afterAll(async () => {
    await app.close();
  });

  const userPayload: Pick<IDecodedTokenPayload, 'sub' | 'name' | 'email'> = {
    sub: 'auth0|58vfb567d5asdea52bc65ebba',
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  describe('/user/login (POST)', () => {
    it('should be defined', () => {
      expect(userRepository).toBeDefined();
      expect(findByIdMock).toBeDefined();
      expect(findByEmailMock).toBeDefined();
      expect(createUserMock).toBeDefined();
      expect(decodeTokenMock).toBeDefined();
    });

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
    it('should be able to return 404 for a nonexistent user', async () => {
      await request(app.getHttpServer())
        .get(`/user/${nonexistentUserId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  it('should be able to return an existing user', async () => {
    findByIdMock.mockResolvedValue(userPayload);

    const response = await request(app.getHttpServer())
      .get(`/user/${validUserId}`)
      .expect(HttpStatus.OK);

    expect(response.body).toMatchObject(userPayload);
  });
});
