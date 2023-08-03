import {
  HttpStatus,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';
import { IUserRepository, IDecodedTokenPayload } from '@/user/interfaces';
import { JwtAuthProvider } from '@/auth/providers';

describe('UserController (E2E)', () => {
  let app: INestApplication;
  let usersRepository: IUserRepository;
  let jwtAuthProvider: JwtAuthProvider;
  let findByEmailMock: jest.SpyInstance;
  let createUserMock: jest.SpyInstance;
  let decodeTokenMock: jest.SpyInstance;

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
      })
      .overrideProvider(JwtAuthProvider)
      .useValue({
        decodeToken: jest.fn(),
      })
      .compile();

    app = module.createNestApplication();
    usersRepository = module.get<IUserRepository>(IUserRepository);
    jwtAuthProvider = module.get<JwtAuthProvider>(JwtAuthProvider);

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
      expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        userPayload.email,
      );
      expect(usersRepository.create).not.toHaveBeenCalled();
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
      expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        userPayload.email,
      );
      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(userPayload);
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
});
