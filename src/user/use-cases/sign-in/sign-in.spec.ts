import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { IDecodedTokenPayload, IUserRepository } from '@/user/interfaces';
import { SaveUserDTO } from '@/user/dto';
import { SignInUseCase } from '@/user/use-cases';
import { JwtAuthProvider } from '@/auth/providers';

describe('Sign In Use Case', () => {
  let signInUseCase: SignInUseCase;
  let usersRepository: IUserRepository;
  let jwtAuthProvider: JwtAuthProvider;
  let findByEmailMock: jest.SpyInstance;
  let createUserMock: jest.SpyInstance;
  let decodeTokenMock: jest.SpyInstance;

  let userPayload: Pick<IDecodedTokenPayload, 'sub' | 'name' | 'email'>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInUseCase,
        {
          provide: IUserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtAuthProvider,
          useValue: {
            decodeToken: jest.fn(),
          },
        },
      ],
    }).compile();

    signInUseCase = module.get<SignInUseCase>(SignInUseCase);
    usersRepository = module.get<IUserRepository>(IUserRepository);
    jwtAuthProvider = module.get<JwtAuthProvider>(JwtAuthProvider);

    userPayload = {
      sub: 'auth0|58vfb567d5asdea52bc65ebba',
      name: 'John Doe',
      email: 'john.doe@example.com',
    };

    findByEmailMock = jest.spyOn(usersRepository, 'findByEmail');
    createUserMock = jest.spyOn(usersRepository, 'create');
    decodeTokenMock = jest.spyOn(jwtAuthProvider, 'decodeToken');
  });

  beforeEach(() => {
    decodeTokenMock.mockReturnValue(userPayload);
  });

  const token = 'valid-jwt-token';
  const invalidToken = 'invalid-jwt-token';

  it('Should return 200 if user already exists', async () => {
    findByEmailMock.mockResolvedValue(userPayload.email);

    const result = await signInUseCase.execute(token);

    expect(result).toEqual({
      status: 200,
      message: 'Usuário logado com sucesso.',
    });
    expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userPayload.email);
    expect(usersRepository.create).not.toHaveBeenCalled();
  });

  it('should be able to create a new user if the user does not exist', async () => {
    const createdUser: SaveUserDTO = {
      id: userPayload.sub,
      name: userPayload.name,
      email: userPayload.email,
    };

    findByEmailMock.mockResolvedValue(null);
    createUserMock.mockResolvedValue(createdUser);

    const result = await signInUseCase.execute(token);

    expect(result).toEqual({
      status: 201,
      message: 'Usuário criado com sucesso.',
    });
    expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userPayload.email);
    expect(usersRepository.create).toHaveBeenCalledTimes(1);
    expect(usersRepository.create).toHaveBeenCalledWith(userPayload);
  });

  it('Should return 200 if user already exists', async () => {
    decodeTokenMock.mockRejectedValue(UnauthorizedException);

    await expect(signInUseCase.execute(invalidToken)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(usersRepository.findByEmail).not.toHaveBeenCalled();
    expect(usersRepository.create).not.toHaveBeenCalled();
  });
});
