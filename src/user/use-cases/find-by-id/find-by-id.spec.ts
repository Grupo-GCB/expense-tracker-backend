import { NotFoundException } from '@nestjs/common';

import { User } from '@/user/infra/entities';
import { IUserRepository } from '@/user/interfaces';
import { FindUserByIdUseCase } from '@/user/use-cases';

describe('Find User By Id', () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let findUserUseCase: FindUserByIdUseCase;
  let findByIdMock: jest.SpyInstance;

  const userId = '123456';
  const nonExistentUserId = 'non-existent-user-id';

  const user: User = {
    id: userId,
    name: 'John Doe',
    email: 'johndoe@example.com',
    created_at: new Date(),
    wallet: [],
  };

  beforeAll(() => {
    userRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    findUserUseCase = new FindUserByIdUseCase(userRepository);
    findByIdMock = jest.spyOn(userRepository, 'findById');
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(findUserUseCase).toBeDefined();
    expect(findByIdMock).toBeDefined();
  });

  it('should be able to return an user', async () => {
    findByIdMock.mockResolvedValue(user);

    const result = await findUserUseCase.execute(userId);

    expect(result.user).toEqual(user);
    expect(findByIdMock).toHaveBeenCalledWith(userId);
    expect(findByIdMock).toHaveBeenCalledTimes(1);
  });

  it('should not be able to return an user', async () => {
    findByIdMock.mockResolvedValueOnce(null);

    await expect(
      findUserUseCase.execute(nonExistentUserId),
    ).rejects.toThrowError(new NotFoundException('Usuário não encontrado.'));
  });
});
