import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

import { IDecodedTokenPayload, IUserRepository } from '@/user/interfaces';
import { SaveUserDTO } from '@/user/dto';
import { User } from '@/user/infra/entities';
import { SignInUseCase } from '@/user/use-cases';

describe('Sign In Use Case', () => {
  let signInUseCase: SignInUseCase;
  let usersRepository: IUserRepository;
  let jwtService: JwtService;

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
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    signInUseCase = module.get<SignInUseCase>(SignInUseCase);
    usersRepository = module.get<IUserRepository>(IUserRepository);
    jwtService = module.get<JwtService>(JwtService);

    userPayload = {
      sub: 'auth0|58vfb567d5asdea52bc65ebba',
      name: 'John Doe',
      email: 'john.doe@example.com',
    };
  });

  beforeEach(() => {
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(userPayload);
  });

  const mockFindByEmail = (user: User | null) => {
    jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(user);
  };

  const mockCreateUser = (user: SaveUserDTO) => {
    jest.spyOn(usersRepository, 'create').mockResolvedValue(user as User);
  };

  const token = 'valid-jwt-token';
  const invalidToken = 'invalid-jwt-token';

  it('should be able to sign in an user with a valid token', async () => {
    const expectedUser: User = {
      id: 'auth0|58vfb567d5asdea52bc65ebba',
      name: 'John Doe',
      email: 'john.doe@example.com',
    } as User;

    mockFindByEmail(expectedUser);
    await signInUseCase.execute(token);

    expect(usersRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepository.findByEmail).toHaveBeenCalledWith(userPayload.email);
    expect(usersRepository.create).not.toHaveBeenCalled();
  });

  it('should be able to decode the JWT token correctly', async () => {
    const decodedUserPayload = await signInUseCase['decodeToken'](token);

    expect(decodedUserPayload).toEqual({
      id: userPayload.sub,
      name: userPayload.name,
      email: userPayload.email,
    });
  });

  it('should be able to create a new user if the user does not exist', async () => {
    const userPayload: SaveUserDTO = {
      id: 'auth0|58vfb567d5asdea52bc65ebba',
      name: 'John Doe',
      email: 'john.doe@example.com',
    };

    mockFindByEmail(null);
    mockCreateUser(userPayload);

    await signInUseCase.execute(token);

    expect(usersRepository.create).toHaveBeenCalledTimes(1);
    expect(usersRepository.create).toHaveBeenCalledWith(userPayload);
  });

  it('should not be able to sign in a user with an invalid token', async () => {
    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockRejectedValue(new UnauthorizedException());

    await expect(signInUseCase.execute(invalidToken)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
