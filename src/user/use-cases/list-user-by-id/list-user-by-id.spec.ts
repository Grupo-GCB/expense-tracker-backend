import { NotFoundException } from '@nestjs/common';
import { User } from '@/user/infra/entities';
import { ListUserByIdUseCase } from './list-user-by-id';
import { IUserRepository } from '@/user/infra/interfaces';

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

  it('should be able to return an user when found', async () => {
    const user: User = {
      id: user_id,
      name: 'John Doe',
      email: 'johndoe@example.com',
      created_at: new Date(),
      wallet: [],
    };

    userRepository.findById.mockResolvedValue(user);

    const result = await listUserUseCase.execute(user_id);

    expect(result).toEqual(user);
    expect(userRepository.findById).toHaveBeenCalledWith(user_id);
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException when user is not found', async () => {
    userRepository.findById.mockResolvedValueOnce(null);

    await expect(
      listUserUseCase.execute(non_existent_user_id),
    ).rejects.toThrowError(new NotFoundException('Usuário não encontrado'));
  });
});
