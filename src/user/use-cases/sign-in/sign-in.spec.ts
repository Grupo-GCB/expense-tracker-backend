import { UnauthorizedException } from '@nestjs/common';

import { SignInUseCase } from '@/user/use-cases';
import { IDecodedTokenPayload, IUserRepository } from '@/user/interfaces';
import { IJwtAuthProvider } from '@/auth/interfaces';
import { SaveUserDTO } from '@/user/dto';

describe('Sign In Use Case', () => {
  let signInUseCase: SignInUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let jwtAuthProvider: jest.Mocked<IJwtAuthProvider>;
  let findByEmailMock: jest.SpyInstance;
  let createUserMock: jest.SpyInstance;
  let decodeTokenMock: jest.SpyInstance;
  let userPayload: Pick<IDecodedTokenPayload, 'sub' | 'name' | 'email'>;

  beforeAll(() => {
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    jwtAuthProvider = {
      decodeToken: jest.fn(),
    } as unknown as jest.Mocked<IJwtAuthProvider>;

    signInUseCase = new SignInUseCase(userRepository, jwtAuthProvider);

    userPayload = {
      sub: 'auth0|58vfb567d5asdea52bc65ebba',
      name: 'John Doe',
      email: 'john.doe@example.com',
    };

    findByEmailMock = jest.spyOn(userRepository, 'findByEmail');
    createUserMock = jest.spyOn(userRepository, 'create');
    decodeTokenMock = jest.spyOn(jwtAuthProvider, 'decodeToken');
  });

  beforeEach(() => {
    decodeTokenMock.mockReturnValue(userPayload);
  });

  const token = 'valid-jwt-token';
  const invalidToken = 'invalid-jwt-token';

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(jwtAuthProvider).toBeDefined();
    expect(findByEmailMock).toBeDefined();
    expect(createUserMock).toBeDefined();
    expect(decodeTokenMock).toBeDefined();
    expect(userPayload).toBeDefined();
  });

  it('should be able to return a success response if the user already exists', async () => {
    findByEmailMock.mockResolvedValue(userPayload.email);

    const result = await signInUseCase.execute(token);

    expect(result).toEqual({
      status: 200,
      message: 'Usuário logado com sucesso.',
    });
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(userPayload.email);
    expect(userRepository.create).not.toHaveBeenCalled();
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
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(userPayload.email);
    expect(userRepository.create).toHaveBeenCalledTimes(1);
    expect(userRepository.create).toHaveBeenCalledWith(userPayload);
  });

  it('should throw an exception if the token is invalid', async () => {
    decodeTokenMock.mockRejectedValue(UnauthorizedException);

    await expect(signInUseCase.execute(invalidToken)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(userRepository.findByEmail).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});
