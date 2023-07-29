import { Test, TestingModule } from '@nestjs/testing';
import { IDecodedTokenPayload, IUsersRepository } from '@/user/interfaces';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { SaveUserDTO } from '@/user/dtos';
import { User } from '@/user/infra/entities';
import { SignInUseCase } from './sign-in';

describe('Sign In Use Case', () => {
  let signInUseCase: SignInUseCase;
  let usersRepository: IUsersRepository;
  let jwtService: JwtService;

  let userPayload: Pick<IDecodedTokenPayload, 'sub' | 'name' | 'email'>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInUseCase,
        {
          provide: IUsersRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    signInUseCase = module.get<SignInUseCase>(SignInUseCase);
    usersRepository = module.get<IUsersRepository>(IUsersRepository);
    jwtService = module.get<JwtService>(JwtService);

    userPayload = {
      sub: 'user-id',
      name: 'diogo gallina',
      email: 'diogo.gallina@example.com',
    };
  });

  it('should be able to sign in an user with a valid token', async () => {
    const token = 'valid-jwt-token';

    const expectedUser: User = {
      id: 'anyUserId',
      name: 'anyUserName',
    } as User;
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(userPayload);
    jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(expectedUser);
    await signInUseCase.execute(token);

    expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userPayload.email);
    expect(usersRepository.create).not.toHaveBeenCalled();
  });

  it('should be able to decode the JWT token correctly', async () => {
    const token = 'valid-jwt-token';
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(userPayload);

    const decodedUserPayload = await signInUseCase['decodeToken'](token);

    expect(decodedUserPayload).toEqual({
      id: userPayload.sub,
      name: userPayload.name,
      email: userPayload.email,
    });
  });

  it('should be able to create a new user if the user does not exist', async () => {
    const token = 'valid-jwt-token';
    const userPayload: SaveUserDTO = {
      id: 'user-id',
      name: 'diogo gallina',
      email: 'diogo.gallina@example.com',
    };
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({
      userPayload,
    });
    jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(null);
    jest
      .spyOn(usersRepository, 'create')
      .mockResolvedValue(userPayload as User);

    const newUser = await signInUseCase.execute(token);

    expect(newUser).toEqual({
      id: userPayload.id,
      name: userPayload.name,
      email: userPayload.email,
    });
  });

  it('should not be able to sign in a user with an invalid token', async () => {
    const invalidToken = 'invalid-jwt-token';
    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockRejectedValue(new UnauthorizedException());

    await expect(signInUseCase.execute(invalidToken)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
