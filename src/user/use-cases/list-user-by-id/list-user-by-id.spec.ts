import { NotFoundException } from '@nestjs/common';

import { User } from '@/user/infra/entities';
import { ListUserByIdUseCase } from '@/user/use-cases';
import { IUserRepository } from '@/user/interfaces';

describe('Get User', () => {
  let listUserUseCase: ListUserByIdUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  const userId = '123456';
  const nonExistentUserId = 'non-existent-user-id';

  beforeAll(() => {
    userRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    listUserUseCase = new ListUserByIdUseCase(userRepository);
  });

  it('should be able to return an user', async () => {
    const user: User = {
      id: userId,
      name: 'John Doe',
      email: 'johndoe@example.com',
      created_at: new Date(),
      wallet: [],
    };

    userRepository.findById.mockResolvedValue(user);

    const result = await listUserUseCase.execute(userId);

    expect(result.user).toEqual(user);
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should not be able to return an user', async () => {
    userRepository.findById.mockResolvedValueOnce(null);

    await expect(
      listUserUseCase.execute(nonExistentUserId),
    ).rejects.toThrowError(new NotFoundException('Usuário não encontrado.'));
  });
});
