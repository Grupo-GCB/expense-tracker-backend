import { Test, TestingModule } from '@nestjs/testing';
import { IUsersRepository } from '@/user/interfaces';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { SaveUserDTO } from '@/user/dtos';
import { User } from '@/user/infra/entities';
import { SignInUseCase } from './sign-in';

describe('Sign In Use Case', () => {
  let signInUseCase: SignInUseCase;
  let usersRepository: IUsersRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
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
  });

  it('should be able to sign in a user with a valid token', async () => {
  });

  it('should be able to decode the JWT token correctly', async () => {
  });

  it('should not be able to sign in a user with an invalid token', async () => {
  });

  it.only('should be able to create a new user if the user does not exist', async () => {
    const token = 'valid-jwt-token';
    const userPayload: SaveUserDTO = {
      id: 'user-id',
      name: 'John Doe',
      email: 'john.doe@example.com',
    };
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({
      userPayload,
    });
    jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(null);
    jest
      .spyOn(usersRepository, 'create')
      .mockResolvedValue(userPayload as User);

    const newUser = await signInUseCase.execute(token);

    expect(newUser).toEqual(userPayload);
  });
});
