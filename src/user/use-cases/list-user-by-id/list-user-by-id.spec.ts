import { NotFoundException } from '@nestjs/common';

import { User } from '@/user/infra/entities';
import { ListUserByIdUseCase } from '@/user/use-cases';
import { IUserRepository } from '@/user/interfaces';
import { ListUserByIdInput } from '@/user/interfaces';

describe('Get User', () => {
  let listUserUseCase: ListUserByIdUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  const user_id = '123456';
  const non_existent_user_id = 'non_existent_user_id';

  beforeAll(() => {
    userRepository = {
      findById: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    listUserUseCase = new ListUserByIdUseCase(userRepository);
  });

  it('should be able to return an user', async () => {
    const user: User = {
      id: user_id,
      name: 'John Doe',
      email: 'johndoe@example.com',
      created_at: new Date(),
      wallet: [],
    };

    userRepository.findById.mockResolvedValue(user);

    const input: ListUserByIdInput = {
      user_id: user_id,
    };

    const result = await listUserUseCase.execute(input);

    expect(result.user).toEqual(user);
    expect(userRepository.findById).toHaveBeenCalledWith(user_id);
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should not be able to return an user when not found', async () => {
    userRepository.findById.mockResolvedValueOnce(null);

    const input: ListUserByIdInput = {
      user_id: non_existent_user_id,
    };

    await expect(listUserUseCase.execute(input)).rejects.toThrowError(
      new NotFoundException('Usuário não encontrado'),
    );
  });
});
