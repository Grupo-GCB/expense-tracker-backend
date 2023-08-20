import { NotFoundException } from '@nestjs/common';

import { User } from '@/user/infra/entities';
import { IUserRepository } from '@/user/interfaces';
import { FindUserByIdUseCase } from '@/user/use-cases';

describe('Find User By Id', () => {
  let findUserUseCase: FindUserByIdUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let findByIdMock: jest.SpyInstance;

  const userId = '123456';
  const nonExistentUserId = 'non-existent-user-id';

  beforeAll(() => {
    userRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    findUserUseCase = new FindUserByIdUseCase(userRepository);
    findByIdMock = jest.spyOn(userRepository, 'findById');
  });

  it('should be able to return an user', async () => {
    const user: User = {
      id: userId,
      name: 'John Doe',
      email: 'johndoe@example.com',
      created_at: new Date(),
      wallet: [],
    };

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
